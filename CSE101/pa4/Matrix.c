//Vincent Liu
//cse101-01 spring 2023
//Matrix.c pa4
//viwliu@ucsc.edu
//1915968

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

#include "Matrix.h"

struct Matrix{
	List* array;
	int total;
};

struct ColVal{
	int column;
	double value;
};

Matrix newMatrix(int n){//Returns a reference to a new nXn Matrix object in the zero state.
	Matrix new_Matrix = (Matrix) malloc(sizeof(struct Matrix));
	new_Matrix->array = (List*) malloc((n+1) * (sizeof(List)));
	for(int i=0; i<=n;i++){
		new_Matrix->array[i] = newList();
	}
	new_Matrix->total = n;
	return new_Matrix;
}

void freeMatrix(Matrix* pM){// // Frees heap memory associated with *pM, sets *pM to NULL.
	for(int i=0;i<=(size(*pM));i++){
		for(moveFront((*pM)->array[i]); index((*pM)->array[i]) != -1; moveNext((*pM)->array[i])){
			free(get((*pM)->array[i]));
		}
		freeList(&((*pM)->array[i]));
	}
	free(((*pM)->array));
	free(*pM);
}

// // Access functions
int size(Matrix M){// // Return the size of square Matrix M.
	return M->total;
}
int NNZ(Matrix M){// // Return the number of non-zero elements in M.
	int count=0;
	for(int i=1;i<=(M->total);i++){
		count = count + length(M->array[i]);
	}	
	return count;
}


int equals(Matrix A, Matrix B){// // Return true (1) if matrices A and B are equal, false (0) otherwise.
	if(A->total != B->total){
		return 0;
	}
	if(A==B){
		return 1;
	}
	for(int i=1; i<=(A->total);i++){
		List row_A = A->array[i];
		List row_B = B->array[i];
		if(length(row_A) != length(row_B)){
			return 0;
		}
		moveFront(row_A);
		moveFront(row_B);
		for(int j=0; j<(length(row_A));j++){
			if((((struct ColVal*) get(row_A))->column) != (((struct ColVal*) get(row_B))->column)){
				return 0;
			}
			if((((struct ColVal*) get(row_A))->value) != (((struct ColVal*) get(row_B))->value)){
				return 0;
			}
			moveNext(row_A);
			moveNext(row_B);
		}
	}
	return 1;
}
// Manipulation procedures
void makeZero(Matrix M){// // Re-sets M to the zero Matrix state.
	for(int i=0;i<=(M->total);i++){
		for(moveFront(M->array[i]); index(M->array[i]) != -1; moveNext(M->array[i])){
			free(get(M->array[i]));
		}
		clear(M->array[i]);
	}
}

void insert(List L, int col, double val){
	struct ColVal *pear = (struct ColVal*) malloc(sizeof(struct ColVal));
	pear->column = col;
	pear->value = val;

	moveFront(L);
	while((index(L) != -1) && (pear->column > ((struct ColVal*) get(L))->column)){
		moveNext(L);
	}
	if(index(L) == -1){
		if(val != 0){//if value is zero and entry doesn't exist do nothing
			append(L, pear);
		}else{
			free(pear);
		}
		return;
	}
	if((pear->column) == (((struct ColVal*)get(L))->column)){
		free(get(L));
		if(val == 0){//if value is zero and entry exists delete the entry
			delete(L);
			free(pear);
		}else{
			set(L,pear);
		}
		return;
	}
	if(val != 0){
		insertBefore(L,pear);
	}else{
		free(pear);
	}
}


void changeEntry(Matrix M, int i, int j, double x){
	// // Changes the ith row, jth column of M to the value x.
	// // Pre: 1<=i<=size(M), 1<=j<=size(M)
	if((1<=i) && (i<=(M->total)))
		insert(M->array[i], j, x);


}

// Matrix Arithmetic operations
Matrix copy(Matrix A){ // // Returns a reference to a new Matrix object having the same entries as A.
	Matrix new_matrix = newMatrix(A->total);
	for(int i=0; i<(A->total);i++){
		List old = A->array[i];
		moveFront(old);
		for(int j=0;j<(length(old));j++){
			int column = ((struct ColVal*) get(old))->column;
			double value = ((struct ColVal*) get(old))->value;
			insert(new_matrix->array[i],column,value);
			moveNext(old);
		}
	}
	return new_matrix;
}

Matrix transpose(Matrix A){ // // Returns a reference to a new Matrix object representing the transpose of A.
	Matrix new_matrix = newMatrix(A->total);
	for(int i=0; i<=(A->total);i++){
		List old = A->array[i];
		moveFront(old);
		for(int j=0;j<(length(old));j++){
			int column = ((struct ColVal*) get(old))->column;
			double value = ((struct ColVal*) get(old))->value;
			insert(new_matrix->array[column],i,value);
			moveNext(old);
		}
	}
	return new_matrix;
}

Matrix scalarMult(double x, Matrix A){ // // Returns a reference to a new Matrix object representing xA.
	Matrix new_matrix = newMatrix(A->total);
	for(int i=1; i<=(A->total);i++){
		List old = A->array[i];
		moveFront(old);
		for(int j=0;j<(length(old));j++){
			int column = ((struct ColVal*) get(old))->column;
			double value = ((struct ColVal*) get(old))->value * x;
			insert(new_matrix->array[i],column,value);
			moveNext(old);
		}
	}
	return new_matrix;

}


Matrix sum(Matrix A, Matrix B){// // Returns a reference to a new Matrix object representing A+B.
			       // // pre: size(A)==size(B)
	if((A->total) != (B->total)){
		fprintf(stderr, "Failed Precondition for sum()!");
		exit(EXIT_FAILURE);
	}
	if(A==B){
		return scalarMult(2,A);
	}
	Matrix new_matrix = newMatrix(A->total);

	int limit = B->total;
	for(int i=1; i<=(limit);i++){
		List old = A->array[i];
		List oldB = B->array[i];
		moveFront(old);
		moveFront(oldB);
		while((index(old) != -1) || (index(oldB) != -1)){
			if(index(old) == -1){
				double value = ((struct ColVal*) get(oldB))->value;
				int columnB = ((struct ColVal*) get(oldB))->column;
				insert(new_matrix->array[i],columnB,value);
				moveNext(oldB);
				continue;
			}
			if(index(oldB) == -1){
				double value = ((struct ColVal*) get(old))->value;
				int columnA = ((struct ColVal*) get(old))->column;
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
				continue;
			}
			int columnA = ((struct ColVal*) get(old))->column;
			int columnB = ((struct ColVal*) get(oldB))->column;
			if (columnA<columnB){
				double value = ((struct ColVal*) get(old))->value;
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
			}
			if (columnA>columnB){
				double value = ((struct ColVal*) get(oldB))->value;
				insert(new_matrix->array[i],columnB,value);
				moveNext(oldB);
			}
			if(columnA==columnB){
				double value = (((struct ColVal*) get(old))->value) + (((struct ColVal*) get(oldB))->value);
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
				moveNext(oldB);
			}
		}
	}
	return new_matrix;
}

Matrix diff(Matrix A, Matrix B){// // Returns a reference to a new Matrix object representing A-B.
				// // pre: size(A)==size(B)
	if((A->total) != (B->total)){
		fprintf(stderr, "Failed Precondition for ddifdf()!");
		exit(EXIT_FAILURE);
	}
	Matrix new_matrix = newMatrix(A->total);
	if(A==B){
		return new_matrix;
	}
	int limit = B->total;
	for(int i=1; i<=(limit);i++){
		List old = A->array[i];

		List oldB = B->array[i];


		moveFront(old);
		moveFront(oldB);
		while((index(old) != -1) || (index(oldB) != -1)){
			if(index(old) == -1){
				double value = ((struct ColVal*) get(oldB))->value;
				int columnB = ((struct ColVal*) get(oldB))->column;
				insert(new_matrix->array[i],columnB,-value);
				moveNext(oldB);
				continue;
			}
			if(index(oldB) == -1){
				double value = ((struct ColVal*) get(old))->value;
				int columnA = ((struct ColVal*) get(old))->column;
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
				continue;
			}
			int columnA = ((struct ColVal*) get(old))->column;
			int columnB = ((struct ColVal*) get(oldB))->column;
			if (columnA<columnB){
				double value = ((struct ColVal*) get(old))->value;
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
			}
			if (columnA>columnB){
				double value = ((struct ColVal*) get(oldB))->value;
				insert(new_matrix->array[i],columnB,-value);
				moveNext(oldB);
			}
			if(columnA==columnB){
				double value = (((struct ColVal*) get(old))->value) - (((struct ColVal*) get(oldB))->value);
				insert(new_matrix->array[i],columnA,value);
				moveNext(old);
				moveNext(oldB);
			}
		}
	}
	return new_matrix;
}


Matrix product(Matrix A, Matrix B){
	// // Returns a reference to a new Matrix object representing AB
	// // pre: size(A)==size(B)
	if((A->total) != (B->total)){
		fprintf(stderr, "Failed Precondition for product()!");
		exit(EXIT_FAILURE);
	}
	Matrix new_matrix = newMatrix(A->total);
	double sum;
	Matrix tempB = transpose(B);
	for(int i=1; i<=(A->total);i++){
		List rowA = A->array[i];
		if(length(rowA)!=0){
			for(int j=1; j<=(B->total);j++){
				List rowB = tempB->array[j];
				moveFront(rowA);
				moveFront(rowB);
				if(length(rowB)!=0){
					sum=0;
					while(index(rowA) != -1 && index(rowB) != -1){ //dot product
						int columnA = ((struct ColVal*) get(rowA))->column;
						int columnB = ((struct ColVal*) get(rowB))->column;
						if (columnA<columnB){
							moveNext(rowA);
						}
						if (columnA>columnB){
							moveNext(rowB);
						}
						if(columnA==columnB){
							sum += (((struct ColVal*) get(rowA))->value) * (((struct ColVal*) get(rowB))->value);
							moveNext(rowA);
							moveNext(rowB);
						}
					}
					insert(new_matrix->array[i], j ,sum);
				}
			}
		}
	}
	freeMatrix(&tempB);
	return new_matrix;
}

void printMatrix(FILE* out, Matrix M){
	for(int a=1; a<=(M->total);a++){
		List temp = M->array[a];
		if(length(temp) != 0){
			moveFront(temp);
			fprintf(out, "%d: ", a);
			for(int j=0;j<(length(temp));j++){
				fprintf(out, "(%d, %.1f) ",((struct ColVal*) get(temp))->column,((struct ColVal*) get(temp))->value);
				moveNext(temp);

			}
			fprintf(out, "\n");
		}
	}

}
// // Prints a string representation of Matrix M to filestream out. Zero rows
// // are not printed. Each non-zero row is represented as one line consisting
// // of the row number, followed by a colon, a space, then a space separated
// // list of pairs "(col, val)" giving the column numbers and non-zero values
// // in that row. The double val will be rounded to 1 decimal point.
