#include <assert.h>
#include <ctype.h>
#include <signal.h>
#include <errno.h>
#include <fcntl.h>
#include <poll.h>
#include <regex.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#include "asgn2_helper_funcs.h"

const int TIMEOUT = 50;

int read_bytes(int infile, char *buf, int to_read) {
    int bytes_read = 0;
    int reading = 0;

    while (true) {
        struct pollfd asdf;
        asdf.fd = infile;
        asdf.events = POLLIN;
        int result = poll(&asdf, 1, TIMEOUT);
        if (result == -1) {
            perror("failed epoll");
            exit(EXIT_FAILURE);
        }
        if (result == 0) {
            break;
        }
        reading = read(infile, buf, to_read);
        if (reading == -1) {
            perror("failed read");
            exit(EXIT_FAILURE);
        }
        bytes_read += reading;
        buf += reading;
        to_read -= reading;
        if (reading == 0) {
            break;
        }
        if (to_read == 0) {
            break;
        }
    }
    return bytes_read;
}

void response_error_code(int connection_fd, int code) {
    int num_written;

    char header[] = "HTTP/1.1 ";
    // minus 1 to ignore '\0'
    num_written = write_n_bytes(connection_fd, header, sizeof(header) - 1);
    if (num_written != sizeof(header) - 1) {
        exit(EXIT_FAILURE);
    }

    char digit1 = '0' + (code / 100);
    char digit2 = '0' + (code % 100) / 10;
    char digit3 = '0' + (code % 10);

    char buf[4] = { digit1, digit2, digit3, ' ' };
    num_written = write_n_bytes(connection_fd, buf, 4);
    if (num_written != 4) {
        exit(EXIT_FAILURE);
    }

    int phrase_len;
    char *phrase;
    switch (code) {
    case 200:
        phrase_len = 2;
        phrase = "OK";
        break;
    case 201:
        phrase_len = 7;
        phrase = "Created";
        break;
    case 400:
        phrase_len = 11;
        phrase = "Bad Request";
        break;
    case 403:
        phrase_len = 9;
        phrase = "Forbidden";
        break;
    case 404:
        phrase_len = 9;
        phrase = "Not Found";
        break;
    case 500:
        phrase_len = 21;
        phrase = "Internal Server Error";
        break;
    case 501:
        phrase_len = 15;
        phrase = "Not Implemented";
        break;
    case 505:
        phrase_len = 21;
        phrase = "Version Not Supported";
        break;
    default: assert(false);
    }

    num_written = write_n_bytes(connection_fd, phrase, phrase_len);
    if (num_written != phrase_len) {
        exit(EXIT_FAILURE);
    }
    num_written = write_n_bytes(connection_fd, "\r\n", 2);
    if (num_written != 2) {
        exit(EXIT_FAILURE);
    }

    num_written = write_n_bytes(connection_fd, "Content-Length: ", 16);
    if (num_written != 16) {
        exit(EXIT_FAILURE);
    }

    char len_digit1 = '0' + ((phrase_len + 1) / 10);
    char len_digit2 = '0' + ((phrase_len + 1) % 10);
    if (len_digit1 != '0') {
        num_written = write_n_bytes(connection_fd, &len_digit1, 1);
        if (num_written != 1) {
            exit(EXIT_FAILURE);
        }
    }
    num_written = write_n_bytes(connection_fd, &len_digit2, 1);
    if (num_written != 1) {
        exit(EXIT_FAILURE);
    }

    num_written = write_n_bytes(connection_fd, "\r\n\r\n", 4);
    if (num_written != 4) {
        exit(EXIT_FAILURE);
    }

    num_written = write_n_bytes(connection_fd, phrase, phrase_len);
    if (num_written != phrase_len) {
        exit(EXIT_FAILURE);
    }
    num_written = write_n_bytes(connection_fd, "\n", 1);
    if (num_written != 1) {
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char **argv) {
    printf("START\n");
    signal(SIGPIPE, SIG_IGN);
    // Socket
    if (argc != 2) {
        fprintf(stderr, "Invalid usage\n");
        exit(1);
    }

    char *port_string = argv[1];
    int port_num = 0;
    for (int i = 0; port_string[i] != '\0'; i++) {
        port_num *= 10;
        if (!isdigit(port_string[i])) {
            fprintf(stderr, "Port has non digit in it\n");
            exit(1);
        }
        port_num += port_string[i] - '0';
    }

    Listener_Socket sock;
    int results = listener_init(&sock, port_num);

    if (results != 0) {
        fprintf(stderr, "Invalid Port\n");
        exit(1);
    }

    char status_line_pattern[] = "^([a-zA-Z]{1,8}) (\\/[^ ]{2,64}) (HTTP\\/[0-9]\\.[0-9])\r\n";
    char get_headers_pattern[] = "^([a-zA-Z0-9.-]{1,128}\\: [^[:cntrl:]]*\r\n)*\r\n";
    char put_headers_pattern[] = "^([a-zA-Z0-9.-]{1,128}\\: [^[:cntrl:]]*\r\n)*(Content-Length: "
                                 "([0-9]+)\r\n)([a-zA-Z0-9.-]{1,128}\\: [^[:cntrl:]]*\r\n)*\r\n";

    int err_code;

    regex_t request_line_regex;
    regex_t get_header_regex;
    regex_t put_header_regex; //, body_regex;

    if ((err_code = regcomp(&request_line_regex, status_line_pattern, REG_EXTENDED))) {
        fprintf(stderr, "Error compiling status line regex, code = %d\n", err_code);
        exit(EXIT_FAILURE);
    }
    assert(request_line_regex.re_nsub == 3);

    if ((err_code = regcomp(&get_header_regex, get_headers_pattern, REG_EXTENDED))) {
        fprintf(stderr, "Error compiling header regex, code = %d\n", err_code);
        exit(EXIT_FAILURE);
    }
    assert(get_header_regex.re_nsub == 1);

    if ((err_code = regcomp(&put_header_regex, put_headers_pattern, REG_EXTENDED))) {
        fprintf(stderr, "Error compiling header regex, code = %d\n", err_code);
        exit(EXIT_FAILURE);
    }
    assert(put_header_regex.re_nsub == 4);

    // Listen/accept
    int connection_fd;
    char buffer[2049];
    int num_check;

    while (true) {
        connection_fd = listener_accept(&sock);

        num_check = read_bytes(connection_fd, buffer, 2048);
        buffer[num_check] = '\0';

        regmatch_t request_matches[4];
        if (regexec(&request_line_regex, buffer, 4, request_matches, 0)) {
            response_error_code(connection_fd, 400);
            goto end_loop;
        }
        int total_request_start = request_matches[0].rm_so;
        int total_request_len = (int) (request_matches[0].rm_eo - request_matches[0].rm_so);
        int method_start = request_matches[1].rm_so;
        int method_len = (int) (request_matches[1].rm_eo - request_matches[1].rm_so);
        int uri_start = request_matches[2].rm_so;
        int uri_len = (int) (request_matches[2].rm_eo - request_matches[2].rm_so);
        int version_start = request_matches[3].rm_so;
        int version_len = (int) (request_matches[3].rm_eo - request_matches[3].rm_so);
        assert(total_request_start == 0);
        assert(total_request_len < num_check);

        if (method_len != 3) {
            response_error_code(connection_fd, 501);
            goto end_loop;
        }
        bool is_get = memcmp(&buffer[method_start], "GET", 3) == 0;
        bool is_put = memcmp(&buffer[method_start], "PUT", 3) == 0;

        if ((!is_get) && (!is_put)) {
            response_error_code(connection_fd, 501);
            goto end_loop;
        }

        assert(version_len == 8);
        if (memcmp(&buffer[version_start], "HTTP/1.1", 8)) {
            response_error_code(connection_fd, 505);
            goto end_loop;
        }

        assert(uri_len >= 2);
        buffer[uri_start + uri_len] = '\0';
        uri_start++; // skip the / in front
        char *uri_str = &buffer[uri_start];
        char *rest_header = buffer + total_request_len;
        if (is_get) {
            regmatch_t header_matches[2];
            if (regexec(&get_header_regex, rest_header, 2, header_matches, 0)) {
                response_error_code(connection_fd, 400);
                goto end_loop;
            }

            int fd = open(uri_str, O_RDONLY);
            if (fd == -1) {
                if (errno == EACCES) {
                    response_error_code(connection_fd, 403);
                } else if (errno == ENOENT) {
                    response_error_code(connection_fd, 404);
                } else {
                    response_error_code(connection_fd, 500);
                }
                goto end_loop;
            }

            struct stat stat;

            if (fstat(fd, &stat) == -1) {
                response_error_code(connection_fd, 500);
                if (close(fd) == -1) {
                    perror("failed closing");
                    exit(EXIT_FAILURE);
                }
                goto end_loop;
            }

            if (S_ISDIR(stat.st_mode)) {
                response_error_code(connection_fd, 403);
                if (close(fd) == -1) {
                    perror("failed closing");
                    exit(EXIT_FAILURE);
                }
                goto end_loop;
            }

            int num_written;
            char header[] = "HTTP/1.1 ";
            // minus 1 to ignore '\0'
            num_written = write_n_bytes(connection_fd, header, sizeof(header) - 1);
            if (num_written != sizeof(header) - 1) {
                exit(EXIT_FAILURE);
            }

            num_written = write_n_bytes(connection_fd, "200 OK\r\nContent-Length: ", 24);
            if (num_written != 24) {
                exit(EXIT_FAILURE);
            }
            long long max = 1;
            while (max < stat.st_size) {
                max *= 10;
            }
            if (max == 0) {
                max = 1;
            }
            while (max != 0) {
                char digit = '0' + ((stat.st_size) % (max * 10)) / max;
                num_written = write_n_bytes(connection_fd, &digit, 1);
                if (num_written != 1) {
                    exit(EXIT_FAILURE);
                }
                max /= 10;
            }

            num_written = write_n_bytes(connection_fd, "\r\n\r\n: ", 4);
            if (num_written != 4) {
                exit(EXIT_FAILURE);
            }
            //      printf("size = %ld\n", stat.st_size);
            int asd = pass_n_bytes(fd, connection_fd, stat.st_size);
            //      printf("asd = %d\n", asd);
            (void) asd;
            //      printf("idk: %s\n", strerror(errno));

            if (close(fd) == -1) {
                perror("failed closing");
                exit(EXIT_FAILURE);
            }
        } else if (is_put) {
            regmatch_t header_matches[5];
            if (regexec(&put_header_regex, rest_header, 5, header_matches, 0)) {
                response_error_code(connection_fd, 400);
                goto end_loop;
            }
            int content_len_start = header_matches[3].rm_so;
            int content_len_end = header_matches[3].rm_eo;

            int content_len = 0;
            for (int i = content_len_start; i < content_len_end; i++) {
                content_len *= 10;
                content_len += rest_header[i] - '0';
            }

            bool create = false;
            int fd = open(uri_str, O_WRONLY | O_TRUNC, 420);
            if (fd == -1) {
                if (errno == ENOENT) {
                    create = true;
                } else if (errno == EACCES) {
                    response_error_code(connection_fd, 403);
                    goto end_loop;
                }
            }

            if (create) {
                fd = open(uri_str, O_WRONLY | O_TRUNC | O_CREAT, 420);
            }

            int buf_leftover = num_check - (total_request_len + header_matches[0].rm_eo);
            write_n_bytes(fd, rest_header + header_matches[0].rm_eo, buf_leftover);
            int leftover = content_len - buf_leftover;
            if (pass_n_bytes(connection_fd, fd, leftover) != 0) {
                exit(EXIT_FAILURE);
            }

            if (create) {
                response_error_code(connection_fd, 201);
            } else {
                response_error_code(connection_fd, 200);
            }
            if (close(fd) == -1) {
                perror("failed closing");
                exit(EXIT_FAILURE);
            }
        } else {
            assert(false);
        }

    end_loop:
        if (close(connection_fd) == -1) {
            perror("failed closing");
            exit(EXIT_FAILURE);
        }
    }
    regfree(&request_line_regex);
    regfree(&get_header_regex);
    regfree(&put_header_regex);
}
