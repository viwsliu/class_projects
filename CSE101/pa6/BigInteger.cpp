//Vincent Liu
//CSE101-01 Spring 2023
//Pa6
//viwliu
//1915968


#include <iostream>
#include <string>
#include <cassert>
#include "BigInteger.h"
ListElement base = 1000000000;
int power = 9;

BigInteger::BigInteger() { this->signum = 0; }

// Class constructor and destructor
BigInteger::BigInteger(long x) {
	if(x == 0){
		this->signum = 0;
		return;
	}
	if(x < 0){
		this->signum = -1;
		x *= -1;
	}else{
		this->signum = 1;
	}
	assert(x > 0);
	while (x != 0) {
		this->digits.insertAfter(x % base);
		x = x / base;
	}
}

BigInteger::BigInteger(std::string s) {
	if (s.length() == 0) {
		throw std::invalid_argument("BigInteger: Constructor: empty string");
	}
	if (s[0] == '-') {
		signum = -1;
		s.erase(0, 1);
	} else if (s[0] == '+'){
		signum = 1;
		s.erase(0, 1);
	}else{
		signum = 1;
	}
	if (s.length() == 0) {
		throw std::invalid_argument("BigInteger: Constructor: non-numeric string");
	}
	while(s[0] == '0'){
		s.erase(0, 1);
	}
	for(unsigned long i = 0; i < s.length(); i++){
		if(!std::isdigit(s[i])){
			throw std::invalid_argument("BigInteger: Constructor: non-numeric string");
		}
	}
	while (s.length() > (unsigned int) power) {
		std::string temp = s.substr(s.length() - power, power);
		long num = std::stol(temp);
		this->digits.insertAfter(num);
		s = s.substr(0, s.length() - power);
	}
	long num = std::stol(s);
	this->digits.insertAfter(num);
}

BigInteger::BigInteger(const BigInteger &N) {
	this->digits = N.digits;
	this->signum = N.signum;
}

// Access functions---------------------
int BigInteger::sign() const {
	return this->signum;
}

int BigInteger::compare(const BigInteger &N) const {
	if ((this->signum == -1) && (N.signum == 0)) {
		return -1;
	}
	if ((this->signum == -1) && (N.signum == 1)) {
		return -1;
	}
	if ((this->signum == 0) && (N.signum == -1)) {
		return 1;
	}
	if ((this->signum == 0) && (N.signum == 1)) {
		return -1;
	}
	if ((this->signum == 1) && (N.signum == -1)) {
		return 1;
	}
	if ((this->signum == 1) && (N.signum == 0)) {
		return 1;
	}

	if ((this->digits) == (N.digits)) {
		return 0;
	}
	List copy(this->digits);
	copy.moveFront();
	List Ncopy(N.digits);
	Ncopy.moveFront();
	while ((copy.position() != copy.length()) &&
			(Ncopy.position() != Ncopy.length())) {
		if ((copy.peekNext()) > (Ncopy.peekNext())) {
			return 1;
		}
		if ((copy.peekNext()) < (Ncopy.peekNext())) {
			return -1;
		}
		Ncopy.moveNext();
		copy.moveNext();
	}
	return 0;
}

// Manipulation procedures------------------
void BigInteger::makeZero() {
	this->digits.clear();
	this->signum = 0;
}

void BigInteger::negate() {
	if (this->signum == -1) {
		this->signum = 1;
	}
	else if (this->signum == 1) {
		this->signum = -1;
	}
}

// Helper function---------------------------
// Chanegs teh sign of each integer in List L. Used by sub
void negateList(List &L) {
	L.moveFront();
	for (int i = 0; i < L.length(); i++) {
		int temp = L.peekNext();
		temp = temp * -1;
		L.setAfter(temp);
		L.moveNext();
	}
}

// Overwrites the state of S with A+sign*B (vectors). Used by sum and sub
void sumList(List &S, List A, List B, int sign) {
	S.clear();
	bool a_end = A.length() == 0;
	bool b_end = B.length() == 0;
	A.moveBack();
	B.moveBack();
	ListElement a_val;
	ListElement b_val;
	while (!((a_end == true) && (b_end == true))) {
		if(a_end == false){
			a_val = A.peekPrev();
		}else{
			a_val = 0;
		}
		if(b_end == false){
			b_val = B.peekPrev();
		}else{
			b_val = 0;
		}
		S.insertAfter(a_val + (sign * b_val));

		if (a_end == false) {
			A.movePrev();
		}
		if (b_end == false) {
			B.movePrev();
		}
		if (A.position() == 0) {
			a_end = true;
		}
		if (B.position() == 0) {
			b_end = true;
		}
	}
}


// appentds p zero digits to L, multiplying L by base p. Used by mult()
void shiftList(List &L, int p) {
	L.moveBack();
	for (int i = 0; i < p; i++) {
		L.insertAfter(0);
	}
}


// Performs carries from right to Left, then return the sign of the resulting
// integer. Used by add, sub and mult
int normalizeList(List &L) {
	List orig = L;
	L.moveBack();
	long carry = 0;
	for (int i = 0; i < L.length(); i++) {
		long temp = L.peekPrev();
		temp += carry;
		long keep = temp % base;
		if(keep < 0){
			keep += base;
		}
		assert(keep >= 0);
		carry = (temp - keep) / base;
		L.setBefore(keep);
		L.movePrev();
	}
	if (carry < 0) {
		List tmp = L;
		List A;
		A.insertBefore(carry * -1);
		shiftList(A, L.length());
		sumList(L, A, tmp, -1);
		assert(normalizeList(L) != -1);
	}
	L.moveFront();
	while(L.position() != L.length()){
		if(L.peekNext() != 0){
			break;
		}
		L.eraseAfter();
	}
	if(L.length() == 0){
		return 0;
	}
	if(carry < 0){
		return -1;
	}
	if(carry != 0){
		L.insertBefore(carry);
	}
	return 1;
}

// Multiplies L (vector) by m.
void scalarMultList(List &L, ListElement m) {
	L.moveFront();
	for (int i = 0; i < L.length(); i++) {
		long temp = L.peekNext();
		temp = temp * m;
		L.eraseAfter();
		L.insertAfter(temp);
		L.moveNext();
	}
}

// BigInteger Arithmetic operations---------------------
BigInteger BigInteger::add(const BigInteger &N) const {
	BigInteger return_thing;
	List N_copy(N.digits);
	List this_copy(this->digits);
	if(this->signum == -1){
		negateList(this_copy);
	}
	sumList(return_thing.digits, this_copy, N_copy, N.signum);
	return_thing.signum = normalizeList(return_thing.digits);
	return return_thing;
}

BigInteger BigInteger::sub(const BigInteger &N) const {


	BigInteger return_thing;

	List N_copy(N.digits);
	List this_copy(this->digits);

	if(this->signum == -1){
		negateList(this_copy);
	}

	sumList(return_thing.digits, this_copy, N_copy, -1 * N.signum);
	return_thing.signum = normalizeList(return_thing.digits);
	return return_thing;
}

BigInteger BigInteger::mult(const BigInteger &N) const {
	List Ncopy(N.digits);
	List total;

	Ncopy.moveFront();

	for(int i = 0; i < Ncopy.length(); i++){
		List thiscopy(this->digits);
		scalarMultList(thiscopy, Ncopy.peekNext());
		shiftList(thiscopy, Ncopy.length() - i - 1);
		sumList(total, total, thiscopy, 1);
		int thing = normalizeList(total);
		assert((thing == 0) || (thing == 1));
		Ncopy.moveNext();
	}

	BigInteger out;
	out.digits = total;
	out.signum = this->signum * N.signum;
	return out;
}

// Other functions--------------------
std::string BigInteger::to_string() {
	std::string out;
	if(this->signum == 0){
		return "0";
	}
	if(this->signum == -1){
		out += "-";
	}
	this->digits.moveFront();
	for (int i = 0; i < (this->digits.length()); i++) {
		std::string temp = std::to_string(this->digits.peekNext());
		if(i != 0){
			while(temp.length() < (unsigned int) power){
				temp = "0" + temp;
			}
		}
		out += temp;
		this->digits.moveNext();
	}
	return out;
}

// Overwridden Operators ----------------

std::ostream &operator<<(std::ostream &stream, BigInteger N) {
	stream << N.to_string();
	return stream;
}

// operator==()
// Returns true if and only if A equals B.
bool operator==(const BigInteger &A, const BigInteger &B) {
	return A.compare(B) == 0;
}

// operator<()
// Returns true if and only if A is less than B.
bool operator<(const BigInteger &A, const BigInteger &B) {
	return A.compare(B) == -1;
}

// operator<=()
// Returns true if and only if A is less than or equal to B.
bool operator<=(const BigInteger &A, const BigInteger &B) {
	return !(A>B);
}

// operator>()
// Returns true if and only if A is greater than B.
bool operator>(const BigInteger &A, const BigInteger &B) {
	return A.compare(B) == 1;
}

// operator>=()
// Returns true if and only if A is greater than or equal to B.
bool operator>=(const BigInteger &A, const BigInteger &B) {
	return !(A < B);
}
// operator+()
// Returns the sum A+B.
BigInteger operator+(const BigInteger &A, const BigInteger &B) {
	return A.add(B);
}
// operator+=()
// Overwrites A with the sum A+B.
BigInteger operator+=(BigInteger &A, const BigInteger &B) {
	BigInteger tmp = A.add(B);
	A.digits = tmp.digits;
	A.signum = tmp.signum;
	return A;
}

// operator-()
// Returns the difference A-B.
BigInteger operator-(const BigInteger &A, const BigInteger &B) {
	return A.sub(B);
}
// operator-=()
// Overwrites A with the difference A-B.
BigInteger operator-=(BigInteger &A, const BigInteger &B) {
	BigInteger tmp = A.sub(B);
	A.digits = tmp.digits;
	A.signum = tmp.signum;
	return A;
}

// operator*()
// Returns the product A*B.
BigInteger operator*(const BigInteger &A, const BigInteger &B) {
	return A.mult(B);	
}
// operator*=()
// Overwrites A with the product A*B.
BigInteger operator*=(BigInteger &A, const BigInteger &B) {
	BigInteger tmp = A.mult(B);	
	A.digits = tmp.digits;
	A.signum = tmp.signum;
	return A;
}
