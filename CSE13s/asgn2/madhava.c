#include "mathlib.h"

#include <stdint.h>
#include <stdio.h>
/*estimates the value of pi using the madhava formula*/
static uint64_t counter;
double pi_madhava(void) {
    double denominator = 100;
    double output = 0;
    double power = 1;
    counter = 0;
    power = 1;
    while (absolute(1 / denominator) > EPSILON) {
        denominator = power * ((2 * counter) + 1);
        output += 1 / denominator;
        counter++;
        power *= -3;
    }
    return (sqrt_newton(12) * output);
}

/*returns counter*/
int pi_madhava_terms(void) {
    return counter;
}
