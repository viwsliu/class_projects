//Vincent Liu
//viwliu@ucsc.edu
//#1915968
//PA3
//CSE101-01, Spring 2023
//FindComponent.c


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
	int components = 0;
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
	//graph stuff
	for(int i=1;i<=n;i++){
		append(L, i);
	}
	while(!feof(in)){
		assert(fscanf(in, "%d %d\n", &from, &to) == 2);
		if((from == 0) && (to == 0)){
			break;
		}
		//fprintf(stdout, "from: %d, to: %d, n:%d\n",from, to, n);
		addArc(my_graph, from, to);
	}
	fprintf(out, "Adjacency list representation of G:\n");
	printGraph(out, my_graph);
	fprintf(out, "\n");

	//DFS
	DFS(my_graph,L);
	Graph transpose_graph = transpose(my_graph);
	DFS(transpose_graph, L);
	for(int i=1;i<=n;i++){
		if(getParent(transpose_graph,i)==NIL){
			components+=1;
		}
	}

	List* component_lists = (List*) malloc(components*sizeof(List));

	moveFront(L);
	for(int i = 0; i < components; i++){
		component_lists[i] = newList();
		assert(getParent(transpose_graph, get(L)) == NIL);
		append(component_lists[i], get(L));
		moveNext(L);
		while((index(L) != -1) && (getParent(transpose_graph, get(L)) != NIL)){
			append(component_lists[i], get(L));
			moveNext(L);

		}
	}
	fprintf(out,"G contains %d strongly connected components:\n",components);
	for(int i = 0; i < components; i++){
		fprintf(out, "Component %d: ", i+1);
		printList(out, component_lists[components-1-i]);
		fprintf(out, "\n");
	}

	for(int j=0; j<components;j++){	
		freeList(&(component_lists[j]));
	}
	freeList(&L);
	freeGraph(&my_graph);
	freeGraph(&transpose_graph);
	free(component_lists);
	fclose(in);
	fclose(out);
}
