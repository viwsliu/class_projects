SHELL := /bin/sh
CC = clang
CFLAGS = -Wall -Wpedantic -Werror -Wextra -std=c17

vincent_objs = batcher.o shell.o heap.o quick.o set.o stats.o

all: sorting

sorting.o: sorting.c 
	$(CC) $(CFLAGS) -c $<
batcher.o: batcher.c batcher.h stats.h
	$(CC) $(CFLAGS) -c $<
shell.o: shell.c shell.h gaps.h
	$(CC) $(CFLAGS) -c $<
heap.o: heap.c heap.h stats.h
	$(CC) $(CFLAGS) -c $<
quick.o: quick.c quick.h stats.h
	$(CC) $(CFLAGS) -c $<
set.o: set.c set.h
	$(CC) $(CFLAGS) -c $<
stats.o: stats.c stats.h
	$(CC) $(CFLAGS) -c $<

sorting: sorting.o $(vincent_objs)
	$(CC) $(CFLAGS) -o sorting $< $(vincent_objs)

clean:
	rm -f sorting sorting.o $(vincent_objs)
format:
	clang-format -i -style=file *.[ch]
                                                  
