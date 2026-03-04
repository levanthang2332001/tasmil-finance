import { Injectable, Logger } from '@nestjs/common';
import { TwitterApiService } from '../api/twitter';
import { TwitterSearchDto } from '../dto/community.dto';
import { TwitterApiResponse } from '../interface';
// import { convertToCustomFormat } from '../utils';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(private readonly twitterApiService: TwitterApiService) {}

  async searchTweets(searchDto: TwitterSearchDto): Promise<TwitterApiResponse> {
    this.logger.log(`Searching tweets for query: ${searchDto.query}`);

    const response = await this.twitterApiService.searchTweets({
      query: searchDto.query,
    });

    return response as TwitterApiResponse;
  }
}
