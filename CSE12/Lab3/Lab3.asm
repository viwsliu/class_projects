.macro exit #macro to exit program
	li a7, 10
	ecall
	.end_macro	

.macro print_str(%string1) #macro to print any string
	li a7,4 
	la a0, %string1
	ecall
	.end_macro
	
	
.macro read_n(%x)#macro to input integer n into register x
	li a7, 5
	ecall 		
	#a0 now contains user input
	addi %x, a0, 0
	.end_macro
	

.macro 	file_open_for_write_append(%str)
	la a0, %str
	li a1, 1
	li a7, 1024
	ecall
.end_macro
	
.macro  initialise_buffer_counter
	#buffer begins at location 0x10040000
	#location 0x10040000 to keep track of which address we store each character byte to 
	#actual buffer to store the characters begins at 0x10040008
	
	#initialize mem[0x10040000] to 0x10040008
	addi sp, sp, -16
	sd t0, 0(sp)
	sd t1, 8(sp)
	
	li t0, 0x10040000
	li t1, 0x10040008
	sd t1, 0(t0)
	
	ld t0, 0(sp)
	ld t1, 8(sp)
	addi sp, sp, 16
	.end_macro
	

.macro write_to_buffer(%char)
	
	
	addi sp, sp, -16
	sd t0, 0(sp)
	sd t4, 8(sp)
	
	
	li t0, 0x10040000
	ld t4, 0(t0)#t4 is starting address
	#t4 now points to location where we store the current %char byte
	
	#store character to file buffer
	li t0, %char
	sb t0, 0(t4)
	
	#update address location for next character to be stored in file buffer
	li t0, 0x10040000
	addi t4, t4, 1
	sd t4, 0(t0)
	
	ld t0, 0(sp)
	ld t4, 8(sp)
	addi sp, sp, 16
	.end_macro

.macro fileRead(%file_descriptor_register, %file_buffer_address)
#macro reads upto first 10,000 characters from file
	addi a0, %file_descriptor_register, 0
	li a1, %file_buffer_address
	li a2, 10000
	li a7, 63
	ecall
.end_macro 

.macro fileWrite(%file_descriptor_register, %file_buffer_address,%file_buffer_address_pointer)
#macro writes contents of file buffer to file
	addi a0, %file_descriptor_register, 0
	li a1, %file_buffer_address
	li a7, 64
	
	#a2 needs to contains number of bytes sent to file
	li a2, %file_buffer_address_pointer
	ld a2, 0(a2)
	sub a2, a2, a1
	
	ecall
.end_macro 

.macro print_file_contents(%ptr_register)
	li a7, 4
	addi a0, %ptr_register, 0
	ecall
	#entire file content is essentially stored as a string
.end_macro
	


.macro close_file(%file_descriptor_register)
	li a7, 57
	addi a0, %file_descriptor_register, 0
	ecall
.end_macro

.data
	prompt1: .asciz  "Enter n (must be greater than 0):"
	error_msg: .asciz "Invalid Entry!"
	outputMsg: .asciz  " display pattern saved to lab3_output.txt "
	newline: .asciz  "\n"  #this prints a newline
	star: .asciz "*"
	blackspace: .asciz " " 
	filename: .asciz "lab3_output.txt"


.text

	file_open_for_write_append(filename)
	#a0 now contaimns the file descriptor (i.e. ID no.)
	#save to t6 register
	addi t6, a0, 0
	
	initialise_buffer_counter
	
	#for utilsing macro write_to_buffer, here are tips:
	#0x2a is the ASCI code input for star(*)
	#0x20  is the ASCI code input for  blankspace
	#0x0a  is the ASCI code input for  newline (/n)

	
	#START WRITING YOUR CODE FROM THIS LINE ONWARDS
	#DO NOT use the registers a0, a1, a7, t6, sp anywhere in your code.
	
	#................ your code here..........................................................#

askforinput:	
	print_str(prompt1) #prints string
	read_n(t1) #allows for input to be stored in t1
	li s1, 1 #sets storage values to 1,2,3 respectively
	li s2, 2
	li s3, 3
	
CheckInput:
	bgt t1, s0, checknums    #check input > 0. if it is, go to function
	print_str(error_msg) 		#if t0 =< 0, print error and ask again	
	print_str(newline)		
	ecall				# print out the string
	jal askforinput			# jump back to requestInput, and run again
	ecall 

checknums: #check if inputs were either one, two or three
	#beq t0, t1, end  #
	beq t1, s1, one  #if user input=1. will only print 1 star
	beq t1, s2, two   #if user input=2. jump to function
	beq t1, s3, three  # if user input=3. jump to function

threeplus: #when input is over 3, print first three line and set counter to start at line 4
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	write_to_buffer(0x2a)
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	write_to_buffer(0x2a)
	write_to_buffer(0x20)
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	
	print_str(star)
	print_str(newline)
	print_str(star)
	print_str(star)
	print_str(newline)
	print_str(star)
	print_str(blackspace)
	print_str(star)
	print_str(newline)#prints first 3 lines
	addi t0, t0, 4 #t0 will now start at 4
	addi t3, t0, 0 #t5 starts at 4
	
loop1: #loop checks
	beq t0, t1, final_line 
	beq t3, t0, manage_t3_star 
	beqz t3, manage_t3_star_zero 
	bne t3, t0, manage_t3_space 
	
manage_t3_star: #if counter t3 is at the final place on a line , print a star. t3 counts places on the horizontal line
	write_to_buffer(0x2a)
	print_str(star)
	sub t3, t3, s1
	sub t3, t3, s1
	j loop1
	
manage_t3_space: #if t3/= and is not the first item in the line, print a space
	write_to_buffer(0x20)
	print_str(blackspace)
	sub t3, t3, s1
	j loop1
	
manage_t3_star_zero: #if counter t3 = 0, print star, jump line
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	
	print_str(star)
	print_str(newline)
	beq t0, t1, end
	addi t0, t0, 1
	addi t3, t0, 0
	j loop1
	
one: #if user input =1, prints 1 star
	write_to_buffer(0x2a)
	print_str(star)
	addi t0, t0, 1
	j checknums
two: #if user input = 2 , prints 2 tall triangle
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	write_to_buffer(0x2a)
	write_to_buffer(0x2a)
	
	print_str(star)
	print_str(newline)
	print_str(star)
	print_str(star)
	addi t0, t0, 2
	j checknums
three: #if user input = 3 , prints 3 tall triangle
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	write_to_buffer(0x2a)
	write_to_buffer(0x2a)
	write_to_buffer(0x0a)
	write_to_buffer(0x2a)
	write_to_buffer(0x2a)
	write_to_buffer(0x2a)
	

	print_str(star)
	print_str(newline)
	print_str(star)
	print_str(star)
	print_str(newline)
	print_str(star)
	print_str(star)
	print_str(star)
	addi t0, t0, 3
	j checknums

loop_end: #if counter t3 is exhausted and equals 0, end loop and end program
	beq t3, s0, end
	
final_line: #if 4 was the user input, jump to function final_line
	sub t3, t3, s1
	write_to_buffer(0x2a)
	print_str(star)
	j loop_end

end: #pass

	



	#---------------------w o r k  z o n e end------------------------
	 
	 
	
	
	#END YOUR CODE ABOVE THIS COMMENT
	#Don't cvhange anything below this comment!
	
	#write null character to end of file
	write_to_buffer(0x00)
	
	#write file buffer to file
	fileWrite(t6, 0x10040008,0x10040000)
	addi t5, a0, 0
	
	print_str(newline)
	print_str(outputMsg)
	
	exit
	
	
	

