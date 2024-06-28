//Vincent Liu
//viwliu
//1915968
//CSE101-01 Spring 2023
//
//List.cpp



#include <iostream>
#include <string>
#include <cassert>
#include <stdexcept>
#include <cstdio>
#include "List.h"


List::Node::Node(ListElement X){
	this->data = X;
	this->next = nullptr;
	this->prev = nullptr;
}

List::List(){//Creates a new List in empty state
	this->frontDummy = new Node(-100);
	this->backDummy = new Node(-200);

	this->frontDummy->next = this->backDummy;
	this->frontDummy->prev = nullptr;

	this->backDummy->prev = this->frontDummy;
	this->backDummy->next = nullptr;

	this->beforeCursor = this->frontDummy;
	this->afterCursor = this->backDummy;

	this->pos_cursor = 0;
	this->num_elements = 0;
}

List::List(const List& L){//copy list
	this->frontDummy = new Node(-300);
	this->backDummy = new Node(-400);
	this->frontDummy->next = this->backDummy;
	this->frontDummy->prev = nullptr;

	this->backDummy->prev = this->frontDummy;
	this->backDummy->next = nullptr;

	this->beforeCursor = this->frontDummy;
	this->afterCursor = this->backDummy;

	this->pos_cursor = 0;
	this->num_elements = 0;
	Node* my_cursor = L.frontDummy->next;
	int the_length = L.length();
	for(int i=0; i < the_length; i++){
		assert(this->position() == i);
		assert(this->afterCursor = this->backDummy);
		this->insertBefore(my_cursor->data);
		my_cursor = my_cursor->next;
	}
}

List::~List(){//destructor
	this->clear();
	delete this->frontDummy;
	delete this->backDummy;
}

int List::length() const{
	return this->num_elements;
}

ListElement List::front() const{
	if ((this->length())== 0){
		throw std::length_error("List: front(): emptyList");
	}
	return this->frontDummy->next->data;
}

ListElement List::back() const{
	if ((this->length())== 0){
		throw std::length_error("List: back(): emptyList");
	}
	return this->backDummy->prev->data;
}

int List::position() const{
	if((this->pos_cursor)<0){
		throw std::length_error("List: position(): error1");
	}
	if((this->pos_cursor)>(this->length())){
		throw std::length_error("List: position(): error2");
	}
	return this->pos_cursor;
}

ListElement List::peekNext() const{
	if((pos_cursor)>(this->length())){
		throw std::range_error("List: peekNext(): cursor at back");
	}
	return afterCursor->data;

}

ListElement List::peekPrev() const{
	if((pos_cursor)>(this->length())){
		throw std::range_error("List: peekPrev(): cursor at front");
	}
	return beforeCursor->data;
}

//Manipulation Procedures
void List::clear(){
	this->moveFront();
	int temp_length = this->length();
	for(int i=0;i<temp_length;i++){
		this->eraseAfter();	
	}
}

void List::moveFront(){
	int temp_pos = this->position();
	for(int i=0;i<temp_pos;i++){
		this->movePrev();
	}
	assert(this->position() == 0);
	assert(this->beforeCursor = this->frontDummy);
	assert(this->beforeCursor->next = this->afterCursor);
	assert(this->afterCursor->prev = this->beforeCursor);
}

void List::moveBack(){
	int temp_pos = this->position();
	for(int i=0;i < num_elements - temp_pos;i++){
		this->moveNext();
	}
	assert(this->position() == this->length());
}

ListElement List::moveNext(){
	if(this->afterCursor==this->backDummy){
		throw std::range_error("List: moveNext(): cursor at back");
	}
	this->afterCursor=this->afterCursor->next;
	this->beforeCursor=this->beforeCursor->next;
	this->pos_cursor = this->pos_cursor+1;
	return beforeCursor->data;
}

ListElement List:: movePrev(){
	assert(this->beforeCursor->next = this->afterCursor);
	assert(this->afterCursor->prev = this->beforeCursor);
	if(this->beforeCursor==this->frontDummy){
		throw std::range_error("List: movePrev(): cursor at front");
	}
	this->afterCursor=this->afterCursor->prev;
	this->beforeCursor=this->beforeCursor->prev;
	this->pos_cursor = this->pos_cursor-1;
	return afterCursor->data;
}

void List::insertAfter(ListElement x){
	Node* new_node=new Node(x);
	this->afterCursor->prev = new_node;
	this->beforeCursor->next = new_node;
	new_node->prev = this->beforeCursor;
	new_node->next = this->afterCursor;
	this->afterCursor = new_node;
	this->num_elements=this->num_elements+1;
}
void List::insertBefore(ListElement x){
	Node* new_node=new Node(x);
	this->afterCursor->prev = new_node;
	this->beforeCursor->next = new_node;
	new_node->prev = this->beforeCursor;
	new_node->next = this->afterCursor;
	this->beforeCursor = new_node;
	this->num_elements=this->num_elements+1;
	this->pos_cursor = this->pos_cursor + 1;
}

void List::setAfter(ListElement x){
	if((this->pos_cursor)>=(this->length())){
		throw std::range_error("List: setAfter(): cursor at back");
	}
	if((this->pos_cursor)!=(this->length())){
		this->afterCursor->data=x;
	}
}

void List::setBefore(ListElement x){
	if((this->pos_cursor)<= 0){
		throw std::range_error("List: setBefore(): cursor at front");
	}
	if((this->pos_cursor)!=(this->length())){
		this->beforeCursor->data=x;
	}
}

void List::eraseAfter(){
	if((this->pos_cursor)>=(this->length())){
		throw std::range_error("List: eraseAfter(): cursor at back");
	}
	this->beforeCursor->next = this->afterCursor->next;
	this->afterCursor->next->prev = this->beforeCursor;
	delete this->afterCursor;
	this->num_elements = this->num_elements - 1;
	this->afterCursor = this->beforeCursor->next;
}

void List::eraseBefore(){
	if((this->pos_cursor)<=0){
		throw std::range_error("List: eraseBefore(): cursor at front");
	}
	this->afterCursor->prev = this->beforeCursor->prev;
	this->beforeCursor->prev->next=this->afterCursor;
	delete this->beforeCursor;
	this->beforeCursor = this->afterCursor->prev;
	this->num_elements = this->num_elements - 1;
	this->pos_cursor = this->pos_cursor-1;
}

//Other functions
int List::findNext(ListElement x){
	while((this->pos_cursor)!=(this->length())){
		if((this->afterCursor->data) == x){
			this->moveNext();
			return this->pos_cursor;
		}
		this->moveNext();
	}
	return -1;
}

int List::findPrev(ListElement x){
	while((this->pos_cursor)!=0){
		if((this->beforeCursor->data) == x){
			this->movePrev();
			return this->pos_cursor;
		}
		this->movePrev();
	}
	return -1;
}

void List::cleanup(){
	int start_pos = 0;
	Node* start = this->frontDummy->next;
	while((start) != (this->backDummy)){
		Node* current = start->next;
		int curr_pos = start_pos + 1;
		while((current) != (this->backDummy)){
			if(current->data == start->data){
				Node* tmp_next = current->next;
				current->prev->next = current->next;
				current->next->prev = current->prev;
				if(curr_pos == this->pos_cursor-1){
					assert(current == this->beforeCursor);
					this->beforeCursor = beforeCursor->prev;
				}
				if(curr_pos == this->pos_cursor){
					assert(current == this->afterCursor);
					this->afterCursor = afterCursor->next;
				}
				if(curr_pos < this->pos_cursor){
					this->pos_cursor -= 1;
				}

				delete current;

				current = tmp_next;
				this->num_elements = this->num_elements - 1;
			}else{
				current = current->next;
				curr_pos += 1;
			}
		}
		start=start->next;
		start_pos += 1;
	}
}

List List::concat(const List& L) const{
	List temp = List();
	Node* curr_item = this->frontDummy->next;
	for(int i=0;i<(this->length());i++){
		temp.insertBefore(curr_item->data);
		curr_item = curr_item->next;
	}
	curr_item = L.frontDummy->next;
	for(int j=0;j<(L.num_elements);j++){
		temp.insertBefore(curr_item->data);
		curr_item = curr_item->next;
	}
	temp.moveFront();
	return temp;
}

std::string List::to_string() const{
	std::string output = "(";
	int temp;
	List a_copy(*this);
	a_copy.moveFront();
	std::string tempstring;
	int end = a_copy.num_elements;
	for(int i=0; i<a_copy.num_elements;i++){
		temp = a_copy.peekNext();
		tempstring = std::to_string(temp);
		output += tempstring;
		if(end != i+1){
			output += ", ";
		}
		a_copy.moveNext();
	}
	output += ")";
	return output;
}

bool List::equals(const List& R) const{
	if((this->length())!=(R.length())){
		return false;
	}
	List one_curr(*this);
	List two_curr(R);
	one_curr.moveFront();
	two_curr.moveFront();
	for(int i=0;i<(R.length());i++){
		if ((one_curr.afterCursor->data) != (two_curr.afterCursor->data)){
			return false;
		}
		one_curr.moveNext();
		two_curr.moveNext();
	}
	return true;
}


//Overriden Operators
std::ostream& operator<<( std::ostream& stream, const List& L ){
	stream<<L.to_string();
	return stream;
}

// operator==()
// Returns true if and only if A is the same integer sequence as B. The 
// cursors in both Lists are unchanged.
bool operator==( const List& A, const List& B ){
	return A.equals(B);
}
// operator=()
// Overwrites the state of this List with state of L.
List& List::operator=( const List& L ){
	clear();
	Node* myL = L.backDummy;
	for(int i =0 ; i<L.length();i++){
		Node * prev= myL->prev;
		insertAfter(prev->data);
		myL = prev;
	}
	return *this;

}

