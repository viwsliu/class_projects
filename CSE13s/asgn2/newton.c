#include "mathlib.h"

#include <stdio.h>
#include <stdlib.h>
/*calculates square root*/
static int iterations;

double sqrt_newton(double input) {
    iterations = 0;
    double guess = 0.0;
    double output = 1.0;
    while (absolute(output - guess) > EPSILON) {
        guess = output;
        output = 0.5 * (guess + input / guess);
        iterations++;
    }
    return output;
}
/*returns total number of iterations*/
int sqrt_newton_iters(void) {
    return iterations;
}
