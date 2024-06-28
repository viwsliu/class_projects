//Vincent Liu
//viwliu
//1915968
//CSE101-01 Spring 2023
//
//Shuffle.cpp

#include "List.h"
#include <cassert>
#include <cstdio>
#include <iostream>
#include <stdexcept>
#include <string>

void shuffle(List &D) {
  // will shuffle D with 1 shuffle operation
  bool odd = false;
  int length = D.length();
  int half;
  List first;
  List second;
  List combined;
  if (length % 2 != 0) {
    odd = true;
    half = (length - 1) / 2;
  } else {
    half = length / 2;
  }
  D.moveFront();
  for (int i = 0; i < half; i++) {
    first.insertBefore(D.peekNext());
    D.moveNext();
  }
  int my_half = half;
  if (odd == true) {
    my_half++;
  }
  for (int i = 0; i < my_half; i++) {
    second.insertBefore(D.peekNext());
    D.moveNext();
  }
  first.moveFront();
  second.moveFront();
  for (int i = 0; i < half; i++) {
    combined.insertBefore(second.peekNext());
    combined.insertBefore(first.peekNext());
    first.moveNext();
    second.moveNext();
  }
  if (odd == true) {
    combined.insertAfter(second.peekNext());
  }
  D = combined;
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    std::cerr << "Not enough arguments!\n";
    exit(1);
  }


  int n = std::atoi(argv[1]);
  std::cout
      << "deck size       shuffle count\n------------------------------\n";
  for (int size = 1; size <= n; size++) {
    List D;
    D.moveFront();
    int counter = 0;
    for (int i = 0; i < size ; i++) {
      D.insertAfter(i);
      D.moveNext();
    }
    List copy(D);
    shuffle(copy);
    counter += 1;
    copy.moveFront();
    while (copy.equals(D) == false) {
      shuffle(copy);
      counter += 1;
      // std::cout << "copy=" << copy << "  counter=" << counter << "\n";
      // std::cout << "bruh " << counter << "\n";
    }
    std::string spaces;
    std::string temp = std::to_string(counter);
    int n = temp.length();
    for(int i=0; i<(15-n);i++){
	    spaces += " ";
    }
    std::cout << size << spaces << counter << "\n";
  }
}
