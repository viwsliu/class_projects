from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad

def encrypt_file(input_file, output_file):
    with open(input_file, 'r+') as file:
        content = file.read()
        if not content:
            print("Nothing in txt file")
            return
        content_bytes = content.encode('utf-8')

    # AES encryption
    aes_key = get_random_bytes(16)
    cipher_aes = AES.new(aes_key, AES.MODE_CBC)
    ciphertext_aes = cipher_aes.encrypt(pad(content_bytes, AES.block_size))

    # RSA encryption of AES key
    public_key = RSA.import_key(open('public.pem', 'rb').read())
    cipher_rsa = PKCS1_OAEP.new(public_key)
    encrypted_aes_key = cipher_rsa.encrypt(aes_key)

    # Save encrypted AES key, IV, and ciphertext
    with open(output_file, 'wb') as encrypted_file:
        encrypted_file.write(encrypted_aes_key + cipher_aes.iv + ciphertext_aes)

    print(f"File '{input_file}' encrypted and saved to '{output_file}'.")
