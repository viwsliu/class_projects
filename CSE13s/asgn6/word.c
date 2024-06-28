#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include "word.h"
#include "code.h"

//creates a word structure
Word *word_create(uint8_t *syms, uint32_t len) {
    Word *myWord = malloc(sizeof(Word));
    if (myWord == NULL) {
        return NULL;
    }
    myWord->len = len;
    myWord->syms = malloc(len * sizeof(uint8_t));
    if (myWord->syms == NULL) {
        free(myWord);
        return NULL;
    }

    for (uint32_t i = 0; i < len; i++) {
        myWord->syms[i] = syms[i];
    }
    return myWord;
}

//appends a symbol to Word structure
Word *word_append_sym(Word *w, uint8_t sym) {
    Word *myWord = malloc(sizeof(Word));
    if (myWord == NULL) {
        return NULL;
    }
    myWord->syms = malloc((w->len + 1) * sizeof(uint8_t));
    myWord->len = w->len + 1;
    if (myWord->syms == NULL) {
        free(myWord);
        return NULL;
    }
    for (uint32_t i = 0; i < (w->len); i++) {
        myWord->syms[i] = w->syms[i];
    }
    myWord->syms[w->len] = sym;
    return myWord;
}

//deletes a word structure
void word_delete(Word *w) {
    free(w->syms);
    free(w);
}

//creates a word table structure
WordTable *wt_create(void) {
    WordTable *thing = malloc(MAX_CODE * sizeof(Word *));
    for (int i = 0; i < MAX_CODE; i++) {
        thing[i] = NULL;
    }
    thing[EMPTY_CODE] = word_create(NULL, 0);

    return thing;
}

//resets a word table structure
void wt_reset(WordTable *wt) {
    for (int i = 1; i < MAX_CODE; i++) {
        if (wt[i] != NULL) {
            word_delete(wt[i]); //set Word to NULL;
            wt[i] = NULL;
        }
    }
    wt[EMPTY_CODE] = word_create(NULL, 0);
}

//deletes a word table structure
void wt_delete(WordTable *wt) {
    for (int i = 0; i < MAX_CODE; i++) {
        if (wt[i] != NULL) {
            word_delete(wt[i]);
            wt[i] = NULL;
        }
    }
    free(wt);
}
