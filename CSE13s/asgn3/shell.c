#include "shell.h"

#include "gaps.h"

#include <stdio.h>

/*Shell sort method*/

void shell_sort(Stats *stats, uint32_t *arr, uint32_t length) {
    uint32_t gap;
    uint32_t j;
    uint32_t temp;
    for (uint32_t x = 0; x < GAPS; x++) {
        gap = gaps[x];
        for (uint32_t i = gap; i < length; i++) {
            j = i;
            temp = move(stats, arr[i]);
            while ((j >= gap) && (cmp(stats, arr[j - gap], temp) == 1)) {
                arr[j] = move(stats, arr[j - gap]);
                j -= gap;
            }
            arr[j] = move(stats, temp);
        }
    }
}
