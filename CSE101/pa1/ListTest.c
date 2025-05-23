/****************************************************************************************
 * Vincent Liu
 * Spring 2023, CSE101-01
 * ListTest.c
 * Test client for List ADT
 * *****************************************************************************************/
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>
#include"List.h"

int main(int argc, char* argv[]){

   List A = newList();
   List B = newList();
   List C = NULL;
   int i;

   for(i=1; i<=30; i++){
      append(A,i);
      prepend(B,i);
   }

   printList(stdout,A);
   printf("\n");
   printList(stdout,B);
   printf("\n");

   for(moveFront(A); index(A)>=0; moveNext(A)){
      printf("%d ", get(A));
   }
   printf("\n");
   for(moveBack(B); index(B)>=0; movePrev(B)){
      printf("%d ", get(B));
   }
   printf("\n");

   C = copyList(A);
   printf("%s\n", equals(A,B)?"true":"false");
   printf("%s\n", equals(B,C)?"true":"false");
   printf("%s\n", equals(C,A)?"true":"false");


   moveFront(A);
   for(i=0; i<5; i++) moveNext(A); // at index 5
   insertBefore(A, -1);            // at index 6
   for(i=0; i<9; i++) moveNext(A); // at index 15
   insertAfter(A, -2);
   for(i=0; i<5; i++) movePrev(A); // at index 10
   delete(A);
   printList(stdout,A);
   printf("\n");
   printf("%d\n", length(A));
   clear(A);
   printf("%d\n", length(A));
   clear(C);
   for(i=0;i<=15;i++){
      append(C,i);
   }
   printList(stdout,C);
   printf("\n");

   freeList(&A);
   freeList(&B);
   freeList(&C);

   return(0);
}

/*
 * Output of this program:
 * 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
 * 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
 * 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
 * 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
 * false
 * false
 * true
 * 1 2 3 4 5 -1 6 7 8 9 11 12 13 14 15 -2 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
 * 31
 * 0
 * 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
 * */

