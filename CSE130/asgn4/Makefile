CC = clang
CFLAGS = -Wall -Wextra -Werror -Wpedantic --std=c17 -g

all: httpserver

httpserver: httpserver.o ./helpers/asgn4_helper_funcs.a
	$(CC) $(CFLAGS) -o $@ $^

httpserver.o: httpserver.c
	$(CC) $(CFLAGS) -o $@ -c $<

clean:
	rm -f httpserver httpserver.o

format:
	clang-format -i *.[ch]
