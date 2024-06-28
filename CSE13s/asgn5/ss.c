#define _DEFAULT_SOURCE
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <gmp.h>
#include "numtheory.h"
#include "randstate.h"

//creates a public key file
void ss_make_pub(mpz_t p, mpz_t q, mpz_t n, uint64_t nbits, uint64_t iters) {
    mpz_t diffq;
    mpz_t diffp;
    uint64_t min;
    uint64_t max;
    uint64_t pbits;
    uint64_t qbits;
    uint64_t diff;
    mpz_init(diffp);
    mpz_init(diffq);
    //find min and max of bits for p
    min = nbits / 5;
    max = (2 * nbits) / 5;
    diff = max - min;
    //pbits be a random number in range [nbits/5, 2(nbits)/5].
    pbits = (random() % diff) + min;

    qbits = nbits - (2 * pbits);
    mpz_t remainder;
    mpz_init(remainder);
    while (true) {
        make_prime(p, pbits, iters);
        make_prime(q, qbits, iters);

        mpz_sub_ui(diffp, q, 1);
        mpz_sub_ui(diffq, p, 1);
        mpz_fdiv_r(remainder, diffq, p);
        if (mpz_cmp_ui(remainder, 0) == 0) { //p-1 divides q so restart
            continue;
        }
        mpz_fdiv_r(remainder, diffq, p);
        if (mpz_cmp_ui(remainder, 0) == 0) { //q-1 divides p so restart
            continue;
        }
        break;
    }
    mpz_mul(n, p, p);
    mpz_mul(n, n, q);
    mpz_clear(remainder);
    mpz_clear(diffq);
    mpz_clear(diffp);
}

//writes public key to pbfile
void ss_write_pub(mpz_t n, char username[], FILE *pbfile) {
    mpz_out_str(pbfile, 16, n);
    fprintf(pbfile, "\n");
    fprintf(pbfile, "%s", username);
    fprintf(pbfile, "\n");
    //write to pb file
    //n should be written as hexstring
    //write n, then newline, then username, then newline
}
//reads public key from pbfile
void ss_read_pub(mpz_t n, char username[], FILE *pbfile) {
    mpz_inp_str(n, pbfile, 16);
    fscanf(pbfile, "%s", username);
    //read pbfile
}
//creates a private key
void ss_make_priv(mpz_t d, mpz_t pq, mpz_t p, mpz_t q) {
    mpz_t diffp;
    mpz_t diffq;
    mpz_t lcm;
    mpz_t gcd_;
    mpz_t n;

    mpz_init(n);
    mpz_init(gcd_);
    mpz_init(lcm);
    mpz_init(diffp);
    mpz_init(diffq);

    //a*b/gcd
    mpz_sub_ui(diffp, p, 1);
    mpz_sub_ui(diffq, q, 1);

    gcd(gcd_, diffp, diffq);
    mpz_mul(lcm, diffp, diffq);
    mpz_fdiv_q(lcm, lcm, gcd_);
    //n=p*p*q
    mpz_mul(n, p, p);
    mpz_mul(n, n, q);

    mpz_mul(pq, p, q);
    mod_inverse(d, n, lcm);
    mpz_clear(diffp);
    mpz_clear(diffq);
    mpz_clear(lcm);
    mpz_clear(gcd_);
    mpz_clear(n);
}
//writes private key to pvfile
void ss_write_priv(mpz_t pq, mpz_t d, FILE *pvfile) {
    mpz_out_str(pvfile, 16, pq);
    fprintf(pvfile, "\n");
    mpz_out_str(pvfile, 16, d);
    fprintf(pvfile, "\n");
}
//reads private key from pvfile
void ss_read_priv(mpz_t pq, mpz_t d, FILE *pvfile) {
    mpz_inp_str(pq, pvfile, 16);
    mpz_inp_str(d, pvfile, 16);
}
//performs encryption
void ss_encrypt(mpz_t c, mpz_t m, mpz_t n) {
    pow_mod(c, m, n, n);
    //encryption with SS is defined as E(m)=c=m^(n) (mod n)
}
//encrypts infile and prints encrypted text into outfile
void ss_encrypt_file(FILE *infile, FILE *outfile, mpz_t n) {
    uint8_t *block;
    uint64_t k;
    int j;
    mpz_t m;
    mpz_t c;

    mpz_init(c);
    mpz_init(m);

    //calculate block size of k
    k = (((mpz_sizeinbase(n, 2)) / 2) + 1) / 8;

    block = (uint8_t *) calloc(k, sizeof(uint8_t));
    block[0] = 0xff;
    while (!feof(infile)) {
        j = fread(block + 1, 1, k - 1, infile);
        mpz_import(m, j + 1, 1, 1, 1, 0, block);
        ss_encrypt(c, m, n);
        mpz_out_str(outfile, 16, c);
        fprintf(outfile, "\n");
    }
    free(block);
    mpz_clear(m);
    mpz_clear(c);
}

//perform ss decryption
void ss_decrypt(mpz_t m, mpz_t c, mpz_t d, mpz_t pq) {
    pow_mod(m, c, d, pq);
}
//Decrypts infile and prints to outfile
void ss_decrypt_file(FILE *infile, FILE *outfile, mpz_t pq, mpz_t d) {
    uint8_t *block2;
    uint64_t k;
    mpz_t c;
    mpz_t m;
    mpz_init(c);
    mpz_init(m);

    k = (((mpz_sizeinbase(pq, 2)) - 1) / 8);
    block2 = (uint8_t *) calloc(k, sizeof(uint8_t));
    while (!feof(infile)) {
        mpz_inp_str(c, infile, 16);
        if (fgetc(infile) != '\n') {
            break;
        }
        ss_decrypt(m, c, d, pq);
        mpz_export(block2, &k, 1, 1, 1, 0, m);
        fwrite(block2 + 1, sizeof(uint8_t), k - 1, outfile);
    }
    mpz_clear(c);
    mpz_clear(m);
    free(block2);
}
