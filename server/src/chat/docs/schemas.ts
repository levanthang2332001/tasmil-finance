import { ApiProperty } from '@nestjs/swagger';

export class SwapParamsSchema {
  @ApiProperty({
    example: 'USDT',
    description: 'Source token for the swap',
  })
  fromToken: string;

  @ApiProperty({
    example: 'ETH',
    description: 'Destination token for the swap',
  })
  toToken: string;

  @ApiProperty({
    example: 100,
    description: 'Amount to swap',
    type: 'number',
  })
  amount: number;
}

export class LiquidityParamsSchema {
  @ApiProperty({
    example: 'USDT',
    description: 'First token for liquidity provision',
  })
  tokenA: string;

  @ApiProperty({
    example: 'ETH',
    description: 'Second token for liquidity provision',
  })
  tokenB: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount of token A',
    type: 'number',
  })
  amountA: number;

  @ApiProperty({
    example: 0.5,
    description: 'Amount of token B',
    type: 'number',
  })
  amountB: number;
}

export class StakingParamsSchema {
  @ApiProperty({
    example: 'USDT',
    description: 'Token to stake',
  })
  token: string;

  @ApiProperty({
    example: 500,
    description: 'Amount to stake',
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    example: 30,
    description: 'Staking duration in days (optional)',
    type: 'number',
    required: false,
  })
  duration?: number;
}

export class BorrowParamsSchema {
  @ApiProperty({
    example: 'USDC',
    description: 'Token to borrow',
  })
  token: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount to borrow',
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    example: 'ETH',
    description: 'Collateral token (optional)',
    required: false,
  })
  collateralToken?: string;

  @ApiProperty({
    example: 1.5,
    description: 'Collateral amount (optional)',
    type: 'number',
    required: false,
  })
  collateralAmount?: number;

  @ApiProperty({
    example: 75,
    description: 'Loan-to-value ratio in percentage (optional)',
    type: 'number',
    required: false,
  })
  ltv?: number;
}

export class LendingParamsSchema {
  @ApiProperty({
    example: 'USDC',
    description: 'Token to lend/supply',
  })
  token: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount to lend',
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    example: 30,
    description: 'Lending duration in days (optional)',
    type: 'number',
    required: false,
  })
  duration?: number;

  @ApiProperty({
    example: 5.5,
    description: 'Desired minimum interest rate in percentage (optional)',
    type: 'number',
    required: false,
  })
  interestRate?: number;
}

export class RemoveLiquidityParamsSchema {
  @ApiProperty({
    example: 'USDT',
    description: 'First token in the liquidity pair',
  })
  tokenA: string;

  @ApiProperty({
    example: 'ETH',
    description: 'Second token in the liquidity pair',
  })
  tokenB: string;

  @ApiProperty({
    example: 50,
    description: 'Amount of LP tokens to remove',
    type: 'number',
  })
  liquidityAmount: number;

  @ApiProperty({
    example: 100,
    description: 'Minimum amount of tokenA to receive (optional)',
    type: 'number',
    required: false,
  })
  minAmountA?: number;

  @ApiProperty({
    example: 0.05,
    description: 'Minimum amount of tokenB to receive (optional)',
    type: 'number',
    required: false,
  })
  minAmountB?: number;
}

export class DeFiIntentSchema {
  @ApiProperty({
    example: 'swap',
    description: 'Type of DeFi action',
    enum: [
      'swap',
      'liquidity',
      'staking',
      'borrow',
      'lending',
      'remove_liquidity',
      'unknown',
    ],
  })
  actionType:
    | 'swap'
    | 'liquidity'
    | 'staking'
    | 'borrow'
    | 'lending'
    | 'remove_liquidity'
    | 'unknown';

  @ApiProperty({
    description: 'Parameters for the action',
    oneOf: [
      { $ref: '#/components/schemas/SwapParamsSchema' },
      { $ref: '#/components/schemas/LiquidityParamsSchema' },
      { $ref: '#/components/schemas/StakingParamsSchema' },
      { $ref: '#/components/schemas/BorrowParamsSchema' },
      { $ref: '#/components/schemas/LendingParamsSchema' },
      { $ref: '#/components/schemas/RemoveLiquidityParamsSchema' },
    ],
  })
  params:
    | SwapParamsSchema
    | LiquidityParamsSchema
    | StakingParamsSchema
    | BorrowParamsSchema
    | LendingParamsSchema
    | RemoveLiquidityParamsSchema;

  @ApiProperty({
    example: 0.95,
    description: 'Confidence score of the intent extraction (0-1)',
    type: 'number',
    minimum: 0,
    maximum: 1,
  })
  confidence: number;

  @ApiProperty({
    example: ['amount'],
    description: 'Missing required fields for the action',
    type: 'array',
    items: { type: 'string' },
  })
  missingFields: string[];

  @ApiProperty({
    example: 'User wants to swap USDT for ETH',
    description: 'Context extracted from the message',
  })
  context: string;
}
