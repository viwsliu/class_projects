CC = clang 
CFLAGS = -Wall -Wextra -Werror -Wpedantic -std=c17 -gdwarf-4

all: queue.o rwlock.o

queue.o: queue.c queue.h
	$(CC) $(CFLAGS) -o queue.o -c $<

rwlock.o: rwlock.c rwlock.h
	$(CC) $(CFLAGS) -o rwlock.o -c $<

clean:
	rm -f queue *.o
format:
	clang-format -i *.[ch]
