#include <stdio.h>
#include <getopt.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdint.h>
#include <stdbool.h>
#include <gmp.h>
#include <string.h>
#include <errno.h>
#include "ss.h"
#include "numtheory.h"
#include "randstate.h"
#define OPTIONS "i:o:n:vh"

/*prints error message/synopsis*/
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   Encrypts data using SS encryption.\n"
        "   Encrypted data is decrypted by the decrypt program.\n"
        "\n"
        "USAGE\n"
        "   %s i:o:n:vh\n"
        "\n"
        "OPTIONS\n"
        "   -h              Display program help and usage.\n"
        "   -v              Display verbose program output.\n"
        "   -i infile       Input file of data to encrypt (default: stdin).\n"
        "   -o outfile      Output file for encrypted data (default: stdout).\n"
        "   -n pbfile       Public key file (default: ss.pub).\n",
        exec);
}

//main function to encrypt
int main(int argc, char **argv) {
    int opt = 0;
    FILE *input = stdin;
    FILE *output = stdout;
    FILE *pbfile = NULL;
    bool verbose = false;
    bool using_ss_pub = true;
    bool in = false;
    bool out = false;
    char *input_file;
    char *output_file;
    char *pub_file;

    mpz_t c;
    mpz_t m;
    mpz_t n;
    mpz_init(c);
    mpz_init(m);
    mpz_init(n);

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
            pub_file = optarg;
            using_ss_pub = false;
            break;
        case 'v': verbose = true; break;
        case 'h':
            usage(argv[0]);
            return EXIT_SUCCESS;
            break;
        default: usage(argv[0]); return EXIT_FAILURE;
        }
    }
    //open pub key using fopen() print error in case of failure
    if (using_ss_pub == true) {
        pub_file = "ss.pub";
    }
    pbfile = fopen(pub_file, "r");
    if (pbfile == NULL) {
        fprintf(stderr, "Error failed to open file %s because: %s\n", pub_file, strerror(errno));
        return EXIT_FAILURE;
    }

    //open input and output files
    //if input is null, error
    if (in == true) {
        input = fopen(input_file, "r");
        if (input == NULL) {
            fprintf(
                stderr, "Error failed to open file %s because: %s\n", input_file, strerror(errno));
            return EXIT_FAILURE;
        }
    }
    if (out == true) {
        output = fopen(output_file, "w+");
    }
    //get username
    char *username = getenv("USER");
    //read pub key
    ss_read_pub(n, username, pbfile);
    //print username and pub key 'n' if verbose is enabled
    if (verbose == true) {
        printf("user = %s\n", username);
        printf("n (%zu bits) = ", mpz_sizeinbase(n, 2));
        mpz_out_str(stdout, 10, n);
        printf("\n");
    }
    //encrypt using ss_encrypt_file()
    ss_encrypt_file(input, output, n);
    //close pub key file and clear mpz_t variables
    fclose(pbfile);
    fclose(output);
    fclose(input);
    mpz_clear(c);
    mpz_clear(m);
    mpz_clear(n);
}
