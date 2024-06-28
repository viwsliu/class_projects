#include "helpers/asgn2_helper_funcs.h"
#include "helpers/connection.h"
#include "helpers/queue.h"
#include "helpers/response.h"
#include "helpers/rwlock.h"
#include <assert.h>
#include <errno.h>
#include <fcntl.h>
#include <getopt.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

const int REQUESTS_QUEUE_SIZE = 25;

queue_t *requests_untaken;

// files syncronization
pthread_mutex_t lock_files;
int NUM_FILES;
char **file_names;
int *file_num_using_lock;
rwlock_t **file_locks;

// parse args and check for errors
int parse_stol(char *str) {
    char *end;
    int out = strtol(str, &end, 10);
    if (*end != '\0') {
        exit(EXIT_FAILURE);
    }
    return out;
}

int find_file_index(char *filename) {
    int index = -1;
    for (int a = 0; a < NUM_FILES; a++) {
        if (file_names[a] != NULL) {
            if (strcmp(file_names[a], filename) == 0) {
                index = a;
                assert(file_num_using_lock[a] > 0);
                file_num_using_lock[a]++;
            }
        }
    }

    return index;
}

int create_new_file_lock(char *filename) {
    for (int a = 0; a < NUM_FILES; a++) {
        if (file_names[a] == NULL) {
            // copy string so no use after free
            file_names[a] = (char *) malloc((strlen(filename) + 1) * sizeof(char));
            strcpy(file_names[a], filename);
            // make the lock
            file_locks[a] = rwlock_new(WRITERS, 0);
            file_num_using_lock[a] = 1;
            return a;
        }
    }
    exit(EXIT_FAILURE); // no space left
}

int find_file_or_make_new_lock(char *filename) {
    int index = find_file_index(filename);
    if (index == -1) {
        index = create_new_file_lock(filename);
    }
    return index;
}

int reader_lock_filename(char *filename) {
    pthread_mutex_lock(&lock_files);
    int index = find_file_or_make_new_lock(filename);
    reader_lock(file_locks[index]);
    pthread_mutex_unlock(&lock_files);
    return index;
}

int writer_lock_filename(char *filename) {
    pthread_mutex_lock(&lock_files);
    int index = find_file_or_make_new_lock(filename);
    writer_lock(file_locks[index]);
    pthread_mutex_unlock(&lock_files);
    return index;
}

void delete_lock_if_needed(int index) {
    if (file_num_using_lock[index] == 0) { // no more threads using this lock
        rwlock_delete(&file_locks[index]);
        free(file_names[index]);
        file_names[index] = NULL;
    }
}

void reader_unlock_filename(int index) {
    reader_unlock(file_locks[index]);
    pthread_mutex_lock(&lock_files);
    file_num_using_lock[index] -= 1;
    delete_lock_if_needed(index);
    pthread_mutex_unlock(&lock_files);
}
void writer_unlock_filename(int index) {
    writer_unlock(file_locks[index]);
    pthread_mutex_lock(&lock_files);
    file_num_using_lock[index] -= 1;
    delete_lock_if_needed(index);
    pthread_mutex_unlock(&lock_files);
}

void audit(FILE *stream, const Response_t *response_code, conn_t *conn) {
    //====================
    // make a buffer on the stack
    const int BUF_SIZE = 4096;
    char buffer[BUF_SIZE];

    //====================
    // get request id header
    char *id = conn_get_header(conn, "Request-Id");

    //====================
    // put audit into buffer
    snprintf(buffer, BUF_SIZE, "%s,%s,%d,%s\n", request_get_str(conn_get_request(conn)),
        conn_get_uri(conn), response_get_code(response_code), id);

    //====================
    // atomically write audit to stream using fprintf
    fprintf(stream, "%s", buffer);
}

const Response_t *connection_get(conn_t *conn) {
    //====================
    // open file
    char *filename = conn_get_uri(conn);
    int fd = open(filename, O_RDONLY);

    //====================
    // if can't open file then report the problem
    if (fd == -1) {
        const Response_t *out = &RESPONSE_FORBIDDEN;
        if (errno == EACCES) {
            out = &RESPONSE_FORBIDDEN;
        } else if (errno == ENOENT) {
            out = &RESPONSE_NOT_FOUND;
        } else {
            out = &RESPONSE_INTERNAL_SERVER_ERROR;
        }
        conn_send_response(conn, out);
        return out;
    }

    //====================
    // make sure its a file not a directory
    struct stat buf;
    int stat_res = fstat(fd, &buf);

    const Response_t *out = NULL;
    if (stat_res == -1) {
        out = &RESPONSE_INTERNAL_SERVER_ERROR;
    } else if (S_ISDIR(buf.st_mode)) {
        out = &RESPONSE_FORBIDDEN;
    }
    if (out != NULL) {
        conn_send_response(conn, out);
        close(fd);
        return out;
    }

    //====================
    // transfer the file contents
    conn_send_file(conn, fd, buf.st_size);
    return &RESPONSE_OK;
}

const Response_t *connection_put(conn_t *conn) {
    //====================
    // open file
    char *filename = conn_get_uri(conn);
    int fd = open(filename, (O_CREAT | O_EXCL) | (O_WRONLY | O_TRUNC), 420);

    //====================
    // if can't open file then report the problem
    bool already_exists = false;
    if (fd == -1) {
        const Response_t *out = NULL;
        if (errno == EEXIST) {
            //====================
            // tried to create but already existed, this isn't an error so set the
            // status then reopen it
            already_exists = true;
            fd = open(filename, O_WRONLY | O_TRUNC);
            //====================
            // if can't open file (again) then report the problem
            if (fd == -1) {
                if (errno == EACCES) {
                    out = &RESPONSE_FORBIDDEN;
                } else {
                    out = &RESPONSE_INTERNAL_SERVER_ERROR;
                }
            }
        } else if (errno == EACCES) {
            out = &RESPONSE_FORBIDDEN;
        } else {
            out = &RESPONSE_INTERNAL_SERVER_ERROR;
        }
        if (out != NULL) {
            conn_send_response(conn, out);
            return out;
        }
    }

    //====================
    // save the file
    conn_recv_file(conn, fd);

    //====================
    // do response code;
    const Response_t *response_val;
    if (already_exists) {
        response_val = &RESPONSE_OK;
    } else {
        response_val = &RESPONSE_CREATED;
    }
    conn_send_response(conn, response_val);
    close(fd);
    return response_val;
}

void do_connection(conn_t *conn) {
    //====================
    // parse http request
    const Response_t *parse_response = conn_parse(conn);
    if (parse_response != NULL) { // if pad parse then respond and return early
        conn_send_response(conn, parse_response);
        return;
    }

    //====================
    // get method
    const Request_t *method = conn_get_request(conn);

    //====================
    // handle method, save response code
    const Response_t *response;
    int lock_index;
    if (method == &REQUEST_GET) {
        lock_index = reader_lock_filename(conn_get_uri(conn));
        response = connection_get(conn);
    } else if (method == &REQUEST_PUT) {
        lock_index = writer_lock_filename(conn_get_uri(conn));
        response = connection_put(conn);
    } else if (method == &REQUEST_UNSUPPORTED) {
        response = &RESPONSE_NOT_IMPLEMENTED;
        conn_send_response(conn, response);
    } else {
        exit(EXIT_FAILURE); // shouldn't happend
    }

    //====================
    // write audit
    audit(stderr, response, conn);

    if (method == &REQUEST_GET) {
        reader_unlock_filename(lock_index);
    } else if (method == &REQUEST_PUT) {
        writer_unlock_filename(lock_index);
    }
}

void *worker_thread(void *arg) {
    (void) arg; // ignore arg

    //=============================
    // run forever
    while (true) {
        //====================
        // get fd from queue
        int *fd_ptr;
        queue_pop(requests_untaken, (void **) &fd_ptr);
        //====================
        // build new connection "wrapper"
        conn_t *conn = conn_new(*fd_ptr);
        //====================
        // do http protocol
        do_connection(conn);
        //====================
        // close connection and cleanup memory allocation
        conn_delete(&conn);
        close(*fd_ptr);
        free(fd_ptr);
    }
    return 0;
}

int main(int argc, char *argv[]) {
    //=========================================
    // parse opts
    int num_threads = 4;
    int opt;
    while ((opt = getopt(argc, argv, "t:")) != -1) {
        if (opt == 't') {
            num_threads = parse_stol(optarg);
        } else {
            exit(EXIT_FAILURE);
        }
    }

    if (optind >= argc) {
        exit(EXIT_FAILURE);
    }

    int port = parse_stol(argv[optind]);

    //=========================================
    // init queue
    requests_untaken = queue_new(REQUESTS_QUEUE_SIZE);

    //=========================================
    // create workers
    pthread_mutex_init(&lock_files, NULL);
    pthread_t *thread_stuff = (pthread_t *) malloc(num_threads * sizeof(pthread_t));

    NUM_FILES = num_threads * 2; //?? make big enough so it doesn't overlap
    file_names = (char **) malloc(NUM_FILES * sizeof(char *));
    file_num_using_lock = (int *) malloc(NUM_FILES * sizeof(int));
    file_locks = (rwlock_t **) malloc(NUM_FILES * sizeof(rwlock_t *));

    for (int a = 0; a < NUM_FILES; a++) {
        file_names[a] = NULL;
    }

    for (int a = 0; a < num_threads; a++) {
        if (pthread_create(&thread_stuff[a], NULL, worker_thread, NULL)) {
            exit(EXIT_FAILURE);
        }
    }

    //=========================================
    // create listener
    Listener_Socket listener;
    if (listener_init(&listener, port)) {
        exit(EXIT_FAILURE);
    }

    //=========================================
    // run dispatch forever
    while (true) {
        int fd = listener_accept(&listener);
        if (fd != -1) {
            int *fd_in_heap = (int *) malloc(sizeof(int));
            *fd_in_heap = fd;
            queue_push(requests_untaken, (void *) fd_in_heap);
        }
    }
}
