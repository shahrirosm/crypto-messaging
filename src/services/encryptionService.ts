import _sodium from 'libsodium-wrappers'

export interface EncryptedMessage {
  ciphertext: string
  nonce: string
  publicKey: string
}

await _sodium.ready
const sodium = _sodium

export async function encryptMessage(
  message: string,
  recipientPublicKeyHex: string,
): Promise<EncryptedMessage> {
  await sodium.ready
  console.log(message)
  console.log(recipientPublicKeyHex)
  const messageBytes = sodium.from_string(message)
  const recipientPublicKey = sodium.from_hex(recipientPublicKeyHex)

  const { publicKey, privateKey } = sodium.crypto_box_keypair()
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
  const ciphertext = sodium.crypto_box_easy(messageBytes, nonce, recipientPublicKey, privateKey)
  console.log(ciphertext)
  return {
    ciphertext: sodium.to_hex(ciphertext),
    nonce: sodium.to_hex(nonce),
    publicKey: sodium.to_hex(publicKey),
  }
}

export async function decryptMessage(
  ciphertextHex: string,
  nonceHex: string,
  senderPublicKeyHex: string,
  recipientPrivateKeyHex: string,
): Promise<string> {
  await sodium.ready

  const ciphertext = sodium.from_hex(ciphertextHex)
  const nonce = sodium.from_hex(nonceHex)
  const senderPublicKey = sodium.from_hex(senderPublicKeyHex)
  const recipientPrivateKey = sodium.from_hex(recipientPrivateKeyHex)

  const decryptedMessageBytes = sodium.crypto_box_open_easy(
    ciphertext,
    nonce,
    senderPublicKey,
    recipientPrivateKey,
  )

  return sodium.to_string(decryptedMessageBytes)
}
