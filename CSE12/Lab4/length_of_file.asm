length_of_file:
#function to find length of data read from file
#arguments: a1=bufferAdress holding file data
#return file length in a0
	
#Start your coding here

init_lenth_of_file:
	mv t3, a1 
loop_lenth_of_file:
	lbu t3, (a1) 
	bnez t3, update_lenth_of_file 		
	beqz t3, end_lenth_of_file

update_lenth_of_file:
	addi a1, a1, 1
	addi t2, t2, 1
	j loop_lenth_of_file
end_lenth_of_file:
	mv a0 t2


#if no student code provided, this function just returns 0 in a0

#End your coding here
	
	ret
#######################end of length_of_file###############################################	
