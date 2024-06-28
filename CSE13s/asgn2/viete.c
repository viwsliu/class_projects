#include "mathlib.h"

#include <stdint.h>
#include <stdio.h>
/*estimates the value of pi using viete's formula*/
static uint64_t factors;
double pi_viete() {
    factors = 1;
    double output = sqrt_newton(2) / 2;
    double previous_output = -100;
    double numerator = sqrt_newton(2);
    while (absolute(output - previous_output) > EPSILON) {
        numerator = sqrt_newton(2 + numerator);
        previous_output = output;
        output *= (numerator / 2);
        factors++;
    }
    factors--;
    return 2 / output;
}
/*returns total number of iterations*/
int pi_viete_factors() {
    return factors;
}
