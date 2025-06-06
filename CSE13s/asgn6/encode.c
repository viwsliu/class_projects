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

//contains printable synopsis if error occurs
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   Compresses files using the LZ78 compression algorithm.\n"
        "   Compressed files are decompressed with the corresponding decoder.\n"

        "USAGE\n"
        "   %s [-vh] [-i input] [-o output]\n"

        "OPTIONS\n"
        "   -v          Display compression statistics\n"
        "   -i input    Specify input to compress (stdin by default)\n"
        "   -o output   Specify output of compressed input (stdout by default)\n"
        "   -h          Display program help and usage\n",
        exec);
}

//main function to encode a file
int main(int argc, char **argv) {
    int opt = 0;
    struct stat a;
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

    if (fstat(infile, &a) != 0) {
        fprintf(stderr, "ERROR: Failed to fstat %c becase %s\n", infile, strerror(errno));
        return EXIT_FAILURE;
    }
    memset(&header, 0, sizeof(header));
    header.magic = MAGIC;
    header.protection = a.st_mode;

    if (using_stdout == true) {
        outfile = 1;
    }
    if (using_stdout == false) {
        outfile = open(output_file_name, O_WRONLY | O_CREAT | O_TRUNC);
        fchmod(outfile, a.st_mode);
        if (outfile == -1) {
            fprintf(stderr, "Error failed to open file %s because: %s\n", output_file_name,
                strerror(errno));
        }
    }
    if (fchmod(outfile, header.protection) == -1) {
        fprintf(stderr, "ERROR: fchmod failed set protections bits in encode");
    }

    write_header(outfile, &header);

    TrieNode *root = trie_create();
    TrieNode *curr_node = root;
    TrieNode *prev_node = NULL;
    uint8_t curr_sym = 0;
    uint8_t prev_sym = 0;
    TrieNode *next_node;
    uint16_t next_code = START_CODE;

    while (read_sym(infile, &curr_sym) == true) {
        next_node = trie_step(curr_node, curr_sym);
        if (next_node != NULL) {
            prev_node = curr_node;
            curr_node = next_node;
        } else {
            write_pair(outfile, curr_node->code, curr_sym, get_bitlen(next_code));
            curr_node->children[curr_sym] = trie_node_create(next_code);
            curr_node = root;
            next_code++;
        }
        if (next_code == MAX_CODE) {
            trie_reset(root);
            curr_node = root;
            next_code = START_CODE;
        }
        prev_sym = curr_sym;
    }
    if (curr_node != root) {
        write_pair(outfile, prev_node->code, prev_sym, get_bitlen(next_code));

        next_code = (next_code + 1) % MAX_CODE;
    }
    write_pair(outfile, STOP_CODE, 0, get_bitlen(next_code));
    flush_pairs(outfile);

    close(infile);
    close(outfile);
    trie_delete(root);

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
