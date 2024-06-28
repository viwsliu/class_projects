#include <stdlib.h>
#include <stdio.h>
#include "code.h"
#include "trie.h"

//creates a node within a trie structure
TrieNode *trie_node_create(uint16_t code) {
    TrieNode *myNode = malloc(sizeof(TrieNode));
    myNode->code = code;
    for (int i = 0; i < (ALPHABET); i++) {
        myNode->children[i] = NULL;
    }
    return myNode;
}

//deletes a node within a trie structure
void trie_node_delete(TrieNode *n) {
    free(n);
}

//creates a struct Trie structure
TrieNode *trie_create(void) {
    TrieNode *myNode = trie_node_create(EMPTY_CODE);
    return myNode;
}

//This function resets a trie structure, but keeps the root
void trie_reset(TrieNode *root) {
    for (int i = 0; i < ALPHABET; i++) {
        if (root->children[i] != NULL) {
            trie_delete(root->children[i]);
            root->children[i] = NULL;
        }
    }
}

//deletes a trie structure entirely
void trie_delete(TrieNode *n) {
    for (int i = 0; i < ALPHABET; i++) {
        if (n->children[i] != NULL) {
            trie_delete(n->children[i]);
            n->children[i] = NULL;
        }
    }
    trie_node_delete(n);
}

//'jumps' up a child in the trie structure to a previous child
TrieNode *trie_step(TrieNode *n, uint8_t sym) {
    return n->children[sym];
}
