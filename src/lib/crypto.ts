// src/lib/crypto.ts

import CryptoJS from 'crypto-js';

// A "salt" is a random string that makes the derived key stronger.
// In a real production app, this might be handled differently, but for this project, it's fine here.
const SALT = 'your-unique-and-secret-salt-goes-here';

/**
 * Derives a strong encryption key from the user's master password.
 * This key is never sent to the server.
 * @param masterPassword The user's main login password.
 * @returns A string representing the derived encryption key.
 */
export const deriveKey = (masterPassword: string): string => {
  return CryptoJS.PBKDF2(masterPassword, SALT, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
};

/**
 * Encrypts a piece of data using the derived key.
 * @param data The plaintext data to encrypt (e.g., a password, username).
 * @param key The derived encryption key.
 * @returns The encrypted data as a string.
 */
export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypts a piece of data using the derived key.
 * @param encryptedData The encrypted data string from the server.
 * @param key The derived encryption key.
 * @returns The original, plaintext data.
 */
export const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};