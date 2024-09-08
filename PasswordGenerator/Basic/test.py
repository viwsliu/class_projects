import string
import random

def passwordGenerator():
  length = int(input("Please type in the desired length of your password: "))
  print(
    '''Choose character set(s) to include in password : 
    1. Letters
    2. Digits
    3. Special characters
    4. Exit'''
    )
  characterList = ""
  while(True):
      choice = int(input("Pick a number: "))
      if(choice == 1):
          characterList += string.ascii_letters
      elif(choice == 2):
          characterList += string.digits
      elif(choice == 3):
          characterList += string.punctuation
      elif(choice == 4):
          break
      else:
          print("Please pick a valid option!")
  password = []
  for i in range(length):
      randomchar = random.choice(characterList)
      password.append(randomchar)

  print("The random password is " + "".join(password))
  askSave(password)

def askSave(password):
  while (True):
    choice = input("Would you like to save this password? (Yes/No): ")
    choice = choice.lower()
    if(choice == "yes" or choice == "y"):
      output = ''
      for i in password:
         output = output + i
      with open('test.txt', 'a') as file:
        file.write(output + '\n')
      print('Saved into file: test.txt')
      break
    elif(choice == "n" or choice == "no"):
      print("Password NOT Saved!")
      break
    else:
       print("Please type 'yes' or 'no'")


passwordGenerator()

