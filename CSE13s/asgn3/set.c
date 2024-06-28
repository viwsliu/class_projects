#include "set.h"

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

Set set_empty(void) {
    return 0;
}

Set set_universal(void) {
    return ~0;
}

Set set_insert(Set s, uint8_t x) {
    return (1 << x) | s;
}

Set set_remove(Set s, uint8_t x) {
    return (~(1 << x)) & s;
}

bool set_member(Set s, uint8_t x) {
    return ((s & (1 << x)) != 0);
}
Set set_union(Set s, Set t) {
    return s | t;
}

Set set_intersect(Set s, Set t) {
    return s & t;
}

Set set_difference(Set s, Set t) {
    return (~t) & s;
}
Set set_complement(Set s) {
    return ~s;
}
