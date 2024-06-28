/***************************************************************************************** 
 * Lex.c
 * Vincent Liu 
 * Main file for pa1
 * Spring 2023, CSE101-01
 * *****************************************************************************************/





#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <errno.h>
#include "List.h"

#define MAX_LEN 2000

int main(int argc, char *argv[]){
	int line_count=0;
	FILE *in; 
	FILE *out;
	char line[MAX_LEN];

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

	while(fgets(line, MAX_LEN, in) != NULL) {
		line_count++;
	}
	//line counter
	char** chararray = (char**) malloc (line_count * (sizeof(char*)));

	rewind(in);
	char mychar[MAX_LEN];
	int i=0;
	List mylist = newList();
	while(fgets(mychar,MAX_LEN, in)!=NULL){
		chararray[i]=malloc(MAX_LEN * sizeof(char));
		strcpy(chararray[i],mychar);

		i++;
	}
	//insertion sort

	for(int i=0;i<line_count;i++){
		moveBack(mylist);
		while((index(mylist) != -1)){
			if((strcmp(chararray[i], chararray[get(mylist)]) > 0 )) {
				break;
			}
			movePrev(mylist);
		}
		if(index(mylist) == -1) {
			prepend(mylist, i);
			continue;
		}
		else{
			insertAfter(mylist, i);
			continue;
		}
	
	}	
	moveFront(mylist);
	//print to out
	for(int i=0; i<(length(mylist));i++){
		fprintf(out, "%s", chararray[get(mylist)]);
		moveNext(mylist);
	}
	for(int i=0; i<(line_count);i++){
		free(chararray[i]);
	}
	//free
	free(chararray);
	freeList(&mylist);
	fclose(in);
	fclose(out);
	return(0);
}

