import tkinter as tk
from tkinter import filedialog, messagebox
from keygen import generate_keys
from encrypt import encrypt_file
from decrypt import decrypt_file

def generate_keys_gui():
    generate_keys()
    messagebox.showinfo("Info", "Keys generated successfully.")

def encrypt_file_gui():
    input_file = filedialog.askopenfilename(title="Select file to encrypt")
    if input_file:
        output_file = filedialog.asksaveasfilename(title="Save encrypted file as", defaultextension=".bin")
        if output_file:
            encrypt_file(input_file, output_file)
            messagebox.showinfo("Info", "File encrypted successfully.")

def decrypt_file_gui():
    input_file = filedialog.askopenfilename(title="Select encrypted file")
    if input_file:
        decrypted_message = decrypt_file(input_file)
        messagebox.showinfo("Decrypted Message", decrypted_message)

# Create the main window
root = tk.Tk()
root.title("Encryption/Decryption GUI")

# Create buttons for each function
generate_btn = tk.Button(root, text="Generate Keys", command=generate_keys_gui)
encrypt_btn = tk.Button(root, text="Encrypt File", command=encrypt_file_gui)
decrypt_btn = tk.Button(root, text="Decrypt File", command=decrypt_file_gui)

# Pack buttons
generate_btn.pack(pady=10)
encrypt_btn.pack(pady=10)
decrypt_btn.pack(pady=10)

# Run the main loop
root.mainloop()
