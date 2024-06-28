# Assignment 5: Public Key Cryptography

## Short Description

<p>The purpose of this assignment is for students to achieve a basic understanding of the process in which encryption, decryption and key generation is done. Students are expected to create three main files for this assignment. A key generator, an encryptor, and a decryptor. Additionally students will be creating supplemental c files that contain the required functions for this assignment. These consist of ss.c (to implement the Schmidt-Samoa Algorithm), randstate.c and numtheory.c. </p>

## Instructions

<ol>
<li>Install all files in 'asgn5' respository folder</li>
<li>Ensure that all files are in the same folder on your device</li>
<li>Open terminal and navigate to location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create an executable main file, as well as associated '.o' object files<br>
<li>To run the executable main files, type:<br>
'./keygen'<br>
or<br>
'./decrypt'<br>
or<br>
'./encrypt'<br>
followed by a command of your choice for the appropriate executable.<br>
</ol>

Valid commands for 'keygen' are: <br>
-b : specifies the minimum bits needed for the public modulus n.<br> 
-i : specifies the number of Miller-Rabin iterations for testing primes (default: 50).<br>
-n pbfile : specifies the public key file (default: ss.pub).<br>
-d pvfile : specifies the private key file (default: ss.priv).<br>
-s : specifies the random seed for the random state initialization (default: the seconds since the UNIX epoch, given by time(NULL)).<br>
-v : enables verbose output.<br>
-h : displays program synopsis and usage.<br>

Valid commands for 'decrypt' are:<br>
-i : specifies the input file to decrypt (default: stdin).<br>
-o : specifies the output file to decrypt (default: stdout).<br>
-n : specifies the file containing the private key (default: ss.priv).<br>
-v : enables verbose output.<br>
-h : displays program synopsis and usage.<br>

Valid commands for 'encrypt' are:<br>
-i : specifies the input file to encrypt (default: stdin).<br>
-o : specifies the output file to encrypt (default: stdout).<br>
-n : specifies the file containing the public key (default: ss.pub).<br>
-v : enables verbose output.<br>
-h : displays program synopsis and usage.<br>

## Cleaning

To clean the directory, type '$ make clean' to remove the executable and all created '.o' object files from the folder.<br>

## Files in directory

<ol>
<li>decrypt.c </li>
This contains the implementation and main() function for the decrypt program. <br>
<li>encrypt.c</li>
This contains the implementation and main() function for the encrypt program. <br>
<li>keygen.c</li>
This contains the implementation and main() function for the keygen program. <br>
<li>numtheory.c</li>
This contains the implementations of the number theory functions.<br>
<li>numtheory.h</li>
This specifies the interface for the number theory functions. <br>
<li>randstate.c</li>
This contains the implementation of the random state interface for the SS library and number theory functions. <br>
<li>randstate.h</li>
This specifies the interface for initializing and clearing the random state.<br>
<li>ss.c</li>
This contains the implementation of the SS library.<br>
<li>ss.h</li>
This specifies the interface for the SS library. <br>
<li>'Makefile'</li>
Properly builds/compiles the program by creating executables and associated object files.Also cleans the directory of said executable and object files upon typing the command. Also formats all '.c' files upon command. <br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 5, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, how it works, what steps were taken to reach this point, any possible bugs, issued faced while working on the assignment, challenges, and what I learned from this assignment.<br>
</ol>

