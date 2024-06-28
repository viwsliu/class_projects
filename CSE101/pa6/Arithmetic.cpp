//Vincent Liu
//CSE101-01 Spring 2023
//Pa6
//viwliu
//1915968

#include <bits/stdc++.h>
#include <iostream>
#include <cassert>
#include "BigInteger.h"

using namespace std;

int main(int argc,char* argv[]){
	if(argc!=3){
		fprintf(stderr, "Not enough arguments!\n");
		exit(EXIT_FAILURE);
	}
	//open files
	std::ifstream inputfile;
	std::ofstream outputfile;

	inputfile.open(argv[1]);
	outputfile.open(argv[2]);

	//read first 3 lines;
	string line1, line2, line3;
	getline(inputfile, line1);
	getline(inputfile, line2);
	getline(inputfile, line3);
		
	BigInteger A(line1);
	BigInteger B(line3);

//operations 
	BigInteger tempBig;
	BigInteger tempBigA;
	BigInteger tempBigB;
	//print A #1
	string temp = A.to_string();
	outputfile << temp << "\n" << "\n";

	//print B #2
	temp = B.to_string();
	outputfile << temp << "\n" << "\n";
	
	//A+B #3
	tempBig = A+B;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//A-B #4
	tempBig = A-B;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//A-A #5
	tempBig = A-A;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//3A-2B #6
	tempBigA = 3*A;
	tempBigB = 2*B;
	tempBig = tempBigA - tempBigB;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//AB #7
	tempBig = A*B;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//A^2 #8
	tempBig = A*A;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//B^2 #9
	tempBig = B*B;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
	
	//9A^4 + 16B^5 #10
	tempBigA.makeZero();
	tempBigB.makeZero();
	tempBigA = A*A*A*A;
	tempBigA*=9;
	tempBigB = B*B*B*B*B;
	tempBigB = 16 * tempBigB;
	tempBig.makeZero();
	tempBig = tempBigA + tempBigB;
	temp = tempBig.to_string();
	outputfile << temp << "\n" << "\n";
}
