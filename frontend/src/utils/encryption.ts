import CryptoJS from "crypto-js";
import forge from "node-forge";
import { API_ENDPOINT } from "../config";

export interface EncryptedCredentials {
  encrypted_data: string;
  encrypted_key: string;
  iv: string;
}

/**
 * Encrypts credentials using hybrid RSA+AES encryption
 * @param credentials - The credentials to encrypt
 * @param publicKeyPem - The server's RSA public key in PEM format
 * @returns The encrypted credentials
 */
export function encryptCredentials(
  credentials: { username: string; password: string },
  publicKeyPem: string
): EncryptedCredentials {
  try {
    // 1. Generate a random 256-bit AES key
    const aesKey = CryptoJS.lib.WordArray.random(32); // 256 bits

    // 2. Generate a random IV for AES
    const iv = CryptoJS.lib.WordArray.random(16); // 128 bits

    // 3. Convert credentials to JSON and encrypt with AES
    const credentialsJson = JSON.stringify(credentials);
    const encrypted = CryptoJS.AES.encrypt(credentialsJson, aesKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 4. Convert AES key to hexadecimal string
    const aesKeyHex = aesKey.toString(CryptoJS.enc.Hex);

    // 5. Encrypt the AES key with the RSA public key
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedKey = publicKey.encrypt(aesKeyHex, "RSA-OAEP", {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(forge.md.sha256.create()),
    });

    return {
      encrypted_data: encrypted.toString(),
      encrypted_key: forge.util.encode64(encryptedKey),
      iv: iv.toString(CryptoJS.enc.Hex),
    };
  } catch (error) {
    console.error("Error encrypting credentials:", error);
    throw new Error("Failed to encrypt credentials");
  }
}

/**
 * Fetches the server's public key
 * @returns The RSA public key in PEM format
 */
export async function getServerPublicKey(): Promise<string> {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/public-key`);

    if (!response.ok) {
      throw new Error("Failed to fetch public key");
    }

    const data = await response.json();
    return data.public_key;
  } catch (error) {
    console.error("Error fetching server public key:", error);
    throw new Error("Failed to fetch server public key");
  }
}
