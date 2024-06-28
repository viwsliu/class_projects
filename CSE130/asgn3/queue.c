#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include <pthread.h>
#include "queue.h"

//struct
struct queue {
    int start;
    int length;
    int max_size;
    void **buffer;
    pthread_mutex_t lock;
};

//struct init
queue_t *queue_new(int size) {
    queue_t *queue = malloc(sizeof(queue_t));
    queue->buffer = malloc((size) * sizeof(void *));
    if (queue->buffer == NULL) {
        return 0;
    }
    pthread_mutex_init(&(queue->lock), NULL);
    queue->max_size = size;
    queue->start = 0;
    queue->length = 0;
    return queue;
}

//free any allocated memory, set passed in pointer to NULL
void queue_delete(queue_t **q) {
    pthread_mutex_destroy(&(*q)->lock);
    free((*q)->buffer);
    free(*q);
    *q = NULL;
}

//following two should return true unless pointer is NULL
bool queue_push(queue_t *q, void *elem) {
    if (q == NULL) {
        return false;
    }
    pthread_mutex_lock(&(q->lock));
    while (true) {
        pthread_mutex_unlock(&(q->lock));
        pthread_mutex_lock(&(q->lock));
        if (q->max_size != q->length) {
            break;
        }
    }
    int push_pos = (((q->start) + (q->length)) % q->max_size);
    q->length++;
    q->buffer[push_pos] = elem;
    pthread_mutex_unlock(&(q->lock));
    return true;
    //should block queue of queue is full
}

bool queue_pop(queue_t *q, void **elem) {
    if (q == NULL) {
        return false;
    }
    pthread_mutex_lock(&(q->lock));
    while (true) {
        pthread_mutex_unlock(&(q->lock));
        pthread_mutex_lock(&(q->lock));
        if (q->length != 0) {
            break;
        }
    }
    *elem = q->buffer[q->start];
    q->start = (((q->start) + 1) % q->max_size);
    q->length = ((q->length) - 1);
    pthread_mutex_unlock(&(q->lock));
    return true;
    //should block if queue is empty
}
