CC = clang 
CFLAGS = -Wall -Wextra -Werror -Wpedantic -std=c17 -gdwarf-4

all: httpserver 

httpserver: httpserver.c
	$(CC) $(CFLAGS) -o httpserver httpserver.c asgn2_helper_funcs.a
clean:
	rm -f httpserver
format:
	clang-format -i *.[ch]
