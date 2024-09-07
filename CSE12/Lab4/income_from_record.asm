income_from_record:
#function to return numerical income from a specific record
#e.g. for record "Microsoft,34\r\n", income to return is 34(for which name is Microsoft)

#arguments:	a0 contains pointer to start of numerical income in record 

#function RETURNS income numerical value of the asci income in a0 (34 in our example)
	
# Start your coding from here!

init_income_from_record:

	li t6, '\r'
	li t4, 10
	li t5, 0
loop_income_from_record:
	lbu t0, 0(a0)
	beq t0, t6, done_income_from_record
	addi t0, t0, -48 #convert from ascii to decimal
	
	#n*10^i
	mul t5, t5, t4
	add t5, t5, t0

update_income_from_record:
	addi a0, a0, 1
	j loop_income_from_record

done_income_from_record:
	mv a0, t5

	#if no student code entered, a0 just returns 0 always :(
	
# End your  coding  here!
	ret
	
#######################end of income_from_record###############################################	
