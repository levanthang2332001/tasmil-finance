import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TwitterSupabase } from 'src/supabase/twitter';
import { AiAnalysisBatch } from './interface';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly twitterSupabase: TwitterSupabase) {}

  @Get('batches')
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved batches',
    type: Array<AiAnalysisBatch>,
  })
  async getAllBatches(): Promise<AiAnalysisBatch[]> {
    return await this.twitterSupabase.getAllBatches();
  }

  @Get('tweets/:batch_id')
  @ApiOperation({ summary: 'Get tweets by batch ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tweets',
    type: Array<AiAnalysisBatch>,
  })
  async getTweetsByBatch(
    @Param('batch_id') batch_id: number,
  ): Promise<AiAnalysisBatch[]> {
    return await this.twitterSupabase.getTweetsByBatch(batch_id);
  }
}
