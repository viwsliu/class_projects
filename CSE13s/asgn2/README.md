# Assignment 2: A Little Slice of Pi

## Short Description

<p>This assignment creates a math library that resembles the math.h library that can be used in C programs. The goal of the assignment is to implement various methods of approximating pi, e & square root, and comparing their accuracy to the outputs of the math.h library's outputs. Furthermore, this assignment requires that we count the number of iterations taken to reach an approximation. Additionally, the assignment allows for students to further expose themselves to the C programming language, Makefiles, as well as many other concepts of programming.<p>

## Instructions

<ol>
<li>Install all files in 'asgn2' folder</li>
<li>Ensure that all files are in the same folder</li>
<li>Open terminal and navigate to the location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create an executable binary main file as well as associated '.o' files<br>
<li>To run, type:<br>
 './mathlib-test'<br>
followed by a command of your choice.<br>
</ol>
<ol>
These commands could be:<br>
-a Runs all tests<br>
-e Runs e approximation test<br>
-b Runs BBP pi test<br>
-m Runs Madhava pi test<br>
-r Runs Euler sequence pi test<br>
-v runs Viete pi test<br>
-n Runs Newton-Raphson sqrt test<br>
-s Enable printing of statistics to see computed terms and iterations for each tested function.<br>
-h : Display a help message detailing program usage.<br>
Example: "./mathlib-test -e" or "./mathlib-test -s -v"<br>

## Cleaning

To clean the directory, type '$ make clean' to remove the executable and '.o' files from the directory

## Files in directory

<ol>
<li>'mathlib-test.c'</li>
Source file that contains main() and code that takes in terminal commands to execute/run functions.<br>
<li>'e.c'</li>
Contains two functions that approximate the value of ‘e’ & track the number of terms computed, as well as return the number of computed terms<br>
<li>'madhava.c'</li>
Contains two functions. One that approximate the value of pi using the Madhava series and track the number of computed terms. The other function returns the number of computed terms<br>
<li>'euler.c'</li>
Contains two functions. One that approximate the value of pi using the Euler solution and track the number of computed terms. The other function returns the number of computed terms<br>
<li>'bbp.c'</li>
Contains two functions that approximate the value of pi using the Bailey-Borwein-Plouffe formula and track the number of computed terms. The other function returns the number of computed terms.<br>
<li>'viete.c'</li>
Contains two functions that approximate the value of pi using the Viete’s formula and track the number of computed terms. The other function returns the number of computed terms.<br>
<li>'newton.c'</li>
Contains two functions. One that determines the value of pi thought the Newton-Raphson formula and one that returns iterations needed to reach pi with said method.<br>
<li>'Makefile'</li>
Describes how to properly build the program and clean itself afterwards<br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 2, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, gives insight on the results found about, as well as explains each method's efficiency.<br>
</ol>

