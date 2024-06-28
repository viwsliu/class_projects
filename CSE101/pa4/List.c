/***************************************************************************************** 
 * Vincent Liu 
 * Spring 2023, CSE101-01
 * List.c
 * List ADT
 *******************************************************************************************/


#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "List.h"

struct List {
	Node* front;
	Node* back;
	Node* cursor;
	int index;
	int length;
};

struct Node {
	Node *previous;
	Node *next;
	void* data;
};

List newList(void){
	List mylist = (List) malloc(sizeof(struct List));
	mylist->front = NULL;
	mylist->back = NULL;
	mylist->cursor = NULL;
	mylist->index = -1;
	mylist->length = 0;
	return mylist;
}

void freeList(List* pL){
	if(pL!=NULL && *pL!=NULL){
		int thelength = length(*pL);
		for(int i=0;i<(thelength);i++){
			deleteFront(*pL);
		}
		free(*pL);
		*pL=NULL;
	}
}

// Access functions -----------------------------------------------------------
int length(List L){
	return L->length;
}
int index(List L){
	if((L->index)!=-1){
		return L->index;
	}
	else{
		return -1;
	}
}
void* front(List L){
	if((L->length)<=0){
		fprintf(stderr, "Cannot perform front()! Lenght is less than or equal to zero\n");
		exit(EXIT_FAILURE);
	}
	return L->front->data;
}
void* back(List L){
        if((L->length)<=0){
                fprintf(stderr, "Cannot perform back()! Lenght is less than or equal to zero\n");
                exit(EXIT_FAILURE);
	}
	return L->back->data;
}
void* get(List L){
	if((L->length)<=0){
		fprintf(stderr, "Cannot perform get()! length is <=0!\n");
		exit(EXIT_FAILURE);
	}
	if((L->index)<0){
		fprintf(stderr, "Cannot perform get()! index is <0!\n");
		exit(EXIT_FAILURE);
	}
	return L->cursor->data;
}
// Manipulation procedures ----------------------------------------------------

void clear(List L){
	//if List is null
	//if list is single item
	int thelength = L->length;
	for(int i=0; i<(thelength); i++){
		deleteFront(L);
	}
}
void set(List L, element x){
	if((L->length)<=0){
		fprintf(stderr, "Length is less than zero!\n");
		exit(EXIT_FAILURE);
	}
	if((L->index)<0){
		fprintf(stderr, "Index is less than zero!\n");
		exit(EXIT_FAILURE);
	}
	L->cursor->data = x;
}

void moveFront(List L){
	if((L->length)!=0){
		L->cursor=L->front;
		L->index=0;
	}
}

void moveBack(List L){
        if((L->length)!=0){
                L->cursor=L->back;
                L->index=L->length-1;
        }
}

void movePrev(List L){
	if(L->cursor==NULL){
		fprintf(stderr, "Cannot perform move_prev()! L->cursor is NULL!\n");
		exit(EXIT_FAILURE);
	}
	if((L->cursor)!=NULL){
		if (L->cursor==L->front){
			L->cursor=NULL;
			L->index=-1;
		}
		else{
			L->cursor=L->cursor->previous;
			L->index-=1;
		}
		
	}
}
//move cursor to next node
void moveNext(List L){
        if(L->cursor==NULL){
                fprintf(stderr, "Cannot perform move_next()! L->cursor is NULL!\n");
                exit(EXIT_FAILURE);
        }

	if(L->cursor != NULL){
		if(L->cursor==L->back){
			L->cursor=NULL;
			L->index=-1;
		}else{
			L->cursor=L->cursor->next;
			L->index+=1;
		}
	}
}

//prepends a node with data 'x' to front of List L
void prepend(List L, element x){
	Node *newnode = (Node*) malloc(sizeof(Node));
	if((L->length)!=0){
		newnode->previous = NULL;
		newnode->next = L->front;
		newnode->data = x;
		L->front->previous=newnode;
		L->front=newnode;
		if(L->index!= -1){
			L->index+=1;
		}
		L->length+=1;
	}
	if((L->length)==0){
		newnode->previous=NULL;
		newnode->next=NULL;
		newnode->data=x;
		L->front=newnode;
		L->back=newnode;
		L->length+=1;
	}
}
//appends a node with data 'x' to the back of List L
void append(List L, element x){
        Node *newnode = (Node*) malloc(sizeof(Node));
        if(L==NULL){
		printf("Cannot append to NULL List!\n");
		exit(EXIT_FAILURE);
	}
	if((L->length)!=0){
                newnode->next = NULL;
                newnode->previous = L->back;
                newnode->data = x;
                L->back->next=newnode;
                L->back=newnode;
		L->length+=1;
        }
        if((L->length)==0){
		newnode->previous=NULL;
                newnode->next=NULL;
                newnode->data=x;
                L->front=newnode;
                L->back=newnode;
		L->length+=1;
        }
	
}
void insertBefore(List L, element x){
	if((L->length)<=0){
		fprintf(stderr, "Cannot insert element before cursor! Length is less than or is zero!\n");
		exit(EXIT_FAILURE);
	}
	if((L->index)<0){
		fprintf(stderr, "Cannot insert element before cursor! index is less than zero!\n");
		exit(EXIT_FAILURE);
	}
	Node *newnode = (Node*) malloc(sizeof(Node));
	if(L->cursor==L->front){
                newnode->previous=NULL;
                newnode->next=L->cursor;
                newnode->data=x;
                L->front=newnode;
		L->cursor->previous=newnode;
	}
	else{
		newnode->previous=L->cursor->previous;
		newnode->next=L->cursor;
		newnode->data=x;
		L->cursor->previous->next=newnode;
		L->cursor->previous=newnode;
	}
	L->index+=1;
	L->length+=1;
}
void insertAfter(List L, element x){
        if((L->length)<=0){
                fprintf(stderr, "Cannot insert element after cursor! Length is less than zero!\n");
                exit(EXIT_FAILURE);
        }
        if((L->index)<0){
                fprintf(stderr, "Cannot insert element after cursor! index is less than or equal to zero!\n");
                exit(EXIT_FAILURE);
        }
        Node *newnode = (Node*) malloc(sizeof(Node));
        if(L->cursor->next==NULL){
                newnode->next=NULL;
                newnode->previous=L->cursor;
                newnode->data=x;
                L->back=newnode;
                L->cursor->next=newnode;
	}
        else{
                newnode->next=L->cursor->next;
                newnode->previous=L->cursor;
                newnode->data=x;
		L->cursor->next->previous=newnode;
                L->cursor->next=newnode;
        }
        L->length+=1;
}

void deleteFront(List L){
	if(L==NULL){
		fprintf(stderr, "Calling deleteFront on NULL list!\n");
		exit(EXIT_FAILURE);
	}
	if((L->length)<=0){
		fprintf(stderr, "Cannot delete front because length is less than zero!\n");
		exit(EXIT_FAILURE);
	}
	if((L->length)==1){
		free(L->front);
		L->front=NULL;
		L->back=NULL;
		L->cursor=NULL;
		L->length=0;
		L->index=-1;
	}
	else if((L->front)==(L->cursor)){//if cursor is front, move cursor by one
		L->cursor=NULL;
		L->index=-1;
		L->front=L->front->next;
		free(L->front->previous);
		L->length-=1;
		L->front->previous=NULL;
	//else delete front and set second item to front
	}
	else{
                L->front=L->front->next;
                free(L->front->previous);
                L->length-=1;
                L->front->previous=NULL;
		L->index-=1;
	}	
}
void deleteBack(List L){
        if((L->length)<=0){
                fprintf(stderr, "Cannot delete back because length is less than zero!\n");
                exit(EXIT_FAILURE);
        }
        if((L->length)==1){
                free(L->back);
                L->back=NULL;
                L->front=NULL;
                L->length-=1;
        }
	else if((L->back)==(L->cursor)){//if cursor is front, move cursor by one
                L->cursor=NULL;
                L->index=-1;
                L->back=L->back->previous;
                free(L->back->next);
                L->length-=1;
                L->back->next=NULL;
        //else delete front and set second item to front
	}else{
                L->back=L->back->previous;
                free(L->back->next);
                L->length-=1;
                L->back->next=NULL;

	}
}
void delete(List L){
	if((L->length)<=0){
		fprintf(stderr, "Cannot delete cursor element because there are no elements!\n");
		exit(EXIT_FAILURE);
	}
	if((L->index)<0){
		fprintf(stderr, "Cannot delete cursor element because index is less than zero\n");
		exit(EXIT_FAILURE);
	}
	if(L->cursor==L->back){
		if (L->cursor->previous!=NULL){
			L->cursor->previous->next=NULL;
		}
		L->back=L->cursor->previous;

	}
	if(L->cursor==L->front){
		if(L->cursor->next!=NULL){
                	L->cursor->next->previous=NULL;
		}
		L->front=L->cursor->next;
	}
	else{
		L->cursor->previous->next=L->cursor->next;
		
		if(L->cursor->next!=NULL){
			L->cursor->next->previous=L->cursor->previous;
		}
	}
	free(L->cursor);
	L->length-=1;
	L->cursor=NULL;
	L->index=-1;
	
}
// Other operations -----------------------------------------------------------
/*void printList(FILE* out, List L){
	
	if(L == NULL){
		fprintf(stderr, "Can't print List L; it is NULL!\n");
		exit(EXIT_FAILURE);
	}
	for(Node* current_print = L->front; current_print!=NULL;current_print=current_print->next){
		if(current_print==L->back){
			fprintf(out, "%d", current_print->data);
		}
		else{
			fprintf(out, "%d ", current_print->data);
		}


	}

}
*/
List concatList(List A, List B){
	List newlist= (List) malloc(sizeof(struct List));
	newlist->cursor=NULL;
	newlist->index=-1;
	newlist->length=0;
	Node* current_item=A->front;
	for(int i=0;i<(A->length);i++){
		append(newlist,current_item->data);
		newlist->length=newlist->length+1;
	}
	current_item=B->front;
	for(int j=0;j<(B->length);j++){
		append(newlist,current_item->data);
		newlist->length=newlist->length+1;
	}
	return newlist;
}
