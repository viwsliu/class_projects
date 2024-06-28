#include "heap.h"

#include "stats.h"

#include <stdbool.h>
#include <stdio.h>

/*function find max child*/
uint32_t max_child(Stats *stats, uint32_t *A, uint32_t first, uint32_t last) {
    uint32_t left = 2 * first;
    uint32_t right = left + 1;
    if (right <= last && ((cmp(stats, A[right - 1], A[left - 1])) == 1)) {
        return right;
    }
    return left;
}
/*function to update the new top of heap*/
void fix_heap(Stats *stats, uint32_t *A, uint32_t first, uint32_t last) {
    bool found = false;
    uint32_t mother = first;
    uint32_t great = max_child(stats, A, mother, last);

    while ((mother <= last / 2) && (found == false)) {
        if ((cmp(stats, A[great - 1], A[mother - 1])) == 1) {
            swap(stats, &A[mother - 1], &A[great - 1]);
            mother = great;
            great = max_child(stats, A, mother, last);
        } else {
            found = true;
        }
    }
}
/*updates remaining heap*/
void build_heap(Stats *stats, uint32_t *A, uint32_t first, uint32_t last) {
    for (uint32_t father = last / 2; father > first - 1; father--) {
        fix_heap(stats, A, father, last);
    }
}
/*sorts the heap using the above functions*/
void heap_sort(Stats *stats, uint32_t *A, uint32_t length) {
    uint32_t first = 1;
    build_heap(stats, A, first, length);
    for (uint32_t leaf = length; leaf > first; leaf--) {
        swap(stats, &A[first - 1], &A[leaf - 1]);
        fix_heap(stats, A, first, leaf - 1);
    }
}
