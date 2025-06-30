import { Injectable } from '@nestjs/common';
import { Ed25519PublicKey, Ed25519Signature } from '@aptos-labs/ts-sdk';

interface IVerifyEd25519Signature {
  publicKey: string;
  message: string;
  signature: string;
}

@Injectable()
export class AuthService {
  verifyEd25519Signature(params: IVerifyEd25519Signature): boolean {
    try {
      const { publicKey, message, signature } = params;

      const pubkey = new Ed25519PublicKey(publicKey);
      const sig = new Ed25519Signature(signature);
      const encodedMsg = new TextEncoder().encode(message);

      const isValid = pubkey.verifySignature({
        message: encodedMsg,
        signature: sig,
      });

      if (!isValid) {
        return false;
      }

      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  // async isValidNonce(address: string, nonce: string): Promise<boolean> {

  // }
}
