//ListTest.c
//Vincent Liu
//PA4
//CSE101-01 Spring 2023
//viwliu



#include<stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "List.h"

int main(int argc, char* argv[]){
	List A = newList();
	List B = newList();
	int X[] = {0,1,2,3,4,5,6,7,8,9,10};
	int i;


	for(i=1;i<=10;i++){
		append(A, &X[i]);
		prepend(B, &X[i]);
	}
	moveFront(A);
	moveBack(B);
	moveNext(A);
	movePrev(B);
	insertBefore(A, &X[4]);
	insertAfter(B, &X[8]);
	deleteBack(A);
	deleteFront(B);
	movePrev(B);
	set(A, &X[2]);
	delete(B);
	moveFront(B);

	printf("A: length=%d, index=%d, front=%d, back=%d, get=%d",length(A),index(A),*((int*)front(A)),*((int*)back(A)),*((int*)get(A)));
	printf("\n");
	printf("B: length=%d, index=%d, front=%d, back=%d, get=%d",length(B),index(B),*((int*)front(B)),*((int*)back(B)),*((int*)get(B)));
	printf("\n");
	
	freeList(&A);
	freeList(&B);
}
