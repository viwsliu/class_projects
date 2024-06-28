#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <gmp.h>
#include "numtheory.h"
#include "randstate.h"

//finds the greatest common divisor between a and b and stores into g
void gcd(mpz_t g, const mpz_t a, const mpz_t b) {
    mpz_t t;
    mpz_t tempb;
    mpz_t tempa;
    mpz_init_set(tempa, a);
    mpz_init_set(tempb, b);
    mpz_init(t);
    while (mpz_cmp_ui(tempb, 0) != 0) {
        mpz_set(t, tempb);
        mpz_mod(tempb, tempa, tempb);
        mpz_set(tempa, t);
    }
    mpz_set(g, tempa);
    mpz_clear(t);
    mpz_clear(tempb);
    mpz_clear(tempa);
}

//computes the inverse of 'a mod n' and store it into mpz variable o
void mod_inverse(mpz_t o, const mpz_t a, const mpz_t n) {

    mpz_t r;
    mpz_t r_prime;
    mpz_t q;
    mpz_t t;
    mpz_t t_prime;
    mpz_t temp;
    mpz_t temp2;

    mpz_init_set(r, n);
    mpz_init_set(r_prime, a);

    mpz_init_set_ui(t, 0);
    mpz_init_set_ui(t_prime, 1);
    mpz_init(temp);
    mpz_init(temp2);
    mpz_init(q);

    while (mpz_cmp_ui(r_prime, 0) != 0) {
        mpz_fdiv_q(q, r, r_prime);

        mpz_set(temp2, r_prime);
        mpz_mul(temp, q, r_prime);
        mpz_sub(r_prime, r, temp);
        mpz_set(r, temp2);

        mpz_set(temp2, t_prime);
        mpz_mul(temp, q, t_prime);
        mpz_sub(t_prime, t, temp);
        mpz_set(t, temp2);
    }
    if (mpz_cmp_ui(r, 1) > 0) {
        mpz_set_ui(o, 0);
        mpz_clear(r);
        mpz_clear(r_prime);
        mpz_clear(t);
        mpz_clear(t_prime);
        mpz_clear(temp);
        mpz_clear(temp2);
        mpz_clear(q);
        return;
    }
    if (mpz_cmp_ui(t, 0) < 0) {
        mpz_add(t, t, n);
    }
    mpz_set(o, t);
    mpz_clear(r);
    mpz_clear(r_prime);
    mpz_clear(t);
    mpz_clear(t_prime);
    mpz_clear(temp);
    mpz_clear(temp2);
    mpz_clear(q);
    return;
}
//performs modular exponentiation
void pow_mod(mpz_t o, const mpz_t a, const mpz_t d, const mpz_t n) {
    mpz_t p;
    mpz_t tempd;
    mpz_init_set(tempd, d);
    mpz_init(p);
    mpz_set(p, a);
    mpz_set_ui(o, 1);
    while (mpz_cmp_ui(tempd, 0) > 0) {
        if (mpz_odd_p(tempd)) {
            mpz_mul(o, o, p);
            mpz_mod(o, o, n);
        }
        mpz_mul(p, p, p);
        mpz_mod(p, p, n);
        mpz_fdiv_q_ui(tempd, tempd, 2);
    }
    mpz_clear(p);
    mpz_clear(tempd);
    return;
}
//determines if 'n' is a prime integer using the miller-rabin primality test
bool is_prime(const mpz_t n, uint64_t iters) {
    if (mpz_even_p(n)) {
        return mpz_cmp_ui(n, 2) == 0;
    }
    if (mpz_cmp_ui(n, 1) == 0) {
        return false;
    }
    if (mpz_cmp_ui(n, 3) == 0) {
        return true;
    }
    mpz_t r;
    mpz_t s;
    mpz_t y;
    mpz_t a;
    mpz_t j;
    mpz_t two;
    mpz_t temp;
    mpz_t temp2;
    mpz_init_set_ui(two, 2);
    mpz_init(j);
    mpz_init(a);
    mpz_init(temp);
    mpz_init(temp2);
    mpz_init(y);
    mpz_init_set(r, n);
    mpz_init(s);
    mpz_sub_ui(r, r, 1);

    while (mpz_even_p(r) != 0) {
        mpz_fdiv_q_ui(r, r, 2);
        mpz_add_ui(s, s, 1);
    }

    mpz_sub_ui(temp, n, 1);
    for (uint32_t i = 0; i < iters; i++) {
        mpz_sub_ui(a, n, 3);
        mpz_urandomm(a, state, a);
        mpz_add_ui(a, a, 2);

        pow_mod(y, a, r, n);
        if ((mpz_cmp_ui(y, 1) != 0) && (mpz_cmp(y, temp) != 0)) {
            mpz_set_ui(j, 1);
            mpz_sub_ui(temp2, s, 1);
            while ((mpz_cmp(j, temp2) <= 0) && (mpz_cmp(y, temp) != 0)) {
                pow_mod(y, y, two, n);
                if (mpz_cmp_ui(y, 1) == 0) {
                    mpz_clear(r);
                    mpz_clear(s);
                    mpz_clear(y);
                    mpz_clear(a);
                    mpz_clear(j);
                    mpz_clear(two);
                    mpz_clear(temp);
                    mpz_clear(temp2);
                    return false;
                }
                mpz_add_ui(j, j, 1);
            }
            if (mpz_cmp(y, temp) != 0) {
                mpz_clear(r);
                mpz_clear(s);
                mpz_clear(y);
                mpz_clear(a);
                mpz_clear(j);
                mpz_clear(two);
                mpz_clear(temp);
                mpz_clear(temp2);
                return false;
            }
        }
    }
    mpz_clear(r);
    mpz_clear(s);
    mpz_clear(y);
    mpz_clear(a);
    mpz_clear(j);
    mpz_clear(two);
    mpz_clear(temp);
    mpz_clear(temp2);
    return true;
}
//generates a new prime number to be stored in 'mpz_t p'
void make_prime(mpz_t p, uint64_t bits, uint64_t iters) {
    mpz_t min_val;
    mpz_init_set_ui(min_val, 2);

    //min # of bits 2^(n-1)
    for (uint32_t i = 0; i < bits - 1; i++) {
        mpz_mul_ui(min_val, min_val, 2);
    }

    while ((is_prime(p, iters) == false)) {
        mpz_urandomm(p, state, min_val);
        mpz_add(p, p, min_val);
    }
    mpz_clear(min_val);
}
