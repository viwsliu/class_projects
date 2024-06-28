#include <stdio.h>
#include <getopt.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdint.h>
#include <stdbool.h>
#include <gmp.h>
#include <string.h>
#include <errno.h>
#include "numtheory.h"
#include "ss.h"
#define OPTIONS "i:o:n:vh"

/*prints error message/synopsis*/
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   Decrypts data using SS decryption."
        "   Encrypted data is encrypted by the encrypt program."
        "\n"
        "USAGE\n"
        "   %s i:o:n:vh\n"
        "\n"
        "OPTIONS\n"
        "   -h              Display program help and usage.\n"
        "   -v              Display verbose program output.\n"
        "   -i infile       Input file of data to decrypt (default: stdin).\n"
        "   -o outfile      Output file for decrypted data (default: stdout).\n"
        "   -n pvfile       Private key file (default: ss.priv).\n",
        exec);
}
//main file used to decrypt desired message or text file
int main(int argc, char **argv) {
    int opt = 0;
    FILE *infile = stdin;
    FILE *outfile = stdout;
    FILE *pvfile = NULL;
    bool verbose = false;
    bool using_ss_priv = true;
    bool in = false;
    bool out = false;
    char *input_file;
    char *output_file;
    char *priv_file;

    mpz_t pq;
    mpz_t d;
    mpz_init(pq);
    mpz_init(d);

    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 'i':
            input_file = optarg;
            in = true;
            break;
        case 'o':
            output_file = optarg;
            out = true;
            break;
        case 'n':
            priv_file = optarg;
            using_ss_priv = false;
            break;
        case 'v': verbose = true; break;
        case 'h':
            usage(argv[0]);
            return EXIT_SUCCESS;
            break;
        default: usage(argv[0]); return EXIT_FAILURE;
        }
    }
    //use fopen to open priv key file. print error in event of failure
    if (using_ss_priv == true) {
        priv_file = "ss.priv";
    }
    pvfile = fopen(priv_file, "r");
    if (pvfile == NULL) {
        fprintf(stderr, "Error failed to open file %s because: %s\n", priv_file, strerror(errno));
        return EXIT_FAILURE;
    }

    //open input and output files
    //if input is null, error
    if (in == true) {
        infile = fopen(input_file, "r");
        if (pvfile == NULL) {
            fprintf(
                stderr, "Error failed to open file %s because: %s\n", input_file, strerror(errno));
            return EXIT_FAILURE;
        }
    }
    if (out == true) {
        outfile = fopen(output_file, "w+");
    }
    //read priv key
    ss_read_priv(pq, d, pvfile);
    if (verbose == true) {
        printf("pq (%zu bits) = ", mpz_sizeinbase(pq, 2));
        mpz_out_str(stdout, 10, pq);
        printf("\n");
        printf("d  (%zu bits) = ", mpz_sizeinbase(d, 2));
        mpz_out_str(stdout, 10, d);
        printf("\n");
    }
    //decrypt using ss_decrypt_file();
    ss_decrypt_file(infile, outfile, pq, d);
    //close priv key and clear mpz_t
    fclose(pvfile);
    fclose(outfile);
    fclose(infile);
    mpz_clear(pq);
    mpz_clear(d);
}
