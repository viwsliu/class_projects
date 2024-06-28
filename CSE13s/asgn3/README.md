# Assignment 3: Sorting: Putting your affairs in order

## Short Description

<p>This assignment exposes students to various sorting methods that are known to those familiar with computer science. Students are expected to code Shell sort, Heap sort, Quick sort and Batcher's Odd-Even Merge sort.</p>

## Instructions

<ol>
<li>Install all files in 'asgn3' respository folder</li>
<li>Ensure that all files are in the same folder on your device</li>
<li>Open terminal and navigate to location of said folder</li>
<li>Use terminal and type:<br>
'$ make' or '$ make all' to create an executable main file, as well as associated '.o' object files<br>
<li>To run the executable main file, type:<br>
'./sorting'<br>
followed by a command of your choice.<br>
</ol>

These commands could be: <br>
-a : Employs all sorting algorithms.<br>
-h : Enables Heap Sort.<br>
-b : Enables Batcher Sort.<br>
-s : Enables Shell Sort.<br>
-q : Enables Quicksort.<br>
-r seed : Set the random seed to seed. The default seed should be 13371453.<br>
-n size : Set the array size to size. The default size should be 100.<br>
-p elements : Print out the number of elements from the array. The default number<br>
of elements to print out should be 100.<br>
-H : Prints out program usage.<br>
For example: './sorting -a' or './sorting -r -h -b -s'<br>

## Cleaning

To clean the directory, type '$ make clean' to remove the executable and all created '.o' object files from the folder.<br>

## Files in directory

<ol>
<li>batcher.c</li>
implements “Batcher’s Odd-Even Merge sort”<br>
<li>batcher.h</li>
specifies the interface to batcher.c<br>
<li>shell.c</li>
implements “Shell Sort”. Takes an item with the largest gap first and attempts to insert it wherever the gap is smallest. Does so recursively.<br>
<li>shell.h</li>
specifies the interface to shell.c<br>
<li>heap.c</li>
implements “Heap Sort”. Idea is to reorganize items from largest to smallest. It does so by finding the largest item, pushing it to the right, then checking remaining items for the next largest item.<br>
<li>heap.h</li>
specifies the interface to heap.c<br>
<li>quick.c </li>
implements “Quicksort”. Uses a “divide and conquer” method in which data is partitioned into small segments and organized individually, before being organized as a whole.<br>
<li>quick.h</li>
specifies the interface to quick.c.<br>
<li>set.c</li>
implements bitwise operations<br>
<li>set.h</li>
implements and specifies the interface for the set ADT.<br>
<li>stats.c</li>
implements the statistics module.<br>
<li>stats.h</li>
specifies the interface to the statistics module.<br>
<li>sorting.c</li>
contains main() and may contain any other functions necessary to complete the assignment<br>
<li>'Makefile'</li>
Properly builds/compiles the program by creating executables and associated object files.Also cleans the directory of said executable and object files upon typing the command. Also formats all '.c' files upon command. <br>
<li>'README.md'</li>
<li>'DESIGN.pdf'</li>
Explains the design of Assignment 3, its pseudocode, files required to run the program, and credit/references.<br>
<li>'WRITEUP.pdf'</li>
Describes what the program does, how each sorting method works, gives insight on the results found, as well as explain each sorting method's efficiency. Also includes visuals to assist in the explaination of results found.<br>
</ol>

