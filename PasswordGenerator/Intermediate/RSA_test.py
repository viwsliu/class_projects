from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# 1. Generate RSA keys (private and public)
key = RSA.generate(2048)
private_key = key.export_key()
public_key = key.publickey().export_key()

# Save keys to files
with open('private.pem', 'wb') as f:
    f.write(private_key)

with open('public.pem', 'wb') as f:
    f.write(public_key)

# 2. AES encryption (Symmetric Encryption for larger data)
try:
    with open('password.txt', 'r+') as file:
        content = file.read()  # Read the content of password.txt
        if not content:
            print("Nothing in txt file")
        else:
            # AES Encryption
            content_bytes = content.encode('utf-8')  # Convert content to bytes
            aes_key = get_random_bytes(16)  # Generate AES key (16 bytes)
            cipher_aes = AES.new(aes_key, AES.MODE_CBC)  # AES in CBC mode
            ciphertext_aes = cipher_aes.encrypt(pad(content_bytes, AES.block_size))  # Pad content and encrypt

            # Encrypt the AES key with RSA
            public_key = RSA.import_key(open('public.pem', 'rb').read())
            cipher_rsa = PKCS1_OAEP.new(public_key)
            encrypted_aes_key = cipher_rsa.encrypt(aes_key)  # Encrypt the AES key

            # Save the encrypted AES key, IV (initialization vector), and ciphertext to a file
            with open('encrypted_data.bin', 'wb') as encrypted_file:
                encrypted_file.write(encrypted_aes_key + cipher_aes.iv + ciphertext_aes)  # Write AES key + IV + ciphertext
            print("Encryption successful! Encrypted data saved to 'encrypted_data.bin'.")
except Exception as e:
    print("Error during encryption:", e)

# 3. Decrypt the data using the RSA private key and AES
try:
    with open('encrypted_data.bin', 'rb') as encrypted_file:
        encrypted_data = encrypted_file.read()

    private_key = RSA.import_key(open('private.pem', 'rb').read())
    cipher_rsa = PKCS1_OAEP.new(private_key)

    # Extract the encrypted AES key, IV, and ciphertext from the file
    encrypted_aes_key = encrypted_data[:256]  # RSA-encrypted AES key (256 bytes for 2048-bit RSA)
    iv = encrypted_data[256:272]  # AES IV (16 bytes)
    ciphertext_aes = encrypted_data[272:]  # The rest is the AES-encrypted data

    # Decrypt the AES key with RSA
    aes_key = cipher_rsa.decrypt(encrypted_aes_key)

    # AES Decryption
    cipher_aes = AES.new(aes_key, AES.MODE_CBC, iv)
    decrypted_message = unpad(cipher_aes.decrypt(ciphertext_aes), AES.block_size)

    print("Decrypted message:", decrypted_message.decode('utf-8'))  # Convert bytes back to string and print
except Exception as e:
    print("Error during decryption:", e)
