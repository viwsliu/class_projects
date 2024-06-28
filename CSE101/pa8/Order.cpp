//Vincent Liu
//CSE101-01 Spring 2023
//Pa8
//viwliu
//1915968

#include <bits/stdc++.h>
#include <iostream>
#include <cassert>
#include "Dictionary.h"

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
        

	Dictionary A;
	int line_num = 1;
	std::string temp, output1, output2;
	//read all lines
	while(getline(inputfile, temp)){
		A.setValue(temp,line_num);
		line_num++;
	}
	
	output1 = A.to_string();
	outputfile << output1 << std::endl;
	output2 = A.pre_string();
	outputfile << output2 << std::endl;
}
