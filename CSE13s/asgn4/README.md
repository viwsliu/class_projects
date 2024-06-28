# Assignment 4: The Game of Life

## Short Description

<p>The purpose of this assignment is to replicate a “Conway’s game of life”. The assignment assignment requires students to become familiar with memory allocation, pointers, dereferencing, as well as other programming skills found in prior assignments. Students will also be using ncurses to 'draw' the game onto a screen..</p>

## Instructions

<ol>
<li>Install all files in 'asgn4' respository folder</li>
<li>Ensure that all files are in the same folder on your device</li>
<li>Open terminal and navigate to location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create an executable main file, as well as associated '.o' object files<br>
<li>To run the executable main file, type:<br>
'./life'<br>
followed by a command of your choice.<br>
</ol>

These commands could be: <br>
    -t : Specify that the Game of Life is to be played on a toroidal universe.<br>
    -s : Silence ncurses. Enabling this option means that nothing should be displayed by ncurses.<br>
    -n generations : Specify the number of generations that the universe goes through. The default
number of generations is 100.<br>
    -i input : Specify the input file to read in order to populate the universe. By default the input
should be stdin.<br>
    -o output : Specify the output file to print the final state of the universe to. By default the output
should be stdout.<br>

## Cleaning

To clean the directory, type '$ make clean' to remove the executable and all created '.o' object files from the folder.<br>

## Files in directory

<ol>
<li>universe.c </li>
Implements the Universe ADT.<br>
<li>universe.h</li>
Specifies the interface to the Universe ADT. This file is provided and may not be
modified.<br>
<li>life.c</li>
Contains main() and may contain any other functions necessary to complete your
implementation of the Game of Life.<br>
<li>'Makefile'</li>
Properly builds/compiles the program by creating executables and associated object files.Also cleans the directory of said executable and object files upon typing the command. Also formats all '.c' files upon command. <br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 3, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, how each sorting method works, gives insight on the results found, as well as explain each sorting method's efficiency. Also includes visuals to assist in the explaination of results found.<br>
</ol>

