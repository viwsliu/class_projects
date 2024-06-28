#include "batcher.h"

#include "stats.h"

#include <stdio.h>

/*sorts using Batcher's odd-even merge sort*/
void batcher_sort(Stats *stats, uint32_t *A, uint32_t n) {
    if (n == 0) {
        return;
    }
    uint32_t temp = n;
    uint32_t t = 0;
    /*this while loop does the "p=1<<(t-1)"*/
    while (temp != 0) {
        t++;
        temp = temp >> 1;
    }
    uint32_t p = 1 << (t - 1);
    uint32_t q;
    uint32_t r;
    uint32_t d;
    while (p > 0) {
        q = 1 << (t - 1);
        r = 0;
        d = p;
        while (d > 0) {
            for (uint32_t i = 0; i < n - d; i++) {
                if ((i & p) == r) {
                    if ((cmp(stats, A[i], A[i + d])) == 1) {
                        swap(stats, &A[i], &A[i + d]);
                    }
                }
            }

            d = q - p;
            q >>= 1;
            r = p;
        }
        p >>= 1;
    }
}
