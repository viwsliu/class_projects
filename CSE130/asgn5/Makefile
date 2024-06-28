CC = clang
CFLAGS = -Wall -Wextra -Werror -Wpedantic --std=c17 -g

all: cacher 

cacher: cacher.o
	$(CC) $(CFLAGS) $^ -o $@ 

cacher.o: cacher.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f cacher cacher.o

format:
	clang-format -i *.[ch]
