allocate_file_record_pointers:
#argument: 	a0 contains file size in bytes
#		a1 contains starting address of file buffer (for lab4 overall, this will be 0xffff0000
# but your function MUST be able to work for any a1 argument value
#function allocates to starting memory location 0x10040000 the array of file record pointers 
#(refer to lab4 documentation to precisely understand how this is arranged in memory)
# returns the number of records in file in a0 register

#IMPORTANT ASSUMPTION: we are dealing with a csv file in Windows OS
#So each record ends with "\r\n"

	
	li t0, 44 # ',' character
	li t1, 10#'\n' character
	li t2, 0x10040000
	add t3, a1, a0 #counter to keep track till EOF
	
	lbu t4, 0(a1)
	
	li a0, 0
	#if file is empty(the very first byte is 0) just do nothing and return
	bnez t4, fileNotEmpty
	ret
	
fileNotEmpty:
	#let's take care of first record in buffer
	sw a1, 0(t2)
	#first record's name address is now in 0x10040000
	#now need to account for this record's income address
	#then we repeat this for the remaining records in file
	#we will assume in csv format name is alwuays followed by income in a specific record

	addi t2, t2, 4
	addi a1, a1, 1
allocate_file_record_pointers_loop1:
	
	lbu t4, 0(a1)
	
	#if byte t4 in file buffer is ','(t0), then next byte's address is stored in array and then update t2 by 4 
	#if byte t4 in file buffer is '\n'(t1), then next byte's address is stored in array and then update t2 by 4 
	#keep on doing either of above till you reach EOF
	
	bne t4, t0, notaComma
	addi t5, a1, 1
	sw t5, 0(t2)
	addi t2, t2, 4
notaComma:	
	bne t4, t1, notaCommaOrNewLine
	addi t5, a1, 1
	sw t5, 0(t2)
	addi t2, t2, 4
	#each newline marks the end of a record
	addi a0, a0, 1	
notaCommaOrNewLine:
	#loop update
	addi a1, a1, 1
	blt a1, t3, allocate_file_record_pointers_loop1
	
	#through the loop's algorithm above, we saved the EOF null byte location to array st 0x10040000 as well!
	#need to reset that value of that array entry to zero!
	addi t2, t2, -4
	li t0,0
	sw t0, 0(t2)
	
	ret
	
#######################end of allocate_file_record_pointers###############################################
