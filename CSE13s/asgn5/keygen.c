
#define _POSIX_C_SOURCE 199309L
#include <stdio.h>
#include <getopt.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <time.h>
#include <stdbool.h>
#include <gmp.h>
#include <sys/stat.h>
#include <errno.h>
#include <string.h>
#include "randstate.h"
#include "ss.h"
#include "numtheory.h"
#define OPTIONS "b:i:n:d:s:vh"

/*prints error message/synopsis*/
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   Generates an SS public/private key pair.\n"
        "USAGE\n"
        "   %s hvb:i:n:d:s:\n"
        "OPTIONS\n"
        "   -h              Display program help and usage.\n"
        "   -v              Display verbose program output.\n"
        "   -b bits         Minimum bits needed for public key n (default: 256).\n"
        "   -i iterations   Miller-Rabin iterations for testing primes (default: 50).\n"
        "   -n pbfile       Public key file (default: ss.pub).\n"
        "   -d pvfile       Private key file (default: ss.priv).\n"
        "   -s seed         Random seed for testing.\n",
        exec);
}
//helper function to print verbose output
void print_v(char *name, mpz_t temp) {
    printf("%s  (%zu bits) = ", name, mpz_sizeinbase(temp, 2));
    mpz_out_str(stdout, 10, temp);
    printf("\n");
}

//helper function to print verbose of pq
void print_v2(char *name, mpz_t temp) {
    printf("%s (%zu bits) = ", name, mpz_sizeinbase(temp, 2));
    mpz_out_str(stdout, 10, temp);
    printf("\n");
}

//main function that generates public and private keys
int main(int argc, char **argv) {
    int opt = 0;
    mpz_t p;
    mpz_t q;
    mpz_t pq;
    mpz_t n;
    mpz_t d;
    mpz_init(d);
    mpz_init(n);
    mpz_init(p);
    mpz_init(q);
    mpz_init(pq);
    uint32_t iters = 50;
    uint32_t min_bits = 256;
    FILE *pbfile;
    FILE *pvfile;
    char *pub_file;
    char *priv_file;
    bool verbose = false;
    bool using_ss_pub = true;
    bool using_ss_priv = true;
    uint32_t seed = time(NULL); //seconds since UNIX EPOCH given by time(NULL)

    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 'b': min_bits = atoi(optarg); break;

        case 'i': iters = atoi(optarg); break;
        case 'n':
            pub_file = optarg;
            using_ss_pub = false;
            break;
        case 'd':
            priv_file = optarg;
            using_ss_priv = false;
            break;
        case 's': seed = atoi(optarg); break;
        case 'v': verbose = true; break;
        case 'h':
            usage(argv[0]);
            return EXIT_SUCCESS;
            break;
        default: usage(argv[0]); return EXIT_FAILURE;
        }
    }

    if (using_ss_pub == true) {
        pub_file = "ss.pub";
    }
    if (using_ss_priv == true) {
        priv_file = "ss.priv";
    }

    //open pub and priv key using fopen() print error and exit program in even of failure.
    pbfile = fopen(pub_file, "w+");
    pvfile = fopen(priv_file, "w+");
    if (pbfile == NULL) {
        fprintf(stderr, "Error opening file %s because of %s\n", pub_file, strerror(errno));
        return EXIT_FAILURE;
    }

    if (pvfile == NULL) {
        fprintf(stderr, "Error opening file %s because of %s\n", priv_file, strerror(errno));
        return EXIT_FAILURE;
    }
    //use fchmod() and fileno() to ensure that priv key permisions are set to 0600 indicating read and write permissions for the user, no permissions for anyone else
    int fd = fileno(pvfile);
    fchmod(fd, S_IRUSR | S_IWUSR);
    //init rand state using randstate_init() using set seed
    randstate_init(seed);

    //make pub and priv keys using ss_make_pub and ss_make_priv
    ss_make_pub(p, q, n, min_bits, iters);
    ss_make_priv(d, pq, p, q);

    //get users name as a string using getenv()
    char *username = getenv("USER");

    //write computed pub and priv keys to respective files
    ss_write_pub(n, username, pbfile);
    ss_write_priv(pq, d, pvfile);

    //if verbose output is enabled, print:
    if (verbose == true) {
        printf("user = %s\n", username);

        print_v("p", p);
        print_v("q", q);
        print_v("n", n);
        print_v2("pq", pq);
        print_v("d", d);
    }
    //all mpz_t values should be printed with info on num of bits that consitute them, along with their respective vals in decimal

    //close pub and priv key files, clear randstate with randstate_clear() and clear any mpz_t variables you may have used
    fclose(pvfile);
    fclose(pbfile);
    randstate_clear();
    mpz_clear(p);
    mpz_clear(q);
    mpz_clear(pq);
    mpz_clear(n);
    mpz_clear(d);
}
