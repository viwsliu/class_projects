//Vincent Liu
//viwliu #1915968
//CSE101-01 Spring 23

#include<iostream>
#include<string>
#include <cassert>
#include "Dictionary.h"

// Class Constructors & Destructors ----------------------------------------

#define RED 0
#define BLACK 1

// Creates new Dictionary in the empty state. 
Dictionary::Dictionary(){
	this->num_pairs = 0;
	this->nil = new Node("bruh asdfasdfdas", 2);
	this->root = nil;
	this->current = nil;
}

// Copy constructor.
Dictionary::Dictionary(const Dictionary& D){
	this->num_pairs = 0;
	this->nil = new Node("bruh awefwefwefewfewfw", 2);
	this->root = nil;
	this->current = nil;
	this->preOrderCopy(D.root, root, D.nil);
}	

//Node Constructor
Dictionary::Node::Node(keyType k, valType v){
	this->key = k;
	this->val = v;
	this->parent = nullptr;
	this->left = nullptr;
	this->right = nullptr;
	this->color = BLACK;
}

// Destructor
Dictionary::~Dictionary(){
	this->clear();
	delete this->nil;
}

// Helper Functions (Optional) ---------------------------------------------
//
// inOrderString()
// Appends a string representation of the tree rooted at R to string s. The
// string appended consists of: "key : value \n" for each key-value pair in
// tree R, arranged in order by keys.
void Dictionary::inOrderString(std::string& s, Node* R) const{
	if(R == nil){
		return;
	}
	inOrderString(s, R->left);
	s += R->key + " : " +  std::to_string(R->val) + "\n";
	inOrderString(s, R->right);
}
	
// preOrderString()
// Appends a string representation of the tree rooted at R to s. The appended
// string consists of keys only, separated by "\n", with the order determined
// by a pre-order tree walk.
void Dictionary::preOrderString(std::string& s, Node* R) const{
	s += R->key;
	if(R->color == RED){
		s+= " (RED)";
	}
	s+= "\n";

	
	if(R->left != nil){
		this->preOrderString(s, R->left);
	}
	if(R->right != nil){
		this->preOrderString(s, R->right);
	}
}

// preOrderCopy()
// Recursively inserts a deep copy of the subtree rooted at R into this 
// Dictionary. Recursion terminates at N.
void Dictionary::preOrderCopy(Node* R, Node* at, Node* N){
	if(R==N){
		return;
	}
	if(at == nil){
		root = new Node(R->key, R->val);
		root->parent = nil;
		root->left = nil;
		root->right = nil;
		at = root;
		num_pairs ++;
	}

	if(R->left != N){
		num_pairs++;
		at->left = new Node(R->left->key, R->left->val);
		at->left->right = nil;
		at->left->left = nil;
		at->left->parent = at;
		this->preOrderCopy(R->left, at->left, N);
	}
	if(R->right != N){
		num_pairs++;
		at->right = new Node(R->right->key, R->right->val);
		at->right->right = nil;
		at->right->left = nil;
		at->right->parent = at;

		this->preOrderCopy(R->right, at->right, N);
	}
}


// postOrderDelete()
// Deletes all Nodes in the subtree rooted at R.
void Dictionary::postOrderDelete(Node* R){
	if(R == nil){
		return;
	}
	if(R==this->root){
		this->root = nil;
	}
	if(R->left != nil){
		this->postOrderDelete(R->left);
	}
	if(R->right != nil){
		this->postOrderDelete(R->right);
	}
	delete R;
	num_pairs--;
}

// search()
// Searches the subtree rooted at R for a Node with key==k. Returns
// the address of the Node if it exists, returns nil otherwise.
Dictionary::Node* Dictionary::search(Node* R, keyType k) const{
	if(R == nil){
		return nil;
	}
	if(k==R->key){
		return R;
	}
	if(k<R->key){
		return search(R->left, k);
	}
	if(k>R->key){
		return search(R->right, k);
	}
	assert(false);
}

// findMin()
// If the subtree rooted at R is not empty, returns a pointer to the 
// leftmost Node in that subtree, otherwise returns nil.
Dictionary::Node* Dictionary::findMin(Node* R){
	if(R->left == nil){
		return R;
	}
	return findMin(R->left);
}

// findMax()
// If the subtree rooted at R is not empty, returns a pointer to the 
// rightmost Node in that subtree, otherwise returns nil.
Dictionary::Node* Dictionary::findMax(Node* R){
	if(R->right == nil){
		return R;
	}
	return findMax(R->right);
}

// findNext()
// If N does not point to the rightmost Node, returns a pointer to the
// Node after N in an in-order tree walk.  If N points to the rightmost 
// Node, or is nil, returns nil. 
Dictionary::Node* Dictionary::findNext(Node* N){
	if(this->hasCurrent() == false){
		throw std::logic_error("Dictionary: findNext(): current undefined");
	}else if(N->right != nil){
		return findMin((current->right));
	}else if(N->parent == nil){
		return nil;
	}else if(N == N->parent->left){
		return N->parent;
	}else if(current == current->parent->right){
		Node *curr = current;
		while(curr->parent != nil){
			if(curr->parent->left == curr){
				return curr->parent;
			}
			curr = curr->parent;
		}
		if(curr->parent == nil){
			return nil;
		}
	}
	assert(false);
}	

// findPrev()
// If N does not point to the leftmost Node, returns a pointer to the
// Node before N in an in-order tree walk.  If N points to the leftmost 
// Node, or is nil, returns nil.
Dictionary::Node* Dictionary::findPrev(Node* N){
	if(this->hasCurrent() == false){
		throw std::logic_error("findPrev(): Current undefined!\n");
	}else if(N->left != nil){
		return findMax((current->left));
	}else if(N->parent == nil){
		return nil;
	}else if(N == N->parent->right){
		return N->parent;
	}else if(current == current->parent->left){
		Node *curr = current;
		while(curr->parent != nil){
			if(curr->parent->right == curr){
				return curr->parent;
			}
			curr = curr->parent;
		}
		if(curr->parent == nil){
			return nil;
		}
	}
	assert(false);
}	
//RBT Helper Functions (Optional)

//LeftRotate()
void Dictionary::LeftRotate(Node* x){
	Node* y = x->right;
	x->right = y->left;
	if (y->left != nil){
		y->left->parent = x;
	}
	y->parent = x->parent;
	if (x->parent == nil){
		this->root = y;
	}
	else if (x == x->parent->left){
		x->parent->left = y;
	}
	else{
		x->parent->right = y;
	}
	y->left = x;
	x->parent = y;
}

//RightRotate()
void Dictionary::RightRotate(Node* x){
	Node* y = x->left;
	x->left = y->right;
	if (y->right != nil){ 
		y->right->parent = x;
	}
	y->parent = x->parent;
	if (x->parent == nil){
		this->root = y;
	}
	else if (x == x->parent->right){
		x->parent->right = y;
	}
	else {
		x->parent->left = y;
	}
	y->right = x;
	x->parent = y;
}

//RB_Insert()
void Dictionary::RB_Insert(Node* z){
	Node* y = nil;
	Node* x = this->root;
	while (x != nil){
		y = x;
		if (z->key < x->key){
			x = x->left;
		}
		else{ 
			x = x->right;
		}
	}
	z->parent = y;
	if (y == nil){
		this->root = z;
	}
	else if (z->key < y->key){
		y->left = z;
	}
	else{ 
		y->right = z;
	}
	z->left = nil;
	z->right = nil;
	z->color = RED;
	this->RB_InsertFixUp(z);
}

//RB_InsertFixUP()
void Dictionary::RB_InsertFixUp(Node* z){
	while (z->parent->color == RED){
		if (z->parent == z->parent->parent->left){
			Node* y = z->parent->parent->right;
			if (y->color == RED){
				z->parent->color = BLACK;              // case 1
				y->color = BLACK;                     // case 1
				z->parent->parent->color = RED;         // case 1
				z = z->parent->parent;                 // case 1
			}
			else{ 
				if (z == z->parent->right){
					z = z->parent;                     // case 2
					this->LeftRotate(z);                 // case 2
				}
				z->parent->color = BLACK;              // case 3
				z->parent->parent->color = RED;         // case 3
				this->RightRotate(z->parent->parent);     // case 3
			}
		}
		else{ 
			Node* y = z->parent->parent->left;
			if (y->color == RED){
				z->parent->color = BLACK;              // case 4
				y->color = BLACK;                     // case 4
				z->parent->parent->color = RED;         // case 4
				z = z->parent->parent;                 // case 4
			}
			else{ 
				if (z == z->parent->left){
					z = z->parent;                     // case 5
					this->RightRotate(z);                // case 5
				}
				z->parent->color = BLACK;              // case 6
				z->parent->parent->color = RED;         // case 6
				this->LeftRotate(z->parent->parent);      // case 6
			}
		}
	}
	this->root->color = BLACK;
}
//RB_Transplant()
void Dictionary::RB_Transplant(Node* u, Node* v){
	if (u->parent == nil){
		this->root = v;
	}
	else if (u == u->parent->left){
		u->parent->left = v;
	}
	else{ 
		u->parent->right = v;
	}
	v->parent = u->parent;
}
//RB_DeleteFixUP()
void Dictionary::RB_DeleteFixUp(Node *x){
	while ((x != this->root) && (x->color == BLACK)){
		if (x == x->parent->left){
			Node* w = x->parent->right;
			if (w->color == RED){
				w->color = BLACK;                // case 1
				x->parent->color = RED;                   // case 1
				this->LeftRotate(x->parent);                // case 1
				w = x->parent->right;                     // case 1
			}
			if ((w->left->color == BLACK) && (w->right->color == BLACK)){
				w->color = RED;                          // case 2
				x = x->parent;                           // case 2
			}
			else{ 
				if (w->right->color == BLACK){
					w->left->color = BLACK;                // case 3
					w->color = RED;                       // case 3
					this->RightRotate(w);                   // case 3
					w = x->parent->right;                  // case 3
				}
				w->color = x->parent->color;               // case 4
				x->parent->color = BLACK;                 // case 4
				w->right->color = BLACK;                  // case 4
				this->LeftRotate(x->parent);                // case 4
				x = this->root;                             // case 4
			}
		}
		else{ 
			Node* w = x->parent->left;
			if (w->color == RED){
				w->color = BLACK;                        // case 5
				x->parent->color = RED;                   // case 5
				this->RightRotate(x->parent);               // case 5
				w = x->parent->left;                      // case 5
			}
			if ((w->right->color == BLACK) && (w->left->color == BLACK)){
				w->color = RED;                          // case 6
				x = x->parent;                           // case 6
			}
			else{ 
				if(w->left->color == BLACK){
					w->right->color = BLACK;               // case 7
					w->color = RED;                       // case 7
					this->LeftRotate(w);                    // case 7
					w = x->parent->left;                   // case 7
				}
				w->color = x->parent->color;               // case 8
				x->parent->color = BLACK;                 // case 8
				w->left->color = BLACK;                   // case 8
				this->RightRotate(x->parent);               // case 8
				x = this->root;                             // case 8
			}
		}
	}
	x->color = BLACK;
}
//RB_Delete()
void Dictionary::RB_Delete(Node* z){
	Node* y = z;
	int y_original_color = y->color;
	Node* x;
	if (z->left == nil){
		x = z->right;
		this->RB_Transplant(z, z->right);
	}
	else if (z->right == nil){
		x = z->left;
		this->RB_Transplant(z, z->left);
	}
	else{ 
		y = this->TreeMinimum(z->right);
		y_original_color = y->color;
		x = y->right;
		if (y->parent == z){
			x->parent = y;
		}
		else {
			this->RB_Transplant(y, y->right);
			y->right = z->right;
			y->right->parent = y;
		}
		this->RB_Transplant(z, y);
		y->left = z->left;
		y->left->parent = y;
		y->color = z->color;
	}
	if (y_original_color == BLACK){
		this->RB_DeleteFixUp(x);
	}
}

Dictionary::Node* Dictionary::TreeMinimum(Node* x){ // Pre: x != NIL
	while (x->left != nil){
		x = x->left;
	}
	return x;
}

// Access functions --------------------------------------------------------

// size()
// Returns the size of this Dictionary.
int Dictionary::size() const{
	return this->num_pairs;
}

// contains()
// Returns true if there exists a pair such that key==k, and returns false
// otherwise.
bool Dictionary::contains(keyType k) const{
	return search(root, k) != nil;
}

// getValue()
// Returns a reference to the value corresponding to key k.
// Pre: contains(k)
valType& Dictionary::getValue(keyType k) const{
	if((this->contains(k))==false){
		throw std::logic_error("Dictionary: getValue(): key \"blah\" does not exist");
	}
	Node* temp = search(this->root,k);
	return temp->val;
}


// hasCurrent()
// Returns true if the current iterator is defined, and returns false 
// otherwise.
bool Dictionary::hasCurrent() const{
	if(this->current != this->nil){
		return true;
	}
	else{
		return false;
	}
}

// currentKey()
// Returns the current key.
// Pre: hasCurrent() 
keyType Dictionary::currentKey() const{
	if(this->hasCurrent() == true){	
		return this->current->key;
	}
	throw std::logic_error("Dictionary: currentKey(): current undefined");
}

// currentVal()
// Returns a reference to the current value.
// Pre: hasCurrent()
valType& Dictionary::currentVal() const{
	if(this->hasCurrent() == true){
		return this->current->val;
	}
	else{
		throw std::logic_error("Dictionary: currentVal(): current undefined");
	}
}

// Manipulation procedures -------------------------------------------------

// clear()
// Resets this Dictionary to the empty state, containing no pairs.
void Dictionary::clear(){
	Node* temp = this->root;
	postOrderDelete(temp);
	this->current = nil;
	this->root = nil;
	this->num_pairs = 0;
}	

// setValue()
// If a pair with key==k exists, overwrites the corresponding value with v, 
// otherwise inserts the new pair (k, v).
void Dictionary::setValue(keyType k, valType v){
	Node* temp = search(this->root, k);
	if(temp != nil){
		temp->val = v;
	}
	if(temp == nil){
		if(root == nil){
			root = new Node(k, v);
			root->parent = nil;
			root->left = nil;
			root->right = nil;
		}else{
			Node* temp2 = new Node(k, v);
			temp2->parent = nil;
			temp2->left = nil;
			temp2->right = nil;
			this->RB_Insert(temp2);
		}
		this->num_pairs++;
	}
}

// remove()
// Deletes the pair for which key==k. If that pair is current, then current
// becomes undefined.
// Pre: contains(k).
void Dictionary::remove(keyType k){
	Node* var = search(this->root, k);
	if(this->contains(k) == false){
		throw std::logic_error("Dictionary: remove(): key \"blah\" does not exist");
	}
	if(current != nil){
		if(current->key == k){	
			current = nil;
		}
	}
	this->RB_Delete(var);
	delete var;
	this->num_pairs-=1;
}

// begin()
// If non-empty, places current iterator at the first (key, value) pair
// (as defined by the order operator < on keys), otherwise does nothing. 
void Dictionary::begin(){
	if(this->num_pairs != 0){
		this->current = this->root;
		while(this->current->left != nil){
			this->current = this->current->left;
		}
	}
}

// end()
// If non-empty, places current iterator at the last (key, value) pair
// (as defined by the order operator < on keys), otherwise does nothing. 
void Dictionary::end(){
	if(this->num_pairs != 0){
		this->current = this->root;
		while(this->current->right != nil){
			this->current = this->current->right;
		}
	}
}

// next()
// If the current iterator is not at the last pair, advances current 
// to the next pair (as defined by the order operator < on keys). If 
// the current iterator is at the last pair, makes current undefined.
// Pre: hasCurrent()
void Dictionary::next(){
	if(this->hasCurrent()==true){
		this->current = findNext(this->current);
	}
	else{
		throw std::logic_error("Dictionary: next(): current undefined");
	}
}	

// prev()
// If the current iterator is not at the first pair, moves current to  
// the previous pair (as defined by the order operator < on keys). If 
// the current iterator is at the first pair, makes current undefined.
// Pre: hasCurrent()
void Dictionary::prev(){
	if(this->hasCurrent()==true){
		this->current = findPrev(this->current);
	}
	else{
		throw std::logic_error("Dictionary: prev(): current undefined");
	}
}

// Other Functions ---------------------------------------------------------

// to_string()
// Returns a string representation of this Dictionary. Consecutive (key, value)
// pairs are separated by a newline "\n" character, and the items key and value 
// are separated by the sequence space-colon-space " : ". The pairs are arranged 
// in order, as defined by the order operator <.
std::string Dictionary::to_string() const{
	std::string out;
	this->inOrderString(out, this->root);
	return out;
}


// pre_string()
// Returns a string consisting of all keys in this Dictionary. Consecutive
// keys are separated by newline "\n" characters. The key order is given
// by a pre-order tree walk.
std::string Dictionary::pre_string() const{
	std::string out;
	this->preOrderString(out, this->root);
	return out;
}


// equals()
// Returns true if and only if this Dictionary contains the same (key, value)
// pairs as Dictionary D.
bool Dictionary::equals(const Dictionary& D) const{
	if(this->num_pairs != D.num_pairs){
		return false;
	}
	std::string Dict1, Dict2;
	this->inOrderString(Dict1, this->root);
	D.inOrderString(Dict2, D.root);
	if(Dict1 != Dict2){
		return false;
	}
	else{
		return true;
	}
}

// Overloaded Operators ----------------------------------------------------

// operator<<()
// Inserts string representation of Dictionary D into stream, as defined by
// member function to_string().
std::ostream& operator<<( std::ostream& stream, Dictionary& D ){
	stream << D.to_string();
	return stream;
}
// operator==()
// Returns true if and only if Dictionary A equals Dictionary B, as defined
// by member function equals(). 
bool operator==( const Dictionary& A, const Dictionary& B ){
	if(A.num_pairs != B.num_pairs){
		return false;
	}
	return A.equals(B);
}
// operator=()
// Overwrites the state of this Dictionary with state of D, and returns a
// reference to this Dictionary.
Dictionary& Dictionary::operator=( const Dictionary& D ){
	clear();
	this->num_pairs = 0;
	this->preOrderCopy(D.root, root, D.nil);
	return *this;
}
