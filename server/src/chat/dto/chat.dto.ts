import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { DeFiIntentSchema } from '../docs/schemas';

export class ChatRequestDto {
  @ApiProperty({
    example: '0x1234567890abcdef...',
    description: 'Tasmil address',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  user_address: string;

  @ApiProperty({
    example: 'I want to swap 100 USDT to ETH',
    description: 'The message content from the user',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}

export class ChatResponseDto {
  @ApiProperty({
    example: 'Action processed successfully',
    description: 'Response message from the chat system',
  })
  message: string;

  @ApiProperty({
    description: 'Extracted DeFi intent from the message',
    type: DeFiIntentSchema,
    required: false,
  })
  intent?: DeFiIntentSchema;

  @ApiProperty({
    example: {
      transactionHash: '0x1234567890abcdef...',
      estimatedGas: '150000',
      slippage: '0.5%',
    },
    description: 'Additional data returned from the action',
    required: false,
  })
  data?: any;
}
