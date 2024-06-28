#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <assert.h>
#include <getopt.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define FIFO 123
#define LRU  456
#define CLK  789

void print_usage(void) {
    fprintf(stderr, "Usage:\nprog -N size policy\n");
}

int read_byte(void) {
    char byte;
    int len = read(STDIN_FILENO, &byte, 1);
    if (len == -1) {
        perror("reading byte failed");
        exit(EXIT_FAILURE);
    }
    if (len == 0) { // EOF
        return -1;
    }

    return byte;
}

int main(int argc, char *argv[]) {

    int size;
    int policy;

    if ((argc != 4) && (argc != 3)) {
        print_usage();
        exit(EXIT_FAILURE);
    }

    if ((strlen(argv[1]) == 2) && (argv[1][0] == '-') && (argv[1][1] == 'N')) {
        size = atoi(argv[2]);
    } else {
        print_usage();
        exit(EXIT_FAILURE);
    }

    if (argc == 3) {
        policy = FIFO;
    } else {
        if ((strlen(argv[3]) == 2) && (argv[3][0] == '-')) {
            if (argv[3][1] == 'F') {
                policy = FIFO;
            } else if (argv[3][1] == 'L') {
                policy = LRU;

            } else if (argv[3][1] == 'C') {
                policy = CLK;
            } else {
                print_usage();
                exit(EXIT_FAILURE);
            }
        } else {
            print_usage();
            exit(EXIT_FAILURE);
        }
    }
    int num_cap_misses = 0;
    int num_com_misses = 0;

    char *seen = malloc(0);
    int num_seen = 0;
    char *cache = malloc(size * sizeof(char));
    bool *cache_used = malloc(size * sizeof(bool));
    int fifo_total_used = 0;
    int *fifo_added_order = NULL;
    if (policy == FIFO) {
        fifo_added_order = malloc(size * sizeof(int));
    }
    int lru_timestamp = 0;
    int *lru_used_order = NULL;
    if (policy == LRU) {
        lru_used_order = malloc(size * sizeof(int));
    }
    int clock_hand_pos = 0;
    bool *clock_referenced = malloc(size * sizeof(bool));

    for (int i = 0; i < size; i++) {
        cache_used[i] = false;
        if (policy == FIFO) {
            fifo_added_order[i] = 0;
        }
        if (policy == LRU) {
            lru_used_order[i] = 0;
        }
        if (policy == CLK) {
            clock_referenced[i] = false;
        }
    }

    while (true) {
        int byte = read_byte();
        if (byte == -1) { // EOF
            break;
        }
        int following_byte = read_byte();
        if (!((following_byte == -1) || (following_byte == '\n'))) {
            fprintf(stderr, "unexpected byte = %d\n", following_byte);
            exit(EXIT_FAILURE);
        }
        int hit_pos = -1;
        for (int i = 0; i < size; i++) {
            if (cache_used[i]) {
                if (cache[i] == byte) {
                    hit_pos = i;
                    break;
                }
            }
        }

        if (policy == FIFO) {
            if (hit_pos == -1) { // only insert if missed
                int insert_pos = -1;
                int oldest_found = -1;
                for (int i = 0; i < size; i++) {
                    if ((oldest_found == -1) || (fifo_added_order[i] < oldest_found)) {
                        insert_pos = i;
                        oldest_found = fifo_added_order[i];
                    }
                }
                cache[insert_pos] = byte;
                cache_used[insert_pos] = true;
                fifo_total_used++;
                fifo_added_order[insert_pos] = fifo_total_used;
            }
        } else if (policy == LRU) {
            if (hit_pos == -1) {
                int insert_pos = -1;
                int oldest_found = -1;
                for (int i = 0; i < size; i++) {
                    if ((oldest_found == -1) || (lru_used_order[i] < oldest_found)) {
                        insert_pos = i;
                        oldest_found = lru_used_order[i];
                    }
                }
                cache[insert_pos] = byte;
                cache_used[insert_pos] = true;
                lru_timestamp++;
                lru_used_order[insert_pos] = lru_timestamp;
            } else {
                lru_timestamp++;
                lru_used_order[hit_pos] = lru_timestamp;
            }
        } else if (policy == CLK) {
            if (hit_pos == -1) {
                while (true) {
                    if (clock_referenced[clock_hand_pos]) {
                        clock_referenced[clock_hand_pos] = false;
                    } else {
                        break;
                    }
                    clock_hand_pos = (clock_hand_pos + 1) % size;
                }
                cache[clock_hand_pos] = byte;
                cache_used[clock_hand_pos] = true;
                clock_referenced[clock_hand_pos] = true;
            } else {
                clock_referenced[hit_pos] = true;
                ;
            }
        } else {
            assert(false);
        }

        bool was_seen = false;
        for (int i = 0; i < num_seen; i++) {
            if (seen[i] == byte) {
                was_seen = true;
            }
        }
        if (!was_seen) {
            num_seen++;
            seen = realloc(seen, sizeof(char) * num_seen);
            seen[num_seen - 1] = byte;
        }
        if (hit_pos == -1) { // MISS
            printf("MISS\n");
            if (was_seen) {
                num_cap_misses++;
            } else {
                num_com_misses++;
            }
        } else {
            printf("HIT\n");
        }

        if (following_byte == -1) {
            break;
        }
    }
    printf("%d %d\n", num_com_misses, num_cap_misses);
    free(cache);
    free(cache_used);
    free(seen);
    if (policy == FIFO) {
        free(fifo_added_order);
    }
    if (policy == FIFO) {
        free(lru_used_order);
    }
    if (policy == CLK) {
        free(clock_referenced);
    }
    return EXIT_SUCCESS;
}
