//PA3
//Vincent Liu
//viwliu
//195968
//CSE101-01 Spring 2023

#include <stdlib.h>
#include <stdio.h>
#include "List.h"

#define UNDEF -100
#define NIL 0 
#define INF -3
#define white 100
#define	gray 200
#define black 300

typedef struct GraphObj* Graph;

/*** Constructors-Destructors ***/
Graph newGraph(int n);
void freeGraph(Graph* pG);
/*** Access functions ***/
int getOrder(Graph G);
int getSize(Graph G);
int getParent(Graph G, int u);
int getDiscover(Graph G, int u);
int getFinish(Graph G, int u);
/*** Manipulation procedures ***/
void addEdge(Graph G, int u, int v);
void addArc(Graph G, int u, int v);
void DFS(Graph G, List S);
/*** Other operations ***/
Graph transpose(Graph G);
Graph copyGraph(Graph G);
void printGraph(FILE* out, Graph G);
