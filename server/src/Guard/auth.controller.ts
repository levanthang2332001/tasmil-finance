import { Ed25519PublicKey, Ed25519Signature } from '@aptos-labs/ts-sdk';
import { Controller, Get, Post, Body, Query, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const NONCE_STORE = {};

@Controller('auth')
export class AuthController {
  private readonly jwtSecret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  @Get('get-nonce')
  getNonce(@Query('address') address: string) {
    try {
      const nonce = Math.floor(Math.random() * 1000000).toString();
      NONCE_STORE[address] = nonce;
      return {
        success: true,
        nonce: nonce,
        message: 'Nonce generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Post('verify-signature')
  async verifySignature(
    @Body() body: { walletAddress: string; publicKey: string; signature: string; message: string }
  ) {
    const { walletAddress, publicKey, signature, message } = body;
    const nonce = NONCE_STORE[walletAddress];
    if (!nonce || !message.includes(nonce)) {
      throw new UnauthorizedException('Invalid nonce');
    }

    try {
      const pubkey = new Ed25519PublicKey(publicKey);
      const sig = new Ed25519Signature(signature);
      const encodedMsg = new TextEncoder().encode(message);

      const isValid = pubkey.verifySignature({ message: encodedMsg, signature: sig });

      if (!isValid) { throw new UnauthorizedException('Invalid signature'); }

      const token = jwt.sign({ walletAddress }, this.jwtSecret, { expiresIn: '1h' });

      return {
        success: true,
        token: token,
        message: 'Signature verified successfully'
      };
    } catch (error) {
      throw new UnauthorizedException('Signature verification failed');
    }
  }
}