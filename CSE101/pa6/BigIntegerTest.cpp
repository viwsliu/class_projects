//-----------------------------------------------------------------------------
//Vincent Liu
//viwliu
//1915968
//CSE101-01 Spring2023
//
//  BigIntegerTest.cpp 
//  A test client for the BigInteger ADT
//-----------------------------------------------------------------------------
#include<iostream>
#include<string>
#include<stdexcept>
#include"BigInteger.h"

using namespace std;

int main(){

   string s1 = "91287346670000435634563400005619187236478";
   //string s2 = "-3302938475028475";
   string s3 = "9876545439000002000034565430000000006543654365346534";
   //string s4 = "987654590000000001000000000000065436545346534";
   string s5 = "98765454390000034563456191872363456345619345756780000065436543";
   //string s6 = "9876545439000000000000000000000006543";

   //BigInteger N;
   BigInteger A = BigInteger(s1);
   BigInteger B = BigInteger(s3);
   BigInteger C = BigInteger(s5);

   cout << endl;

   cout << "A = " << A << endl;
   cout << "B = " << B << endl;
   cout << "C = " << C << endl;
   cout << endl;

   BigInteger D = A+B;
   BigInteger E = B+A;
   BigInteger F = D-E;
   BigInteger G = 53234*A + 29384747*B + 928374*C;
   BigInteger H = A*B;
   BigInteger I = B*A;
   BigInteger J = G*H*I;

   cout << "(A==B) = " << ((A==B)?"True":"False") << endl;
   cout << "(A<B)  = " << ((A<B)? "True":"False") << endl;
   cout << "(A<=B) = " << ((A<=B)?"True":"False") << endl;
   cout << "(A>B)  = " << ((A>B)? "True":"False") << endl;
   cout << "(A>=B) = " << ((A>=B)?"True":"False") << endl << endl;

   cout << "D = " << D << endl;
   cout << "E = " << E << endl;
   cout << "(D==E) = " << ((D==E)?"True":"False") << endl;
   cout << "F = " << F << endl;
   cout << "G = " << G << endl;
   cout << "H = " << H << endl;
   cout << "I = " << I << endl;
   cout << "(H==I) = " << ((H==I)?"True":"False") << endl;
   cout << "J = " << J << endl << endl;

   cout << endl;

   A += B;
   B -= C;
   C *= J;
   cout << "A = " << A << endl;
   cout << "B = " << B << endl;
   cout << "C = " << C << endl;
   cout << endl;

   cout << A*B*C*D*E*G*H*I*J << endl << endl;

   cout << endl;

   return EXIT_SUCCESS;
}

