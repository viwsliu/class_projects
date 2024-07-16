# Tic Tac Toe

rowA = [' ',' ',' ']
rowB = [' ',' ',' ']
rowC = [' ',' ',' ']
playerNum = 1
turns = 1


def board(rowA, rowB, rowC):
    print("  0 | 1 | 2")
    print("A", rowA[0],"|",rowA[1],"|",rowA[2])
    print("  --+---+--")
    print("B", rowB[0],"|",rowB[1],"|",rowB[2])
    print("  --+---+--")
    print("C", rowC[0],"|",rowC[1],"|",rowC[2])
    
    return

def main():
  global playerNum, turns
  board(rowA, rowB, rowC)
  print("Turn:", turns)
  placement = input(f"Player #{playerNum} select an coordinate: ")
  if PlaceThing(turns, playerNum, placement):
      if CheckForWin():
          board(rowA, rowB, rowC)
          print(f"Player #{playerNum} wins!")
          return
      
      turns += 1
      playerNum = 2 if playerNum == 1 else 1
  
  if turns > 9:
      board(rowA, rowB, rowC)
      print("It's a tie!")
      return
  
  print("------------------------------------------")
  main()

def PlaceThing(turns, playerNum, placement):
  if(len(placement)!=2):
    print("Please type a proper input!")
    return False
  row = placement[0].upper()
  column = int(placement[1])
  if (row == 'A'):
    if rowA[column] == 'X' or rowA[column] == 'O':
      print("Invalid Placement!")
      return False
    elif(playerNum == 1):
      rowA[column] = 'X'
      return True
    elif(playerNum == 2):
      rowA[column] = 'O'
      return True
  elif (row == 'B'):
    if rowB[column] == 'X' or rowB[column] == 'O':
      print("Invalid Placement!")
      return False
    elif(playerNum == 1):
      rowB[column] = 'X'
      return True
    elif(playerNum == 2):
      rowB[column] = 'O'
      return True
  elif (row == 'C'):
    if rowC[column] == 'X' or rowC[column] == 'O':
      print("Invalid Placement!")
      return False
    elif(playerNum == 1):
      rowC[column] = 'X'
      return True
    elif(playerNum == 2):
      rowC[column] = 'O'
      return True

def CheckForWin():
    for row in [rowA, rowB, rowC]:
        if row[0] == row[1] == row[2] and row[0] != ' ':
            return True
    
    for col in range(3):
        if rowA[col] == rowB[col] == rowC[col] and rowA[col] != ' ':
            return True
    
    if rowA[0] == rowB[1] == rowC[2] and rowA[0] != ' ':
        return True
    if rowA[2] == rowB[1] == rowC[0] and rowA[2] != ' ':
        return True
    
    return False

main()