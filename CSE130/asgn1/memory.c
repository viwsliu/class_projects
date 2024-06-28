#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdint.h>
#include <linux/limits.h>
#include <fcntl.h>
#include <ctype.h>
#include <stdbool.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/stat.h>

int read_bytes(int infile, uint8_t *buf, int to_read) {
    int bytes_read = 0;
    int reading = 0;
    while ((reading = read(infile, buf, to_read)) != 0) {
        if (reading == -1) {
            fprintf(stderr, "Operation failed\n");
            exit(EXIT_FAILURE);
        }
        bytes_read += reading;
        buf += reading;
        to_read -= reading;
    }
    return bytes_read;
}

int write_bytes(int outfile, uint8_t *buf, int to_write) {
    int bytes_written = 0;
    int wrote;
    while ((wrote = write(outfile, buf, to_write)) != 0) {
        if (wrote == -1) {
            fprintf(stderr, "Operation failed\n");
            exit(EXIT_FAILURE);
        }
        bytes_written += wrote;
        buf += wrote;
        to_write -= wrote;
    }
    return bytes_written;
}

bool check_is_file(char *filename) {
    struct stat path_stat;
    int oo = stat(filename, &path_stat);
    if (oo == -1) {
        if (errno == ENOENT) {
            fprintf(stderr, "Invalid Command\n");
        } else if (errno == ENAMETOOLONG) {
            fprintf(stderr, "Invalid Command\n");
        } else {
            fprintf(stderr, "Operation failed\n");
        }
        exit(1);
    }
    return S_ISREG(path_stat.st_mode);
}

int main() {
    uint8_t command[4];
    uint8_t path[PATH_MAX];
    uint8_t get_output[4096];

    int remaining = 4096;
    read_bytes(STDIN_FILENO, command, 4);
    //get
    if ((command[0] == 'g') && (command[1] == 'e') && (command[2] == 't') && (command[3] == '\n')) {
        int bytes_read = read_bytes(STDIN_FILENO, path, PATH_MAX);
        if (path[bytes_read - 1] == '\n') {
            path[bytes_read - 1] = '\0';
            if (!check_is_file((char *) path)) {
                fprintf(stderr, "Invalid Command\n");
                return 1;
            }
            int filedescr = open((char *) path, O_RDONLY);
            if (filedescr < 0) {
                fprintf(stderr, "Invalid Command\n");
                return 1;
            } else {
                while (remaining != 0) {
                    int num_read = read_bytes(filedescr, get_output, 4096);
                    remaining = write_bytes(STDOUT_FILENO, get_output, num_read);
                    //printf("remaining: %d\n", remaining);
                }
                return 0;
            }
        } else {
            fprintf(stderr, "Invalid Command\n");
            return 1;
        }
    }
    //set
    else if ((command[0] == 's') && (command[1] == 'e') && (command[2] == 't')
             && (command[3] == '\n')) {
        int bytes_read = read_bytes(STDIN_FILENO, path, PATH_MAX);
        int message_start; //marks index of start of message
        int count = 0; //count number of newlines
        int total_text_size = 0; //counts message size
        for (int i = 0; i < bytes_read; i++) {
            if (count == 1) {
                bool thing = isdigit((int) path[i]);
                if (thing == true) {
                    total_text_size = (total_text_size * 10) + (path[i] - 48);
                }
            }
            if (path[i] == '\n') {
                if (count == 0) {
                    path[i] = '\0';
                }
                if (count == 1) {
                    message_start = i + 1;
                    //printf("broke at %d\n", i);
                    break;
                }

                count += 1;
            }
        }
        //open file / new file
        int filedescr = open((char *) path, O_CREAT | O_WRONLY | O_TRUNC | O_RDONLY, 420);
        if (filedescr == -1) {
            fprintf(stderr, "Invalid Command\n");
            return 1;
        }

        int written = 0;
        written = write_bytes(filedescr, path + message_start, bytes_read - message_start);

        while (true) {

            int chunk_read = read_bytes(STDIN_FILENO, path, PATH_MAX);
            if (chunk_read == 0) {
                break;
            }
            written = write_bytes(filedescr, path, chunk_read);
            total_text_size = total_text_size - written;
        }
        printf("OK\n");
        return 0;
    } else {
        fprintf(stderr, "Invalid Command\n");
        return 1;
    }
}
