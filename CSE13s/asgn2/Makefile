SHELL := /bin/sh
CC = clang
CFLAGS = -Wall -Wpedantic -Werror -Wextra

vincent_objs = euler.o e.o madhava.o bbp.o viete.o newton.o 

all: mathlib-test 

mathlib-test.o: mathlib-test.c
	$(CC) $(CFLAGS) -c mathlib-test.c
bbp.o: bbp.c
	$(CC) $(CFLAGS) -c bbp.c
e.o: e.c
	$(CC) $(CFLAGS) -c e.c
euler.o: euler.c
	$(CC) $(CFLAGS) -c euler.c
newton.o: newton.c
	$(CC) $(CFLAGS) -c newton.c
viete.o: viete.c
	$(CC) $(CFLAGS) -c viete.c
madhava.o: madhava.c
	$(CC) $(CFLAGS) -c madhava.c

mathlib-test: mathlib-test.o $(vincent_objs)
	$(CC) -o mathlib-test mathlib-test.o -lm $(vincent_objs)

clean:
	rm -f mathlib-test mathlib-test.o $(vincent_objs)
format:
	clang-format -i -style=file *.[ch]
