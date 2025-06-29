import { Ed25519PublicKey, Ed25519Signature } from '@aptos-labs/ts-sdk';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import * as forge from 'node-forge';
import { sign, Secret, SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthApiDocs } from '../../chat/docs/auth/auth-api.docs';
import { ApiTags } from '@nestjs/swagger';
import { RedisCacheService } from 'src/redis/services/redisCacheService';
dotenv.config();

const NONCE_STORE: {
  [key: string]: {
    nonceHex: string;
    createdAt: number;
    expiresAt: number;
  };
} = {};

const NONCE_EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly jwtSecret: Secret;

  constructor(private readonly redisCache: RedisCacheService) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  @Get('get-nonce')
  @AuthApiDocs.getNonce.operation
  @AuthApiDocs.getNonce.query
  @AuthApiDocs.getNonce.okResponse
  @AuthApiDocs.getNonce.badRequestResponse
  @AuthApiDocs.getNonce.internalServerErrorResponse
  getNonce(@Query('address') address: string) {
    try {
      const nonce = forge.random.getBytesSync(16);
      const nonceHex = forge.util.bytesToHex(nonce);
      NONCE_STORE[address] = {
        nonceHex,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
      };

      // const result = await this.redisCache.set(address, nonceHex, 3 * 60);
      return {
        success: true,
        nonce: nonceHex,
        message: 'Nonce generated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('verify-signature')
  @AuthApiDocs.verifySignature.operation
  @AuthApiDocs.verifySignature.body
  @AuthApiDocs.verifySignature.okResponse
  @AuthApiDocs.verifySignature.unauthorizedResponse
  @AuthApiDocs.verifySignature.badRequestResponse
  verifySignature(
    @Body()
    body: {
      walletAddress: string;
      publicKey: string;
      signature: string;
      message: string;
    },
  ) {
    const { walletAddress, publicKey, signature, message } = body;
    const nonce = NONCE_STORE[walletAddress]?.nonceHex;

    if (!nonce || !message.includes(nonce)) {
      throw new UnauthorizedException('Invalid nonce');
    }

    if (Date.now() > NONCE_STORE[walletAddress]?.expiresAt) {
      throw new UnauthorizedException('Nonce expired');
    }

    try {
      const pubkey = new Ed25519PublicKey(publicKey);
      const sig = new Ed25519Signature(signature);
      const encodedMsg = new TextEncoder().encode(message);

      const isValid = pubkey.verifySignature({
        message: encodedMsg,
        signature: sig,
      });

      if (!isValid) {
        throw new UnauthorizedException('Invalid signature');
      }

      const signOptions: SignOptions = {
        expiresIn: NONCE_EXPIRATION_TIME,
      };
      const token = sign({ walletAddress }, this.jwtSecret, signOptions);

      delete NONCE_STORE[walletAddress];

      return {
        success: true,
        token: token,
        message: 'Signature verified successfully',
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Signature verification failed: ' + (error as Error).message,
      );
    }
  }
}
