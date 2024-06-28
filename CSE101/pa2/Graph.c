//Vincent Liu
//PA3
//CSE101-01, Spring 2023
//Graph.c

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "Graph.h"

struct GraphObj {
	int edges;
	int vertex;
	int source;
	int* colors; //pointer to array of bools that determine if a vertex has been visited.
	int* distance;
	int* parent;
	List* adjacency;
	
};

/*** Constructors-Destructors ***/
Graph newGraph(int n){
	Graph new_graph = (Graph) malloc(sizeof(struct GraphObj));
	new_graph->edges=0;
	new_graph->vertex=n;
	new_graph->source=0;
	new_graph->colors = (int*) malloc((n+1) * sizeof(int));
	new_graph->parent = (int*) malloc((n+1) * sizeof(int));
	new_graph->distance = (int*) malloc((n+1) * sizeof(int));
	new_graph->adjacency = (List*) malloc((n+1) * sizeof(List));
	for (int i=1;i<n+1;i++){
		new_graph->adjacency[i]=newList();
		new_graph->parent[i]=NIL;
		new_graph->distance[i] = INF;
		
	}
	new_graph->source=NIL;
	return new_graph;
}

void freeGraph(Graph* pG){
	for(int i=1;i<((*pG)->vertex+1);i++){
		freeList(&((*pG)->adjacency[i]));
	}
	free((*pG)->adjacency);
	free((*pG)->parent);
	free((*pG)->colors);
	free((*pG)->distance);
	free((*pG));
	*pG=NULL;
}

/*** Access functions ***/
int getOrder(Graph G){
	return G->vertex;	
}
int getSize(Graph G){
	return G->edges;
}

int getSource(Graph G){
	return G->source;
}

int getParent(Graph G, int u){
	if(!((1<=u)&&(u<=getOrder(G)))){
		fprintf(stderr, "Failed Precondition for getParent!\n");
		exit(EXIT_FAILURE);
	}
	return G->parent[u];
	
}

int getDist(Graph G, int u){
	if(!((1<=u)||!(u<=getOrder(G)))){
		fprintf(stderr, "Failed Precondition for getDist!\n");
		exit(EXIT_FAILURE);
	}
	return G->distance[u];
}

void getPath(List L, Graph G, int u){
	if(u == NIL){
		assert(false);
	}

	if((getParent(G, u) == NIL) && (u != getSource(G))){
			append(L, NIL);
			return;
		}

	if(u!=(getSource(G))){
		

		getPath(L, G, getParent(G, u));
	}

	append(L,u);
}
/*** Manipulation procedures ***/
void makeNull(Graph G){ //clears all adjacency, set edges to NULL
	for(int i=1;i<((G)->vertex+1);i++){
		clear((G)->adjacency[i]);
	}
}
void addEdge(Graph G, int u, int v){
	if(!(1<=u)||!(u<=getOrder(G))){
		fprintf(stderr, "Failed Precondition 1 for addEdge!\n");
		exit(EXIT_FAILURE);
	}
	if(!(1<=v)||!(v<=getOrder(G))){
		fprintf(stderr, "Failed Precondition 2 for addEdge!\n");
		exit(EXIT_FAILURE);
	}
	addArc(G, u, v);
	addArc(G, v, u);
	G->edges-=1;
}
void addArc(Graph G, int u, int v){ //adds an edge that is only one way	
        if(!(1<=u)||!(u<=getOrder(G))){
                fprintf(stderr, "Failed Precondition 1 for addArc!\n");
                exit(EXIT_FAILURE);
        }
        if(!(1<=v)||!(v<=getOrder(G))){
                fprintf(stderr, "Failed Precondition 2 for addArc!\n");
                exit(EXIT_FAILURE);
        }

	moveBack(G->adjacency[u]);
	while((index(G->adjacency[u]) != -1)){
		if(v > get(G->adjacency[u])) {
			break;
		}
		movePrev(G->adjacency[u]);
	}
	if(index(G->adjacency[u]) == -1) {
		prepend(G->adjacency[u],v);
	}
	else{
		insertAfter(G->adjacency[u],v);
	}
	G->edges++;
}
void BFS(Graph G, int s){//search
	int x;
	G->source=s;
	for(int x=1;x<(G->vertex+1);x++){
		G->colors[x] = white;
		G->distance[x] = INF;
		G->parent[x] = NIL; 
	}
	G->colors[s] = gray;       // discover the source s
	G->distance[s] = 0;
	G->parent[s] = NIL; 
	List Q = newList();    // construct a new empty queue
	append(Q,s);

	while(length(Q)!=0){
		moveFront(Q);
		x = get(Q);
		deleteFront(Q);
		for(moveFront(G->adjacency[x]);index(G->adjacency[x])!=(-1);moveNext(G->adjacency[x])){
			int y = get(G->adjacency[x]);
			if (G->colors[y] == white){         // y is undiscovered
				G->colors[y] = gray;         // discover y
				G->distance[y] = G->distance[x]+1;
				G->parent[y] = x;
				append(Q,y);
			}
		}                  
		G->colors[x] = black;                  // finish x
	}
	freeList(&Q);
}
/*** Other operations ***/
void printGraph(FILE* out, Graph G){
	for(int i=1;i<(G->vertex+1);i++){
		fprintf(out, "%d: ", i);
		printList(out, G->adjacency[i]);
		fprintf(out, "\n");
	}
}
