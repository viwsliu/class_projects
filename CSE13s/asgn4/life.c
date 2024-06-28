#define _DEFAULT_SOURCE

#include "universe.h"

#include <getopt.h>
#include <ncurses.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#define OPTIONS "tsn:i:o:h"
#define DELAY   50000

/*prints error message/synopsis*/
void usage(char *exec) {
    fprintf(stderr,

        "SYNOPSIS\n"
        "    Conway's Game of Life\n"
        "USAGE\n"
        "    %s tsn:i:o:h\n"
        "OPTIONS\n"
        "    -t             Create your universe as a toroidal\n"
        "    -s             Silent - do not use animate the evolution\n"
        "    -n {number}    Number of generations [default: 100]\n"
        "    -i {file}      Input file [default: stdin]\n"
        "    -o {file}      Output file [default: stdout]\n",
        exec);
}

/*Update the values between the two universes when executing*/
void update(Universe *thing1, Universe *think2) {
    uint32_t r = uv_rows(thing1);
    uint32_t c = uv_cols(thing1);
    for (uint32_t i = 0; i < r; i++) {
        for (uint32_t j = 0; j < c; j++) {
            if ((uv_get_cell(thing1, i, j) == true)) {
                if (uv_census(thing1, i, j) == 2 || uv_census(thing1, i, j) == 3) {
                    uv_live_cell(think2, i, j);
                } else {
                    uv_dead_cell(think2, i, j);
                }
            } else {
                if (uv_census(thing1, i, j) == 3) {
                    uv_live_cell(think2, i, j);
                } else {
                    uv_dead_cell(think2, i, j);
                }
            }
        }
    }
}
/*determines input arguments and executes accordingly*/
int main(int argc, char **argv) {
    int opt = 0;
    uint32_t generations = 100;
    FILE *inputfile = stdin;
    FILE *outputfile = stdout;
    bool toroidal = false;
    bool using_stdout = true;
    bool using_stdin = true;
    bool window = true;
    char *input = NULL;

    char *output = NULL;
    int x;
    int y;
    Universe *firstuniv;
    Universe *seconduniv;

    if (argc == 1) {
        usage(argv[0]);
        return EXIT_FAILURE;
    }

    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 't': toroidal = true; break;
        case 's': window = false; break;
        case 'n': generations = atoi(optarg); break;
        case 'i':
            input = optarg;
            using_stdin = false;
            break;
        case 'o':
            output = optarg;
            using_stdout = false;
            break;
        case 'h': usage(argv[0]); return EXIT_SUCCESS;
        default: usage(argv[0]); return EXIT_FAILURE;
        }
    }

    if (using_stdin == false) {
        inputfile = fopen(input, "r");
    }
    if (using_stdout == false) {
        outputfile = fopen(output, "w");
    }
    if (inputfile == NULL) {
        printf("Error opnening %s.\n", input);

        return EXIT_FAILURE;
    }
    fscanf(inputfile, "%d %d", &x, &y);

    firstuniv = uv_create(x, y, toroidal);
    seconduniv = uv_create(x, y, toroidal);
    if (uv_populate(firstuniv, inputfile) == false) {
        printf("Malformed input.\n");
        return EXIT_FAILURE;
    }

    if (window == true) {
        initscr();
        for (uint32_t i = 0; i < generations; i++) {
            usleep(DELAY);
            clear();
            for (uint32_t row = 0; row < uv_rows(firstuniv); row++) {
                for (uint32_t col = 0; col < uv_cols(firstuniv); col++) {
                    if (uv_get_cell(firstuniv, row, col) == true) {
                        mvprintw(row, col, "o");
                    } else {
                        mvprintw(row, col, " ");
                    }
                }
            }
            refresh();
            update(firstuniv, seconduniv);
            Universe *tmp_swap = firstuniv;
            firstuniv = seconduniv;
            seconduniv = tmp_swap;
        }
        endwin();
    }

    else {
        for (uint32_t i = 0; i < generations; i++) {
            update(firstuniv, seconduniv);
            Universe *tmp_swap = firstuniv;
            firstuniv = seconduniv;
            seconduniv = tmp_swap;
        }
    }

    uv_print(firstuniv, outputfile);

    if (using_stdin == false) {
        fclose(inputfile);
    }
    if (using_stdout == false) {
        fclose(outputfile);
    }
    uv_delete(firstuniv);
    uv_delete(seconduniv);
}
