#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include <pthread.h>
#include "rwlock.h"

struct rwlock {
    pthread_mutex_t lock;
    int readers_waiting;
    int writers_waiting;
    int already_in;
    int n;
    int n_ways;
    PRIORITY priority;
    int lock_state;
    //0 = unlocked
    //1 = reader locked
    //2 = writer locked
};

rwlock_t *rwlock_new(PRIORITY p, uint32_t n) {
    rwlock_t *test = malloc(sizeof(rwlock_t));
    pthread_mutex_init(&(test->lock), NULL);
    test->readers_waiting = 0;
    test->writers_waiting = 0;
    test->already_in = 0;
    test->n_ways = n;
    test->priority = p;
    test->lock_state = 0;
    test->n = 0;
    return test;
}

void rwlock_delete(rwlock_t **l) {
    pthread_mutex_destroy(&(*l)->lock);
    free(*l);
    *l = NULL;
}

void reader_lock(rwlock_t *rw) {
    pthread_mutex_lock(&(rw->lock));
    rw->readers_waiting++;
    while (true) {
        pthread_mutex_unlock(&(rw->lock)); //unlock
        pthread_mutex_lock(&(rw->lock)); //lock
        bool p_writers_and_waiting = ((rw->priority == WRITERS) && (rw->writers_waiting != 0));
        bool check_n_ways = (rw->priority == N_WAY) && (rw->n == 0);
        bool lockstatebool = ((rw->lock_state == 1) | (rw->lock_state == 0));
        if ((!(p_writers_and_waiting || check_n_ways)) && lockstatebool) {
            break;
        }
    }
    rw->readers_waiting--;
    rw->lock_state = 1;
    rw->already_in++;
    pthread_mutex_unlock(&(rw->lock)); //unlock mutex
}

void reader_unlock(rwlock_t *rw) {
    pthread_mutex_lock(&(rw->lock));
    rw->already_in--;
    if (rw->already_in == 0) {
        rw->lock_state = 0;
    }
    pthread_mutex_unlock(&(rw->lock));
}

void writer_lock(rwlock_t *rw) {
    pthread_mutex_lock(&(rw->lock));
    rw->writers_waiting++;
    while (true) {
        pthread_mutex_unlock(&(rw->lock)); //unlock
        pthread_mutex_lock(&(rw->lock)); //lock
        bool thing = ((rw->priority == READERS) && (rw->readers_waiting != 0));
        bool check_n_ways = (rw->priority == N_WAY) && (rw->n != 0);
        bool lockstatebool = ((rw->lock_state == 0));
        if ((!(thing || check_n_ways)) && (lockstatebool == true)) {
            break;
        }
    }
    rw->n = rw->n_ways;
    rw->writers_waiting--;
    rw->lock_state = 2;
    rw->already_in++;
    pthread_mutex_unlock(&(rw->lock)); //unlock mutex
}

void writer_unlock(rwlock_t *rw) {
    pthread_mutex_lock(&(rw->lock));
    rw->already_in--;
    if (rw->already_in == 0) {
        rw->lock_state = 0;
    }
    pthread_mutex_unlock(&(rw->lock));
}
