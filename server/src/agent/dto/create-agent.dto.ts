import { IsString, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  walletAddress: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
