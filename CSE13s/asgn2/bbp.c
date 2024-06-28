#include "mathlib.h"

#include <stdint.h>
#include <stdio.h>

static uint64_t counter;
/*Purpose is to estimate pi using the Bailey Borwein Plouffe formula*/
double pi_bbp(void) {
    counter = 0;
    double output = 0;
    double newfraction = 1;
    uint64_t power = 1;
    while (newfraction > EPSILON) {
        uint64_t numerator = (counter * ((120 * counter) + 151) + 47);
        uint64_t denominator
            = power * (counter * (counter * (counter * ((512 * counter) + 1024) + 712) + 194) + 15);
        newfraction = numerator / (double) denominator;
        output += newfraction;
        counter++;
        power *= 16;
    }
    return output;
}
/*returns iterations*/
int pi_bbp_terms(void) {
    return counter;
}
