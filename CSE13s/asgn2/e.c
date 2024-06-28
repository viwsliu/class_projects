#include "mathlib.h"

#include <stdint.h>
#include <stdio.h>

static int counter;
/*estimates the value of euler's number, otherwise known as 'e'*/
double e(void) {
    uint64_t denominator;
    double previous_result = -1;
    double result = 0;
    denominator = 1;
    counter = 1;
    while (result - previous_result > EPSILON) {
        previous_result = result;
        result += 1.0 / denominator;
        denominator *= counter;
        counter++;
    }
    counter -= 1;
    return result;
}

/*returns iterations*/
int e_terms(void) {
    return counter;
}
