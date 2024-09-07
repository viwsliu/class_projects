#address of file buffer: 0xffff0000 (MMIO)
#address of file record pointers(for location of starting points of stock name and income): 0x10040000 (heap)

#URGENT: make sure your csv file follows the Windows csv format:
#e.g. "Facebook,56\r\nApple,100\r\n"

.macro print_str(%str)
	li a7, 4
	la a0, %str
	ecall
.end_macro

.macro print_character(%charRegister)
	li a7, 11
	addi a0, %charRegister, 0
	ecall
.end_macro

.macro print_Int(%IntRegister)
	li a7, 1
	addi a0, %IntRegister, 0
	ecall
.end_macro

.macro 	file_open_for_read(%str)
	la a0, %str
	li a1, 0
	li a7, 1024
	ecall
.end_macro

.macro fileRead(%file_descriptor_register, %file_buffer_address)
#macro reads upto first 10,000 characters from file
	addi a0, %file_descriptor_register, 0
	li a1, %file_buffer_address
	li a2, 10000
	li a7, 63
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
	
.macro exit
	li a7, 10
	ecall
.end_macro

.data
	filePath: .asciz "data.csv" 
	fileBeginPrompt: .asciz "Printing file contents...\n________________________\n"
	fileEndPrompt: .asciz "________________________\n"
	msg: .asciz "Size of file data (in bytes): " 
	totalPrompt: .asciz "Total income garnered from all stocks: $"
	maxPrompt: .asciz "Stock name with maximum income:"
	newline: .asciz " \n" 	
.text
main:	
	#open file as read
	file_open_for_read(filePath)
	
	#a0 has file descriptor (identifuer #).Copy it to t0
	addi t0, a0, 0
	
	#read from file
	fileRead(a0, 0x0ffff0000)
	
	#print text stored at pointer from a1.a1 currently holds 0xffff0000
	print_str(fileBeginPrompt)
	print_file_contents(a1)
	print_str(fileEndPrompt)
	#find length of file
	print_str(msg)
	addi a0, t0, 0
	addi t1, t0, 0#safekeeping file descriptor value in t1
	
	addi sp, sp, -4
	sw t1, 0(sp)
	jal length_of_file  
	lwu t1, 0(sp)
	addi sp, sp, 4
	
	print_Int(a0)
	addi t0, a0, 0
	print_str(newline)
	addi a0, t0, 0
	
	#allocate file record pointers into memory at 0x10040000
	
	addi sp, sp, -4
	sw t1, 0(sp)
	
	#a0 currently contains size of file in bytes
	#IMPORTANT NOTE: if you have not correctly implemented length_of_file.asm  yet, please set a0 to 119 at this point 
	#this is to ensure allocate_file_record_pointers function works independently of  length_of_file.asm
	#li a0, 119
	#Comment out the line above so that you can test your code for different data in data.csv!!!!!
	
	li a1, 0x0ffff0000
	jal allocate_file_record_pointers
	
	lwu t1, 0(sp)
	addi sp, sp, 4
	
	addi t6, a0, 0	#t6=no. of records in file
	
		
	#test total income
	print_str(totalPrompt)
	li a0, 0x10040000
	addi a1, t6, 0#no. of records in file
	addi sp, sp, -4
	sw t6, 0(sp)
	jal totalIncome
	lwu t6, 0(sp)
	addi sp, sp, 4
	print_Int(a0)	
	print_str(newline)
	
	#test stock with max income
	print_str(maxPrompt)
	li a0, 0x10040000
	addi a1, t6, 0#no. of records in file
	jal maxIncome
	#a0 contains pointer to address that is start of stock name from pointer table
	#a0+4 then points to address that is start of stock income in original file
	addi t0, a0, 0
	addi t1, a0, 4
	lwu t0, 0(t0)
	lwu t1, 0(t1)
	addi t1, t1, -1
	# t1 now contains address of last character in stock name

printmaxIncomeloop:	
	beq t0, t1, printmaxIncomeloopExit
	lbu t2, 0(	t0)
	#loading byte at address in t0 into t2
	print_character(t2) 
	
printmaxIncomeloopUpdate:
	addi t0, t0, 1	
	j printmaxIncomeloop		
printmaxIncomeloopExit:
	exit
	
#######################end of main###############################################
		

.include "allocate_file_record_pointers.asm"
.include "income_from_record.asm"
.include "length_of_file.asm"
.include "totalIncome.asm"
.include "maxIncome.asm"





	
	
	
	
	
	


