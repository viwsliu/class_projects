//Vincent Liu
//CSE101-01 Spring 23
//viwliu 
//1915968

#include <bits/stdc++.h>
#include <iostream>
#include <cassert>
#include <string>
#include <fstream>
#include <algorithm>
#include "Dictionary.h"

using namespace std;

int main(int argc,char* argv[]){
	std::ifstream inputfile;
	std::ofstream outputfile;
	string filestring, temp;
	Dictionary tempDict;
	string delim = " \t\\\"\',<.>/?;:[{]}|`~!@#$%^&*()-_=+0123456789";
	size_t len,times;

	if(argc!=3){
		fprintf(stderr, "Not enough arguments!\n");
		exit(EXIT_FAILURE);
	}
	inputfile.open(argv[1]);
	if(!inputfile.is_open()){
		cerr << "Unable to open file" << argv[1] << " for reading" << std::endl;
		return EXIT_FAILURE;
	}
	outputfile.open(argv[2]);
	if(!outputfile.is_open()){
		cerr << "Unable to open file" << argv[2] << " for reading" << std::endl;
		return EXIT_FAILURE;
	}


	while(getline(inputfile, filestring)){
		len = filestring.length();

		size_t begin = min(filestring.find_first_not_of(delim, 0), len);
		size_t end = min(filestring.find_first_of(delim, begin), len);
		temp = filestring.substr(begin, end-begin);

		while(temp != ""){
			transform(temp.begin(), temp.end(), temp.begin(), ::tolower);
			if (tempDict.contains(temp) == true){
				times = tempDict.getValue(temp);
				times++;
				tempDict.remove(temp);
				tempDict.setValue(temp, times);
			}
			else{
				tempDict.setValue(temp, 1);
			}
			begin = min(filestring.find_first_not_of(delim, end+1),len);
			end = min(filestring.find_first_of(delim, begin), len);
			temp = filestring.substr(begin, end-begin);
		}

	}

	string output1 = tempDict.to_string();
	outputfile << output1 << std::endl;
	inputfile.close();
	outputfile.close();
	return EXIT_SUCCESS;
}
