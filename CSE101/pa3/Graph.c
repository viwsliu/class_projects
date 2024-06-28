//PA3
//Vincent Liu
//viwliu
//195968
//CSE101-01 Spring 2023

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "Graph.h"

struct GraphObj {
	int edges;
	int vertex;
	int source;
	int* colors; //pointer to array of bools that determine if a vertex has been visited.
	int* parent;
	int* discover_time;
	int* finish_time;
	List* adjacency;
	
};

/*** Constructors-Destructors ***/
Graph newGraph(int n){
	Graph new_graph = (Graph) malloc(sizeof(struct GraphObj));
	new_graph->edges=0;
	new_graph->vertex=n;
	new_graph->source=0;
	new_graph->discover_time = (int*) malloc((n+1) * sizeof(int));
	new_graph->finish_time = (int*) malloc((n+1) * sizeof(int));
	new_graph->colors = (int*) malloc((n+1) * sizeof(int));
	new_graph->parent = (int*) malloc((n+1) * sizeof(int));
	new_graph->adjacency = (List*) malloc((n+1) * sizeof(List));
	for (int i=1;i<n+1;i++){
		new_graph->adjacency[i]=newList();
		new_graph->parent[i]=NIL;
		new_graph->discover_time[i] = UNDEF;
		new_graph->finish_time[i] = UNDEF;
	}
	new_graph->source=NIL;
	return new_graph;
}

void freeGraph(Graph* pG){
	free((*pG)->discover_time);
	free((*pG)->finish_time);
	for(int i=1;i<((*pG)->vertex+1);i++){
		freeList(&((*pG)->adjacency[i]));
	}
	free((*pG)->adjacency);
	free((*pG)->parent);
	free((*pG)->colors);
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

int getParent(Graph G, int u){
	if(!((1<=u)&&(u<=getOrder(G)))){
                fprintf(stderr, "Failed Precondition for getParent!\n");
                exit(EXIT_FAILURE);
        }
	return G->parent[u];
}

int getDiscover(Graph G, int u){ //getDiscover(), and getFinish() return the appropriate field values for the given vertex.
	if(!((1<=u)||!(u<=getOrder(G)))){
                fprintf(stderr, "Failed Precondition for getDiscover!\n");
                exit(EXIT_FAILURE);
	}

	return G->discover_time[u];
}

int getFinish(Graph G, int u){
        if(!((1<=u)||!(u<=getOrder(G)))){
                fprintf(stderr, "Failed Precondition for getFinish!\n");
                exit(EXIT_FAILURE);
        }
	return G->finish_time[u];
}
/*** Manipulation procedures ***/
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
        bool exists = false;
	if(!(1<=u)||!(u<=getOrder(G))){
                fprintf(stderr, "Failed Precondition 1 for addArc!\n");
                exit(EXIT_FAILURE);
        }
        if(!(1<=v)||!(v<=getOrder(G))){
                fprintf(stderr, "Failed Precondition 2 for addArc!\n");
                exit(EXIT_FAILURE);
        }
	moveFront(G->adjacency[u]);
	for(int i=0;i<(length(G->adjacency[u]));i++){
		if(get(G->adjacency[u]) == v){
			exists = true;
			break;
		}
		moveNext(G->adjacency[u]);
	}
	if(exists == false){
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
}


/***Visit(x)***/
int Visit(Graph G, int x, int start_time, List S){
	G->discover_time[x] = start_time;
	G->colors[x]=gray;
	moveFront(G->adjacency[x]);
	int current_time = start_time;
	while(index(G->adjacency[x])!=-1){
		int i = get(G->adjacency[x]);
		if(G->colors[i]==white){
			G->parent[i]=x;
			current_time++;
			current_time = Visit(G, i, current_time, S);
		}
		moveNext(G->adjacency[x]);
	}
	G->colors[x] = black;
	current_time++;

	G->finish_time[x]=current_time;
	prepend(S, x);
	return current_time;
}



//DFS
void DFS(Graph G, List S){//search
	List copy_S = copyList(S);
	clear(S);
	//printf("size of copy_S; %d\n", length(copy_S));
	//printf("Getorder(G) = %d\n", getOrder(G));

	if(length(copy_S)!=getOrder(G)){
		fprintf(stderr, "Failed Precondition for DFS()!\n");
		exit(EXIT_FAILURE);
	}
	for(int x = 1; x<=(G->vertex);x++){
		G->colors[x] = white;
		G->parent[x] = NIL;
		G->discover_time[x] = UNDEF;
		G->finish_time[x] = UNDEF;
	}
	int current_time = 1;
	moveFront(copy_S);
	while(index(copy_S)!=-1){
		int x = get(copy_S);
		if(G->colors[x] == white){
			current_time = Visit(G,x,current_time, S);
			current_time++;
		}
		moveNext(copy_S);
	}
	freeList(&copy_S);
}


/*** Other operations ***/
Graph transpose(Graph G){
	Graph temp_Graph = newGraph(G->vertex);
	for(int i=1;i<=(G->vertex);i++){
		moveFront(G->adjacency[i]);
		while((index(G->adjacency[i])!=-1)){
			addArc(temp_Graph, get(G->adjacency[i]), i);
			moveNext(G->adjacency[i]);
		}
	}
	return temp_Graph;
}

Graph copyGraph(Graph G){
	Graph temp_Graph = newGraph(G->vertex);
	for(int i=1;i<=(G->vertex);i++){
		moveFront(G->adjacency[i]);
		while((index(G->adjacency[i])!=-1)){
			addArc(temp_Graph, i, get(G->adjacency[i]));
			moveNext(G->adjacency[i]);
		}
	}
	return temp_Graph;
}
void printGraph(FILE* out, Graph G){
	for(int i=1;i<(G->vertex+1);i++){
		fprintf(out, "%d: ", i);
		printList(out, G->adjacency[i]);
		fprintf(out, "\n");
	}
}
