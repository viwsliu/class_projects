//MatrixTest.c
//Vincent Liu
//CSE101-01 Spring 2023
//PA4
//viwliu
//1915968

#include<stdlib.h>
#include<stdio.h>
#include<stdbool.h>
#include"Matrix.h"

int main(){
	int n=100000;
	int temp;
	Matrix A = newMatrix(n);
	Matrix B = newMatrix(n);
	Matrix C, D, E, F, G, H, I, J, K, L;

	changeEntry(A, 1,1,92); changeEntry(B, 1,1,62);
	changeEntry(A, 2,2,20); changeEntry(B, 1,2,28);
	changeEntry(A, 1,30,30); changeEntry(B, 1,3,25);
	changeEntry(A, 2,1,4); changeEntry(B, 2,2,83);
	changeEntry(A, 2,2,50); changeEntry(B, 2,2,72);
	changeEntry(A, 2,3,60); changeEntry(B, 2,3,89);
	changeEntry(A, 3,1,50); changeEntry(B, 3,1,23);
	changeEntry(A, 3,2,34); changeEntry(B, 3,2,87);
	changeEntry(A, 4,3,67); changeEntry(B, 3,3,67);

	C = copy(A);
	D = transpose(B);
	E = transpose(A);
	F = transpose(E);
	temp=equals(F,A);
	if(temp==true){
		fprintf(stdout,"true\n");
	}else{
		fprintf(stdout,"false\n");
	}
	temp = NNZ(A);
	fprintf(stdout,"NNZ=%d\n",temp);
	temp = size(A);
	fprintf(stdout,"size=%d\n",temp);
	makeZero(F);
	L=scalarMult(1.6,E);
	K=product(L,C);
	G=sum(K,A);
	H=diff(G,L);
	I=transpose(H);
	J=transpose(L);
	fprintf(stdout, "\n");
	printMatrix(stdout, A);
	fprintf(stdout, "\n");
	printMatrix(stdout, B);
	fprintf(stdout, "\n");
	printMatrix(stdout, C);
	fprintf(stdout, "\n");
	printMatrix(stdout, D);
	fprintf(stdout, "\n");
	printMatrix(stdout, E);
	fprintf(stdout, "\n");
	printMatrix(stdout, F);
	fprintf(stdout, "\n");
	printMatrix(stdout, G);
	fprintf(stdout, "\n");
	printMatrix(stdout, H);
	fprintf(stdout, "\n");
	printMatrix(stdout, I);
	fprintf(stdout, "\n");
	printMatrix(stdout, J);
	fprintf(stdout, "\n");
	printMatrix(stdout, K);
	fprintf(stdout, "\n");
	printMatrix(stdout, L);
	fprintf(stdout, "\n");
	fprintf(stdout, "\n");
	freeMatrix(&A);
	freeMatrix(&B);
	freeMatrix(&C);
	freeMatrix(&D);
	freeMatrix(&E);
	freeMatrix(&F);
	freeMatrix(&G);
	freeMatrix(&I);
	freeMatrix(&J);
	freeMatrix(&K);
	freeMatrix(&L);
	freeMatrix(&H);
}
