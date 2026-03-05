import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TwitterSearchDto {
  @ApiProperty({
    description: 'Search query for tweets',
    example: 'APTOS',
  })
  @IsString()
  query: string;
}

export class GetAllBatchesDto {
  @ApiProperty({
    description: 'Limit',
    example: 10,
  })
  @IsNumber()
  limit: number;
}
