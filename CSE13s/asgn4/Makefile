CC = clang
CFLAGS = -Wall -Wpedantic -Werror -Wextra -std=c17 

all: life

universe.o: universe.c universe.h
	$(CC) $(CFLAGS) -o universe.o -c $<
life.o: life.c universe.h
	$(CC) $(CFLAGS) -o life.o -c $<
life: life.o universe.o
	$(CC) $(CFLAGS) universe.o life.o -o $(@) -lncurses

clean:
	rm -f life life.o universe.o 

format:
	clang-format -i -style=file *.[ch]


