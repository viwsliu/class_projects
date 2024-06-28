CC = clang 
CFLAGS = -Wall -Wextra -Werror -Wpedantic -std=c17 -g

all: memory

memory: memory.c
	$(CC) $(CFLAGS) -o memory memory.c
clean:
	rm -f memory
format:
	clang-format -i *.[ch]
