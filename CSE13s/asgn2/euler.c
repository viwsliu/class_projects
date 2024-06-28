#include "mathlib.h"

#include <stdint.h>
#include <stdio.h>
/*estimates the value of pi using euler's solution*/
static uint64_t counter;
double pi_euler(void) {
    double output = 0;
    double new_fraction = 5;
    counter = 1;
    while (new_fraction > EPSILON) {
        new_fraction = 1.0 / (counter * counter);
        output += new_fraction;
        counter++;
    }
    counter--;
    return sqrt_newton(6 * output);
}
/*returns total number of iterations*/
int pi_euler_terms(void) {
    return counter;
}
