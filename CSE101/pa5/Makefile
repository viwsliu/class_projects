#------------------------------------------------------------------------------
# Vincent Liu
# 1915968
# viwliu
# CSE101-01 Spring 2023
#------------------------------------------------------------------------------

#  Makefile for List ADT
#
#  make                makes Shuffle
#  make ListClient     make ListClient
#  make clean          removes binary files
#  make check1         runs valgrind on ListClient
#  make check2         runs valgrind on Shuffle with CLA 35
#------------------------------------------------------------------------------

Shuffle : Shuffle.o List.o
	g++ -std=c++17 -Wall -g -o Shuffle Shuffle.o List.o 

Shuffle.o : List.h Shuffle.cpp
	g++ -std=c++17 -Wall -g -c Shuffle.cpp

ListTest : ListTest.o List.o
	g++ -std=c++17 -Wall -g -o $@ $^

ListTest.o : ListTest.cpp List.h
	g++ -std=c++17 -Wall -g -c $<

ListClient : ListClient.o List.o
	g++ -std=c++17 -Wall -g -o ListClient ListClient.o List.o 

ListClient.o : List.h ListClient.cpp
	g++ -std=c++17 -Wall -g -c ListClient.cpp

List.o : List.h List.cpp
	g++ -std=c++17 -Wall -g -c List.cpp

clean :
	rm -f Shuffle Shuffle.o ListClient ListClient.o List.o

check1 : ListClient
	valgrind --leak-check=full ListClient

check2 : Shuffle
	valgrind --leak-check=full Shuffle 35
