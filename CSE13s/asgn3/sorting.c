#include <errno.h>
#include <getopt.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#define OPTIONS "Hasbhqn:p:r:"
#include "batcher.h"
#include "heap.h"
#include "quick.h"
#include "set.h"
#include "shell.h"
#include "stats.h"

const uint8_t run_shell = 0;
const uint8_t run_heap = 1;
const uint8_t run_quick = 2;
const uint8_t run_batcher = 3;

/*print synopsis*/
void usage(char *exec) {
    fprintf(stderr,
        "Select at least one sort to perform.\n"
        "SYNOPSIS\n"
        "   A collection of comparison-based sorting algorithms.\n"
        "\n"
        "USAGE\n"
        "   %s [-Hasbhqn:p:r:] [-n length] [-p elements] [-r seed]\n"
        "\n"
        "OPTIONS\n"
        "   -H              Display program help and usage.\n"
        "   -a              Enable all sorts.\n"
        "   -s              Enable Shell Sort.\n"
        "   -b              Enable Batcher Sort.\n"
        "   -h              Enable Heap Sort.\n"
        "   -q              Enable Quick Sort.\n"
        "   -n length       Specify number of array elements (default: 100).\n"
        "   -p elements     Specify number of elements to print (default: 100).\n"
        "   -r seed         Specify random seed (default: 13371453).\n",
        exec);
}

/*main function*/
int main(int argc, char **argv) {
    int opt = 0;
    uint32_t seed = 13371453;
    uint32_t length = 100;
    uint32_t elements = 100;
    int counter = 0;

    if (argc == 1) {
        usage(argv[0]);
        return EXIT_FAILURE;
    }

    Set to_run = set_empty();

    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 'H': usage(argv[0]); return EXIT_SUCCESS;
        case 'n': length = atoi(optarg); break;
        case 'p': elements = atoi(optarg); break;
        case 'r': seed = atoi(optarg); break;
        case 'a':
            to_run = set_insert(to_run, run_shell);
            to_run = set_insert(to_run, run_batcher);
            to_run = set_insert(to_run, run_heap);
            to_run = set_insert(to_run, run_quick);
            break;
        case 's': to_run = set_insert(to_run, run_shell); break;
        case 'b': to_run = set_insert(to_run, run_batcher); break;
        case 'h': to_run = set_insert(to_run, run_heap); break;
        case 'q': to_run = set_insert(to_run, run_quick); break;
        }
    }

    if (to_run == 0) {
        usage(argv[0]);
        return EXIT_FAILURE;
    }
    uint32_t *array = (uint32_t *) malloc(length * sizeof(uint32_t));

    //creates random seeded array
    srand(seed);
    for (uint32_t location = 0; location < length; location++) {
        array[location] = (rand() & (~(3 << 30)));
    }

    if (set_member(to_run, run_shell) == true) {
        Stats shell_stats;
        reset(&shell_stats);
        shell_sort(&shell_stats, array, length);
        printf("Shell Sort, %d elements, %lu moves, %lu compares\n", length, shell_stats.moves,
            shell_stats.compares);
        counter = 1;
        for (uint32_t a = 0; a < elements; a++) {
            printf("   %10u", array[a]);
            if ((counter == 5) | (a == elements - 1)) {
                counter = 0;
                printf("\n");
            }
            counter++;
        }
        set_remove(to_run, run_shell);
        reset(&shell_stats);
    }
    //creates random seeded array
    srand(seed);
    for (uint32_t location = 0; location < length; location++) {
        array[location] = (rand() & (~(3 << 30)));
    }

    if (set_member(to_run, run_batcher)) {
        Stats batcher_stats;
        reset(&batcher_stats);
        batcher_sort(&batcher_stats, array, length);
        printf("Batcher Sort, %d elements, %lu moves, %lu compares\n", length, batcher_stats.moves,
            batcher_stats.compares);
        counter = 1;
        for (uint32_t b = 0; b < elements; b++) {
            printf("   %10u", array[b]);
            if ((counter == 5) | (b == elements - 1)) {
                counter = 0;
                printf("\n");
            }
            counter++;
        }
        set_remove(to_run, run_batcher);
        reset(&batcher_stats);
    }
    //creates random seeded array
    srand(seed);
    for (uint32_t location = 0; location < length; location++) {
        array[location] = (rand() & (~(3 << 30)));
    }

    if (set_member(to_run, run_heap)) {
        Stats heap_stats;
        reset(&heap_stats);
        heap_sort(&heap_stats, array, length);
        printf("Heap Sort, %d elements, %lu moves, %lu compares\n", length, heap_stats.moves,
            heap_stats.compares);
        counter = 1;
        for (uint32_t c = 0; c < elements; c++) {
            printf("   %10u", array[c]);
            if ((counter == 5) | (c == elements - 1)) {

                counter = 0;
                printf("\n");
            }
            counter++;
        }
        set_remove(to_run, run_heap);
        reset(&heap_stats);
    }
    //creates random seeded array
    srand(seed);
    for (uint32_t location = 0; location < length; location++) {
        array[location] = (rand() & (~(3 << 30)));
    }

    if (set_member(to_run, run_quick)) {
        Stats quick_stats;
        reset(&quick_stats);
        quick_sort(&quick_stats, array, length);
        printf("Quick Sort, %d elements, %lu moves, %lu compares\n", length, quick_stats.moves,
            quick_stats.compares);
        counter = 1;
        for (uint32_t d = 0; d < elements; d++) {
            printf("   %10u", array[d]);
            if ((counter == 5) | (d == elements - 1)) {

                counter = 0;
                printf("\n");
            }
            counter++;
        }
        set_remove(to_run, run_quick);
        reset(&quick_stats);
    }
    free(array);
}
