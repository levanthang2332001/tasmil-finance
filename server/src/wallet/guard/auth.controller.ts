import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UnauthorizedException,
  // UseGuards,
} from '@nestjs/common';
import * as forge from 'node-forge';
import { sign, Secret, SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthApiDocs } from '../../chat/docs/auth/auth-api.docs';
import { ApiTags } from '@nestjs/swagger';
import { RedisCacheService } from 'src/redis/services/redisCacheService';
import { AuthService } from './service/auth.service';
// import { ApiKeyGuard } from './api-key.guard';
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
// @UseGuards(ApiKeyGuard)
export class AuthController {
  private readonly jwtSecret: Secret;
  private readonly authService: AuthService;

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
  async getNonce(@Query('address') address: string) {
    try {
      const nonce = forge.random.getBytesSync(16);
      const nonceHex = forge.util.bytesToHex(nonce);

      // Convert minutes to milliseconds for Redis TTL
      const ttlInMs = 3 * 60 * 1000;

      // Store in Redis with TTL in milliseconds
      await this.redisCache.set(address, nonceHex, ttlInMs);

      // Verify the value was stored
      const storedNonce = await this.redisCache.get(address);
      console.log('Stored nonce from Redis:', storedNonce);

      if (!storedNonce) {
        throw new Error('Failed to store nonce in Redis');
      }

      return {
        success: true,
        nonce: nonceHex,
        message: `Welcome to Tasmil Finance!\n\nPlease sign this message to authenticate.\n\nNonce: ${nonceHex}`,
      };
    } catch (error) {
      console.error('Error in getNonce:', error);
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
    const nonceStore = NONCE_STORE[walletAddress]?.nonceHex;

    if (!nonceStore || !message.includes(nonceStore)) {
      throw new UnauthorizedException('Invalid nonce');
    }

    if (Date.now() > NONCE_STORE[walletAddress]?.expiresAt) {
      throw new UnauthorizedException('Nonce expired');
    }

    try {
      const isVerified = this.authService.verifyEd25519Signature({
        publicKey,
        message,
        signature,
      });

      console.log('isVerified', isVerified);

      if (!isVerified) {
        throw new UnauthorizedException('Invalid signature');
      }

      const signOptions: SignOptions = {
        expiresIn: NONCE_EXPIRATION_TIME,
      };
      const token = sign({ walletAddress }, this.jwtSecret, signOptions);
      console.log('token', token);
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
