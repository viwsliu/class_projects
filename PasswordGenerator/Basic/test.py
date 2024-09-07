import string
import random

def passwordGenerator():
  length = int(input("Please type in the desired length of your password: "))
  print(
    '''Choose character set for password from these : 
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
  choice = input("Would you like to save this password? (Yes/No): ")
  choice = choice.lower()
  if(choice == "yes"):
    filename = 'test'
    print('Saved into file:', filename)
    #do stuff save into text file
  else:
    print("Password NOT Saved!")
    return


passwordGenerator()

