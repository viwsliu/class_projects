totalIncome:
#finds the total income from the file
#arguments:	a0 contains the file record pointer array location (0x10040000 in our example) But your code MUST handle any address value
#		a1:the number of records in the file
#return value a0:the total income (add up all the record incomes)

	#if empty file, return 0 for  a0
	bnez a1, totalIncome_fileNotEmpty
	li a0, 0
	ret

totalIncome_fileNotEmpty:
	
	# Start your coding from here!

init_total_income:
	mv t0, a0
	li t1, 0
	li t2, 0
	mv t3, a1
	addi sp, sp, -8
	sd ra, 0(sp)
	addi t0 t0 4
loop_total_income:
	lw a0, 0(t0)	
	addi sp sp -32
	sd t0, 0(sp)
	sd t1, 8(sp)
	sd t2, 16(sp)
	sd t3, 24(sp)
	jal income_from_record
	ld t0, 0(sp)
	ld t1, 8(sp)
	ld t2, 16(sp)
	ld t3, 24(sp)
	addi sp sp 32
	add t2, t2, a0
update_total_income:
	addi t1, t1, 1
	addi t0, t0, 8
	beq t1, t3, end_total_income
	j loop_total_income
end_total_income:
	ld ra, 0(sp)
	addi sp sp 8
	mv a0, t2
	
	#if no student code entered, a0 just returns 0 always :(
	
# End your  coding  here!
	
	ret
#######################end of nameOfMaxIncome_totalIncome###############################################
