//Vincent Liu
//viwliu
//1915968
//CSE101-01 Spring 2023
//
//ListTest.cpp



#include "List.h"
#include <cassert>
#include <cstdio>
#include <iostream>
#include <stdexcept>
#include <string>

using namespace std;

int main(){
	int i;
	int n=20;
	List A, B, C, D;

	for(i=1; i<=n; i++){
		A.insertAfter(i);
		B.insertAfter(9-i);
		C.insertBefore(i+1);
		D.insertBefore(5-i);
	}

	cout << endl;
	cout << "A.position() = " << A.position() << endl;
	cout << "B = " << B << endl;
	cout << "B.position() = " << B.position() << endl;
	cout << "C = " << C << endl;
	cout << "C.position() = " << C.position() << endl;
	cout << "D = " << D << endl;
	cout << "D.position() = " << D.position() << endl;
	cout << endl;

   A.moveBack();
   B.moveBack();
   C.moveFront();
   D.moveFront();


   cout << endl << "B: ";
   for(i=1; i<=7; i++){
      cout << B.movePrev() << " ";
   }
   cout << endl << "B.position() = " << B.position() << endl;

   cout << endl << "C: ";
   for(i=1; i<=7; i++){
      cout << C.moveNext() << " ";
   }
   cout << endl << "C.position() = " << C.position() << endl;


      cout << endl;
   cout << "A==B is " << (A==B?"true":"false") << endl;
   cout << "B==C is " << (B==C?"true":"false") << endl;
   cout << "C==D is " << (C==D?"true":"false") << endl;
   cout << "D==A is " << (D==A?"true":"false") << endl;
   cout << endl;

      cout << B.findNext(5) << endl;
   cout << B << endl;
   B.eraseBefore();
   B.eraseAfter();
   cout << B << endl;
   cout << B.position() << endl;
   cout << B.findPrev(2) << endl;
   B.eraseBefore();
   B.eraseAfter();
   cout << B << endl;
   cout << B.position() << endl;
   cout << B.findNext(20) << endl;
   cout << B.position() << endl;
   cout << B.findPrev(20) << endl;
   cout << B.position() << endl;
   cout << endl;


   return(EXIT_SUCCESS);
}
