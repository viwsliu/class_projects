CC = clang
CFLAGS = -Wall -Wextra -Wpedantic  -std=c17 -Werror 

vincent_objs = io.o trie.o word.o 

all: encode decode

trie.o: trie.c trie.h
	$(CC) $(CFLAGS) -o $@ -c $<
word.o: word.c word.h
	$(CC) $(CFLAGS) -o $@ -c $<
io.o: io.c io.h
	$(CC) $(CFLAGS) -o $@ -c $<

decode.o: decode.c endian.h io.h trie.h word.h
	$(CC) $(CFLAGS) -o $@ -c $<
encode.o: encode.c endian.h io.h trie.h word.h
	$(CC) $(CFLAGS) -o $@ -c $<

decode: decode.o $(vincent_objs)
	$(CC) $(CFLAGS) -o decode $^
encode: encode.o $(vincent_objs)
	$(CC) $(CFLAGS) -o encode $^

clean:
	rm -f decode encode $(vincent_objs) encode.o decode.o
format:
	clang-format -i -style=file *.[ch]

