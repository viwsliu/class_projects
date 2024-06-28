#------------------------------------------------------------------------------
#  Makefile for CSE 101 Programming Assignment 4 
#  Vincent Liu
#  viwliu
#  1915968
#  CSE101-01 Spring 2023
#
BASE_SOURCES   = Matrix.c List.c
BASE_OBJECTS   = Matrix.o List.o
HEADERS        = Matrix.h List.h
COMPILE        = gcc -std=c17 -Wall -g -c
LINK           = gcc -std=c17 -Wall -g -o
REMOVE         = rm -f
MEMCHECK       = valgrind --leak-check=full

Sparse : Sparse.o $(BASE_OBJECTS)
	$(LINK) Sparse Sparse.o $(BASE_OBJECTS)

MatrixClient : MatrixClient.o $(BASE_OBJECTS)
	$(LINK) MatrixClient MatrixClient.o $(BASE_OBJECTS)

MatrixTest : MatrixTest.o $(BASE_OBJECTS)
	$(LINK) MatrixTest MatrixTest.o $(BASE_OBJECTS)

ListTest : ListTest.o $(BASE_OBJECTS)
	$(LINK) ListTest ListTest.o $(BASE_OBJECTS)

Sparse.o : Sparse.c $(HEADERS)
	$(COMPILE) Sparse.c

MatrixTest.o : MatrixTest.c $(HEADERS)
	$(COMPILE) MatrixTest.c

ListTest.o : ListTest.c $(HEADERS)
	$(COMPILE) ListTest.c

MatrixClient.o : MatrixClient.c $(HEADERS)
	$(COMPILE) MatrixClient.c

$(BASE_OBJECTS) : $(BASE_SOURCES) $(HEADERS)
	$(COMPILE) $(BASE_SOURCES)

clean :
	$(REMOVE) Sparse MatrixTest ListTest *.o 
