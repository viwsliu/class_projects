//Vincent Liu
//cse101-01 spring 2023
//pa4
//viwliu@ucsc.edu
//1915968
//Sparse.c

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

#include "Matrix.h"

int main(int argc, char *argv[]){
        FILE *in;
        FILE *out;
        int n;
        int num1;
        int num2;
	int num3;
	int num4;
	double value;
	Matrix temp;
        if(argc!=3){
                fprintf(stderr, "Not enough aruments!\n");
                exit(EXIT_FAILURE);
        }
        in=fopen(argv[1],"r");
        if(in==NULL){
                fprintf(stderr, "Input file is NULL!\n");
                exit(EXIT_FAILURE);
        }
        out=fopen(argv[2],"w");
        if(out==NULL){
                fprintf(stderr, "Failed to open output file for writing!\n");
                exit(EXIT_FAILURE);
        }
        //get size
	assert(fscanf(in, "%d %d %d\n", &n, &num1, &num2) == 3);
	Matrix matrixA = newMatrix(n);
	Matrix matrixB = newMatrix(n);
	for(int i=0;i<num1;i++){
		assert(fscanf(in, "%d %d %lf\n", &num3, &num4, &value) == 3);
		changeEntry(matrixA,num3,num4,value);
        }
	
	for(int j=0;j<num2;j++){
		assert(fscanf(in, "%d %d %lf\n",&num3, &num4, &value) == 3);
		changeEntry(matrixB,num3,num4,value);
	}

	//NNZ A
	fprintf(out, "A has %d non-zero entries:\n",NNZ(matrixA));
	printMatrix(out, matrixA);
	fprintf(out, "\n");

	//NNZ B
	fprintf(out, "B has %d non-zero entries:\n",NNZ(matrixB));
	printMatrix(out, matrixB);
	fprintf(out, "\n");

	//1.5*A
	fprintf(out, "(1.5)*A =\n");
	temp = scalarMult(1.5,matrixA);
	printMatrix(out, temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//A+B
	fprintf(out, "A+B =\n");
	temp = sum(matrixA, matrixB);
	printMatrix(out, temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//A+A
	fprintf(out, "A+A =\n");
	temp = sum(matrixA,matrixA);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//B-A
	fprintf(out, "B-A =\n");
	temp = diff(matrixB,matrixA);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//A-A
	fprintf(out, "A-A =\n");
	temp = diff(matrixA,matrixA);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//Transpose A
	fprintf(out, "Transpose(A) =\n");
	temp = transpose(matrixA);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");

	//A*B
	fprintf(out, "A*B =\n");
	temp = product(matrixA, matrixB);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");
	
	//B*B
	fprintf(out, "B*B =\n");
	temp = product(matrixB, matrixB);
	printMatrix(out,temp);
	freeMatrix(&temp);
	fprintf(out, "\n");


	freeMatrix(&matrixA);
	freeMatrix(&matrixB);
	fclose(in);
	fclose(out);
}
