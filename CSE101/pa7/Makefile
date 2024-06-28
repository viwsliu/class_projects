#Vincent Liu
#CSE101-01 Spring 2023
#viwliu
#1915968

#------------------------------------------------------------------------------
#  Makefile for CSE 101 Programming Assignment 7
#
#  make                     makes Order
#  make DictionaryClient    makes DictionaryClient
#  make clean               removes all binaries
#  make OrderCheck          runs Order under valgrind on in5 junk5
#  make DictionaryCheck     runs DictionaryClient under valgrind
#------------------------------------------------------------------------------

MAIN           = Order
ADT            = Dictionary
SOURCE         = $(MAIN).cpp
OBJECT         = $(MAIN).o
ADT_TEST       = $(ADT)Client
ADT_SOURCE     = $(ADT).cpp
ADT_OBJECT     = $(ADT).o
ADT_HEADER     = $(ADT).h
COMPILE        = g++ -std=c++17 -Wall -Wextra -Wpedantic -Wshadow -g -c
LINK           = g++ -std=c++17 -Wall -Wextra -Wpedantic -Wshadow -g -o
REMOVE         = rm -f
MEMCHECK       = valgrind --leak-check=full


$(MAIN): $(OBJECT) $(ADT_OBJECT)
	$(LINK) $(MAIN) $(OBJECT) $(ADT_OBJECT)

$(ADT_TEST): $(ADT_TEST).o $(ADT_OBJECT)
	$(LINK) $(ADT_TEST) $(ADT_TEST).o $(ADT_OBJECT)

$(OBJECT): $(SOURCE) $(ADT_HEADER)
	$(COMPILE) $(SOURCE)

$(ADT_TEST).o: $(ADT_TEST).cpp $(ADT_HEADER)
	$(COMPILE) $(ADT_TEST).cpp

$(ADT_OBJECT): $(ADT_SOURCE) $(ADT_HEADER)
	$(COMPILE) $(ADT_SOURCE)

DictionaryTest: DictionaryTest.o Dictionary.o
	$(LINK) $@ $^

DictionaryTest.o: DictionaryTest.cpp Dictionary.h
	$(COMPILE) $<

ModelDictionaryTest: ModelDictionaryTest.o Dictionary.o
	$(LINK) $@ $^

ModelDictionaryTest.o: ModelDictionaryTest.cpp Dictionary.h
	$(COMPILE) $<

clean:
	$(REMOVE) $(MAIN) $(ADT_TEST) $(OBJECT) $(ADT_TEST).o $(ADT_OBJECT) DictionaryTest 

$(MAIN)Check: $(MAIN)
	$(MEMCHECK) $(MAIN) in5 junk5

$(ADT)Check: $(ADT_TEST)
	$(MEMCHECK) $(ADT_TEST)

