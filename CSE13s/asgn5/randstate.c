#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdlib.h>
#include <gmp.h>
#include "randstate.h"
gmp_randstate_t state;

//initializes gmp randomizer
void randstate_init(uint64_t seed) {
    srand(seed);
    gmp_randinit_mt(state);
    gmp_randseed_ui(state, seed);
}

//clears randomizer
void randstate_clear(void) {
    gmp_randclear(state);
}
