#define _POSIX_C_SOURCE 199309L
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <errno.h>
#include <unistd.h>
#include <getopt.h>
#include <fcntl.h>
#include <string.h>
#include <sys/stat.h>
#include <string.h>

#include "trie.h"
#include "word.h"
#include "io.h"
#include "endian.h"
#include "code.h"

#define OPTIONS "vi:o:h"

//helper function to get bit length
int get_bitlen(uint16_t code) {
    uint16_t counter = 0;
    while (code != 0) {
        code = code >> 1;
        counter++;
    }
    return counter;
}

//helper function to print synopsis
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   Decompresses files with the LZ78 decompression algorithm.\n"
        "   Used with files compressed with the corresponding encoder.\n"

        "USAGE\n"
        "   %s [-vh] [-i input] [-o output]\n"

        "OPTIONS\n"
        "   -v          Display decompression statistics\n"
        "   -i input    Specify input to decompress (stdin by default)"
        "   -o output   Specify output of decompressed input (stdout by default)\n"
        "   -h              Display program help and usage.\n",
        exec);
}

//main function for decoding encoded files
int main(int argc, char **argv) {
    int opt = 0;
    FileHeader header;
    bool verbose = false;
    bool using_stdin = true;
    bool using_stdout = true;
    char *input_file_name;
    char *output_file_name;
    int infile;
    int outfile;
    double percent;
    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 'v': verbose = true; break;
        case 'i':
            using_stdin = false;
            input_file_name = optarg;
            break;
        case 'o':
            using_stdout = false;
            output_file_name = optarg;
            break;
        case 'h':
            usage(argv[0]);
            return EXIT_SUCCESS;
            break;
        default: usage(argv[0]); return EXIT_FAILURE;
        }
    }
    if (using_stdin == true) {
        infile = 0;
    }
    if (using_stdin == false) {
        infile = open(input_file_name, O_RDONLY);
        if (infile == -1) {
            fprintf(stderr, "Error failed to open file %s because: %s\n", input_file_name,
                strerror(errno));
            return EXIT_FAILURE;
        }
    }

    read_header(infile, &header);
    if (header.magic != MAGIC) {
        fprintf(stderr, "ERROR: Magic number verification failed!\n");
        return EXIT_FAILURE;
    }

    if (using_stdout == true) {
        outfile = 1;
    }
    if (using_stdout == false) {
        outfile = open(output_file_name, O_WRONLY | O_CREAT | O_TRUNC);
        if (fchmod(outfile, header.protection) == -1) {
            fprintf(stderr, "ERROR: fchmod failed read protections bits in decode");
            return EXIT_FAILURE;
        }

        if (outfile == -1) {
            fprintf(stderr, "Error failed to open file %s because: %s\n", output_file_name,
                strerror(errno));
            return EXIT_FAILURE;
        }
    }

    WordTable *table = wt_create();
    uint8_t curr_sym = 0;
    uint16_t curr_code = 0;
    uint16_t next_code = START_CODE;
    while (read_pair(infile, &curr_code, &curr_sym, get_bitlen(next_code)) == true) {
        //assert(curr_code < next_code);
        table[next_code] = word_append_sym(table[curr_code], curr_sym);
        write_word(outfile, table[next_code]);
        next_code++;
        if (next_code == MAX_CODE) {
            wt_reset(table);
            next_code = START_CODE;
        }
    }
    flush_words(outfile);

    close(infile);
    close(outfile);
    wt_delete(table);

    if (verbose == true) {
        int my_total_bytes;
        if (total_bits % 8 != 0) {
            my_total_bytes = (total_bits / 8) + 1;
        } else {
            my_total_bytes = (total_bits / 8);
        }
        my_total_bytes += 8;
        percent = 100 * (1 - (my_total_bytes / ((double) total_syms)));

        fprintf(stderr, "Compressed file size: %d bytes\n", my_total_bytes);
        fprintf(stderr, "Uncompressed file size: %lu bytes\n", total_syms);
        fprintf(stderr, "Compression ratio: %0.2f%%\n", percent);
    }
}
