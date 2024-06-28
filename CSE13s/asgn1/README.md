#Assignment 1: Getting Acquainted with UNIX and C

##Short Description 

<p>This program graphs a Monte Carlo estimation of pi onto a graph with the use of gnuplot and shell. The output of the Monte Carlo C program (monte_carlo.c) is given as a data (.dat) file to the shell (.sh)(plot.sh) script which then generates a graph (exported as pdf).</p>

## Instructions

<ol>
<li>Install all files in 'asgn1' folder</li>
<li>Ensure that all files are in the same folder</li>
<li>Open terminal and navigate to the location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create an executable binary file titled "monte_carlo"<br>
<li>To run, type:<br>
'./plot.sh'<br>
to run and generate graphs</li>
<li>A PDF file named "monte_carlo_.pdf" will be created in the same location as plot.sh</li>
</ol>

##Cleaning

<p>To clean the directory, type '$ make clean' to remove the ecevutable and .o files from the directory</p>

## Files in directory

<ol>
<li>'monte_carlo.c'</li>
Source file that contains main() and majority of code that executes the monte carlo method of approximating a numerical value.<br>
<li>'plot.sh'</li>
Passes output data from monte_carlo.c towards gnuplot in order to create a graph, which is generated as a pdf<br>
<li>'Makefile'</li>
Describes how to properly build the program and clean itself afterwards<br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 1, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, and gives insight on the results found about the method's efficiency as well as other details.<br>
</ol>
