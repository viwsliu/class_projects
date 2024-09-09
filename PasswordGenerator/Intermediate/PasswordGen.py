import string
import random
import tkinter as tk
from tkinter import messagebox

def passwordGenerator():
  length = int(length_spinbox.get())
  characterList = ""
  if letters_var.get():
      characterList += string.ascii_letters
  if digits_var.get():
      characterList += string.digits
  if special_var.get():
      characterList += string.punctuation
  if not characterList:
      messagebox.showerror("No Character Set", "Please select at least one character set.")
      return

  password = ''.join(random.choice(characterList) for _ in range(length))
  password_entry.config(state='normal')
  password_entry.delete(0, tk.END)
  password_entry.insert(0, password)
  password_entry.config(state='readonly')

def askSave():
  password = password_entry.get()
  if password == "":
    messagebox.showerror("No Password", "No password generated yet.")
    return
  save_choice = messagebox.askyesno("Save Password", "Would you like to save this password?")
  if save_choice:
    with open('password.txt', 'r+') as file:
      content = file.read()
      if (password in content):
        messagebox.showerror("Error", 'Password already exists!')
      else:
        print(content)
        file.write(password + '\n')
        messagebox.showinfo("Saved", "Password saved to password.txt")
  
# Create the main window
root = tk.Tk()
root.title("Password Generator")
root.geometry("400x350")
root.eval('tk::PlaceWindow %s center' % root.winfo_toplevel()) #center

#vars
letters_var = tk.BooleanVar()
digits_var = tk.BooleanVar()
special_var = tk.BooleanVar()

#length,char sets, buttons, display
tk.Label(root, text="Password Length:").pack(pady=5)
length_spinbox = tk.Spinbox(root, from_=4, to=32, width=5)  # Allow lengths from 4 to 32
length_spinbox.pack(pady=5)
tk.Label(root, text="Choose character sets:").pack(pady=5)
tk.Checkbutton(root, text="Letters", variable=letters_var).pack()
tk.Checkbutton(root, text="Digits", variable=digits_var).pack()
tk.Checkbutton(root, text="Special characters", variable=special_var).pack()
generate_btn = tk.Button(root, text="Generate Password", command=passwordGenerator)
generate_btn.pack(pady=10)
tk.Label(root, text="Generated Password:").pack(pady=5)
password_entry = tk.Entry(root, state='readonly', width=30)
password_entry.pack(pady=5)
save_btn = tk.Button(root, text="Save Password", command=askSave)
save_btn.pack(pady=15, padx=20, fill=tk.X)


root.mainloop()
