#Assignment 3 directory

This directory contains source code and other files for Assignment 3.

Files in directory:
queue.c - Implements a queue that can store and return arbitrary items pointers to objects
rwlock.c - Implements a reader-writer lock that prioritizes either readers or writers or n-ways
queue.h - Header file for queue.c
rwlock.h - Header file for rwlock.c
Makefile
README.md

This Assignment implements a thread-safe Circular buffer with the use of mutex from the C "pthread" library. It consists of two files, each of which implements a structure for either a queue or a reader-writer lock. Only one mutex was used on both the queue and rwlock files. rwlock.c allows for a single or multiple readers to hold the lock, but only a single writer to hold the lock at a time. 

Interesting design choice:
In rwlock, rather than utilize a boolean to determine the lock's current state, an integer variable was used instead. The variable ("lockstate") would only be set to one of three integers:
- 0 if it was unlocked
- 1 if it was reader locked
- 2 if it was writer locked
