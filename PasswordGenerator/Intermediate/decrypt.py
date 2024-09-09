from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Util.Padding import unpad

def decrypt_file(input_file):
    with open(input_file, 'rb') as encrypted_file:
        encrypted_data = encrypted_file.read()

    private_key = RSA.import_key(open('private.pem', 'rb').read())
    cipher_rsa = PKCS1_OAEP.new(private_key)

    # Extract encrypted AES key, IV, and ciphertext
    encrypted_aes_key = encrypted_data[:256]
    iv = encrypted_data[256:272]
    ciphertext_aes = encrypted_data[272:]

    # Decrypt AES key using RSA
    aes_key = cipher_rsa.decrypt(encrypted_aes_key)

    # AES decryption
    cipher_aes = AES.new(aes_key, AES.MODE_CBC, iv)
    decrypted_message = unpad(cipher_aes.decrypt(ciphertext_aes), AES.block_size)

    return decrypted_message.decode('utf-8')
