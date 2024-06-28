CC = clang
CFLAGS = -Wall -Wextra -Wpedantic -std=c17 -Werror

link_flags = $(shell pkg-config --libs gmp)

vincent_objs = numtheory.o randstate.o ss.o

all: decrypt encrypt keygen

numtheory.o: numtheory.c numtheory.h
	$(CC) $(CFLAGS) -o numtheory.o -c $<
randstate.o: randstate.c randstate.h
	$(CC) $(CFLAGS) -o randstate.o -c $<
ss.o: ss.c ss.h
	$(CC) $(CFLAGS) -o ss.o -c $<
decrypt.o: decrypt.c numtheory.h ss.h randstate.h
	$(CC) $(CFLAGS) -c $<
encrypt.o: encrypt.c numtheory.h ss.h randstate.h
	$(CC) $(CFLAGS) -c $<
keygen.o: keygen.c numtheory.h ss.h randstate.h
	$(CC) $(CFLAGS) -c $<

decrypt: decrypt.o $(vincent_objs)
	$(CC) $(CFLAGS) -o decrypt $< $(vincent_objs) $(link_flags)
encrypt: encrypt.o $(vincent_objs)
	$(CC) $(CFLAGS) -o encrypt $< $(vincent_objs) $(link_flags)
keygen: keygen.o $(vincent_objs)
	$(CC) $(CFLAGS) -o keygen $< $(vincent_objs) $(link_flags)

clean:
	rm -f decrypt encrypt keygen ss.o randstate.o numtheory.o decrypt.o encrypt.o keygen.o
format:
	clang-format -i -style=file *.[ch]

