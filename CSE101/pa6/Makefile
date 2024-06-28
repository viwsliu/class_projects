#Vincent Liu
#1915968
#viwliu
#pa6
#CSE101-01 Spring 2023
#------------------------------------------------------------------------------
#  Makefile for CSE 101 Programming Assignment 6
#
#  make                     makes Arithmetic
#  make BigIntegerClient    makes BigIntegerClient
#  make ListClient          makes ListClient
#  make clean               removes all binaries
#  make ArithmeticCheck     runs Arithmetic in valgrind on in4 junk4
#  make BigIntegerCheck     runs BigIntegerTest in valgrind
#  make ListCheck           runs ListTest in valgrind
#------------------------------------------------------------------------------

MAIN           = Arithmetic
ADT1           = BigInteger
ADT2           = List
SOURCE         = $(MAIN).cpp
OBJECT         = $(MAIN).o
ADT1_TEST      = $(ADT1)Client
ADT1_SOURCE    = $(ADT1).cpp
ADT1_OBJECT    = $(ADT1).o
ADT1_HEADER    = $(ADT1).h
ADT2_TEST      = $(ADT2)Client
ADT2_SOURCE    = $(ADT2).cpp
ADT2_OBJECT    = $(ADT2).o
ADT2_HEADER    = $(ADT2).h
COMPILE        = g++ -std=c++17 -Wall -c
LINK           = g++ -std=c++17 -Wall -o
REMOVE         = rm -f
MEMCHECK       = valgrind --leak-check=full

$(MAIN): $(OBJECT) $(ADT1_OBJECT) $(ADT2_OBJECT)
	$(LINK) $(MAIN) $(OBJECT) $(ADT1_OBJECT) $(ADT2_OBJECT)

$(ADT1_TEST): $(ADT1_TEST).o $(ADT1_OBJECT) $(ADT2_OBJECT)
	$(LINK) $(ADT1_TEST) $(ADT1_TEST).o $(ADT1_OBJECT) $(ADT2_OBJECT)

$(ADT2_TEST): $(ADT2_TEST).o $(ADT2_OBJECT)
	$(LINK) $(ADT2_TEST) $(ADT2_TEST).o $(ADT2_OBJECT)

$(OBJECT): $(SOURCE) $(ADT1_HEADER) $(ADT2_HEADER)
	$(COMPILE) $(SOURCE)

$(ADT1_TEST).o: $(ADT1_TEST).cpp $(ADT1_HEADER) $(ADT2_HEADER)
	$(COMPILE) $(ADT1_TEST).cpp

$(ADT2_TEST).o: $(ADT2_TEST).cpp $(ADT2_HEADER)
	$(COMPILE) $(ADT2_TEST).cpp

$(ADT1_OBJECT): $(ADT1_SOURCE) $(ADT1_HEADER)
	$(COMPILE) $(ADT1_SOURCE)

$(ADT2_OBJECT): $(ADT2_SOURCE) $(ADT2_HEADER)
	$(COMPILE) $(ADT2_SOURCE)

ListTest : ListTest.o List.o
	g++ -std=c++17 -Wall -g -o $@ $^

ListTest.o : ListTest.cpp List.h
	g++ -std=c++17 -Wall -g -c $<

BigIntegerTest: BigIntegerTest.o BigInteger.o List.o
	g++ -std=c++17 -Wall -g -o $@ $^

BigIntegerTest.o: BigIntegerTest.cpp BigInteger.h
	g++ -std=c++17 -Wall -g -c $<

clean:
	$(REMOVE) $(MAIN) $(ADT1_TEST) $(ADT2_TEST)  
	$(REMOVE) $(OBJECT) $(ADT1_TEST).o $(ADT2_TEST).o $(ADT1_OBJECT) $(ADT2_OBJECT) BigIntegerTest.o ListTest.o BigIntegerTest ListTest

$(MAIN)Check: $(MAIN)
	$(MEMCHECK) $(MAIN) in4 junk4

$(ADT1)Check: $(ADT1_TEST)
	$(MEMCHECK) $(ADT1_TEST)

$(ADT2)Check: $(ADT2_TEST)
	$(MEMCHECK) $(ADT2_TEST)
