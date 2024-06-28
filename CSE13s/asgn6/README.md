# Assignment 6: Lempel-Ziv Compression

## Short Description

<p>The purpose of this assignment is for students to achieve a basic understanding of data compression using the Lempel-Ziv method of compression (also known as LZ77 and LZ78, published in 1977 and 1978, respectively). In this assignment, students will be working to implemnent LZ78 using the C programming language. Additionally, students will be creating two main files for this assignment, as well as three supporting function files. The main files are encode.c and decode.c, while the other three files are io.c, word.c and trie.c </p>

## Instructions

<ol>
<li>Install all files in 'asgn6' respository folder</li>
<li>Ensure that all files are in the same folder on your device</li>
<li>Open terminal and navigate to location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create the executable main files, as well as associated '.o' object files<br>
<li>To create a specific executable file, either type:<br>
' $make encode' or '$ make decode'<br>
<li>To run the executable main files, type:<br>
'./encode'<br>
or<br>
'./decode'<br>
followed by a command of your choice for the appropriate executable.<br>
</ol>

Valid commands for 'encode' are:<br>
-v : Print compression statistics to stderr.<br>
-i input : Specify input to compress (stdin by default)<br>
-o output : Specify output of compressed input (stdout by default)<br>
-h : displays program synopsis and usage.<br>

Valid commands for 'decode' are:<br>
-v : Print decompression statistics to stderr.<br>
-i input : Specify input to decompress (stdin by default)<br>
-o output : Specify output of decompressed input (stdout by default)<br>
-h : displays program synopsis and usage.<br>

## Cleaning

To clean the directory, type '$ make clean' to remove the executable and all created '.o' object files from the folder.<br>

## Files in directory

<ol>
<li>decode.c </li>
contains the main() function for the decode program.<br>
<li>encode.c</li>
contains the main() function for the encode program.<br>
<li>trie.c</li>
the source file for the Trie ADT.<br>
<li>trie.h</li>
the header file for the Trie ADT.<br>
<li>word.c</li>
the source file for the Word ADT.<br>
<li>word.h</li>
the header file for the Word ADT.<br>
<li>io.c</li>
the source file for the I/O module.<br>
<li>io.h</li>
the header file for the I/O module.<br>
<li>endian.h</li>
the header file for the endianness module<br>
<li>code.h</li>
the header file containing macros for reserved codes.<br>
<li>'Makefile'</li>
Properly builds/compiles the program by creating executables and associated object files.Also cleans the directory of said executable and object files upon typing the command. Also formats all '.c' files upon command. <br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 6, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, how it works, what steps were taken to reach this point, any possible bugs, issued faced while working on the assignment, challenges, and what I learned from this assignment.<br>
</ol>

