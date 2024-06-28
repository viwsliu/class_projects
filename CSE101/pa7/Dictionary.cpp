//Vincent Liu
//viwliu #1915968
//CSE101-01 Spring 23

#include<iostream>
#include<string>
#include <cassert>
#include "Dictionary.h"

// Class Constructors & Destructors ----------------------------------------

// Creates new Dictionary in the empty state. 
Dictionary::Dictionary(){
	this->num_pairs = 0;
	this->root = nullptr;
	this->nil = nullptr;
	this->current = nullptr;
}

// Copy constructor.
Dictionary::Dictionary(const Dictionary& D){
	this->num_pairs = 0;
	this->root = nullptr;
	this->nil = nullptr;
	this->current = nullptr;
	this->preOrderCopy(D.root, this->root);
}	

//Node Constructor
Dictionary::Node::Node(keyType k, valType v){
	this->key = k;
	this->val = v;
	this->parent = nullptr;
	this->left = nullptr;
	this->right = nullptr;
}

// Destructor
Dictionary::~Dictionary(){
	this->clear();
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
		s += R->key + "\n";
	
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
void Dictionary::preOrderCopy(Node* R, Node* N){
	if(R==N){
		return;
	}
	this->setValue(R->key, R->val);
	if(R->left != nil){
		this->preOrderCopy(R->left, N);
	}
	if(R->right != nil){
		this->preOrderCopy(R->right, N);
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
	}else if(N->right != nullptr){
		return findMin((current->right));
	}else if(N->parent == nullptr){
		return nullptr;
	}else if(N == N->parent->left){
		return N->parent;
	}else if(current == current->parent->right){
		Node *curr = current;
		while(curr->parent != nullptr){
			if(curr->parent->left == curr){
				return curr->parent;
			}
			curr = curr->parent;
		}
		if(curr->parent == nullptr){
			return nullptr;
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
	}else if(N->left != nullptr){
		return findMax((current->left));
	}else if(N->parent == nullptr){
		return nullptr;
	}else if(N == N->parent->right){
		return N->parent;
	}else if(current == current->parent->left){
		Node *curr = current;
		while(curr->parent != nullptr){
			if(curr->parent->right == curr){
				return curr->parent;
			}
			curr = curr->parent;
		}
		if(curr->parent == nullptr){
			return nullptr;
		}
	}
	assert(false);
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
	this->current = nullptr;
	this->root =nullptr;
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
			this->num_pairs++;
		}else{
			this->TreeInsert(root, k, v);
		}
	}
}
//helper function
void Dictionary::TreeInsert(Node* N, keyType k, valType v){
	if(k< N->key){
		if(N->left != nil){
			TreeInsert(N->left,k,v);
		}
		else{
			N->left = new Node(k, v);
			N->left->parent = N;
			this->num_pairs++;
		}
	}
	else if(k>N->key){
		if(N->right != nil){
			TreeInsert(N->right,k,v);
		}
		else{
			N->right = new Node(k,v);
			N->right->parent = N;
			this->num_pairs++;
		}
	}else{
		assert(false);
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
	if(current != nullptr){
		if(current->key == k){	
			current = nil;
		}
	}
	//Delete(T, z)
	if (var->left == nil){  // case 1  or case 2.1 (right only)
		this->Transplant(var, var->right);
	}
	else if(var->right == nil){         // case 2.2 (left only)
		this->Transplant(var, var->left);
	}
	else {                          // case 3
		Node* y = findMin(var->right);
		if (y->parent != var){
			this->Transplant(y, y->right);
			y->right = var->right;
			y->right->parent = y;

		}
		this->Transplant(var, y);
		y->left = var->left;
		y->left->parent = y;
	}
	delete var;
	this->num_pairs-=1;
}
//helper function
void Dictionary::Transplant(Node* u, Node* v){
	if (u->parent == nil){
		this->root = v;
	}
	else if (u == u->parent->left){
		u->parent->left = v;
	}
	else if (u==u->parent->right){
		u->parent->right = v;
	}
	if(v != nil){
		v->parent = u->parent;
	}
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
	this->num_pairs = 0;
	this->preOrderCopy(D.root, this->root);
	return *this;
}
