maxIncome:
#finds the total income from the file
#arguments:	a0 contains the file record pointer array location (0x10040000 in our example) But your code MUST handle any address value
#		a1:the number of records in the file
#return value a0: heap memory pointer to actual  location of the record stock name in the file buffer

	#if empty file, return 0 for both a0, a1
	bnez a1, maxIncome_fileNotEmpty
	li a0, 0
	ret

 maxIncome_fileNotEmpty:
	
	# Start your coding from here!

init_max_income:
	mv t0, a0
	li t1, 0
	li t2, 0
	mv t3, a1
	li t4, 0
	addi sp, sp, -8
	sd ra, 0(sp)
	addi t0 t0 4
loop_max_income:
	lw a0, 0(t0)	
	addi sp sp -40
	sd t0, 0(sp)
	sd t1, 8(sp)
	sd t2, 16(sp)
	sd t3, 24(sp)
	sd t4, 32(sp)
	jal income_from_record
	ld t0, 0(sp)
	ld t1, 8(sp)
	ld t2, 16(sp)
	ld t3, 24(sp)
	ld t4, 32(sp)
	addi sp sp 40
	bgt t2, a0, update_max_income
	mv t2, a0
	addi t4, t0, -4
	
	
update_max_income:
	addi t1, t1, 1
	addi t0, t0, 8
	beq t1, t3, end_max_income
	j loop_max_income
	
end_max_income:
	ld ra, 0(sp)
	addi sp sp 8
	mv a0, t4
	
	#if no student code entered, a0 just returns 0x10040010 always :(
	
# End your  coding  here!
	
	ret
#######################end of maxIncome###############################################
