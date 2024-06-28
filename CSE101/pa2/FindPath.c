//Vincent Liu
//viwliu@ucsc.edu
//#1915968
//PA2
//CSE101-01, Spring 2023
//FindPath.c


#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <assert.h>
#include "Graph.h"

int main(int argc, char *argv[]){
	FILE *in;
	FILE *out;
	int n;
	int from;
	int to;
	List L = newList();
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
	assert(fscanf(in, "%d\n", &n) == 1);
	Graph my_graph = newGraph(n);
	//make graph stuff
	while(!feof(in)){
		assert(fscanf(in, "%d %d\n", &from, &to) == 2);
		if((from==0) && (to==0)){
		       break;
		}
		addEdge(my_graph, from, to);
	}
	//print to graph
	printGraph(out, my_graph);

	//do the other things
	while(!feof(in)){
		clear(L);
		assert(fscanf(in, "%d %d\n", &from, &to) == 2);
		if((from==0) && (to==0)){
			break;
		}
		fprintf(out, "\n");
		BFS(my_graph,from);
		fprintf(out, "The distance from %d to %d is ",from,to);
		if(getDist(my_graph,to)==INF){
			fprintf(out, "infinity\n");
		}
		else{
			fprintf(out, "%d\n",getDist(my_graph,to));
		}
		//shortest path betweet from and to
		getPath(L, my_graph,to);
		if((length(L)<=1) && (from!=to)){
			fprintf(out, "No %d-%d path exists",from,to);
			fprintf(out, "\n");
		}
		else{
			fprintf(out, "A shortest %d-%d path is: ",from,to);
			printList(out, L);
			fprintf(out, "\n");
		}	
	}
	freeList(&L);
	freeGraph(&my_graph);
	fclose(in);
	fclose(out);
}
