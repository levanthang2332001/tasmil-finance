import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './service/dashboard.service';
import { parseCsvQuery, parseDashboardPeriod } from './dashboard.types';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('market-overview')
  @ApiOperation({
    summary: 'Get market overview',
    description:
      'Retrieve current market overview with key financial instruments',
  })
  @ApiQuery({
    name: 'symbols',
    required: false,
    description:
      'Comma-separated list of symbols (default: popular crypto and stocks)',
    example: 'BTCUSD,ETHUSD,AAPL,GOOGL',
  })
  getMarketOverview(@Query('symbols') symbolsQuery?: string) {
    const symbols = parseCsvQuery(symbolsQuery);
    return this.dashboardService.getMarketOverview(
      symbols.length > 0 ? symbols.join(',') : undefined,
    );
  }

  @Get('price-history')
  @ApiOperation({
    summary: 'Get price history',
    description: 'Retrieve historical price data for a given symbol',
  })
  @ApiQuery({
    name: 'symbol',
    required: true,
    description: 'The symbol to get price history for',
    example: 'AAPL',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'The period to get price history for',
    example: '1D',
  })
  getPriceHistory(
    @Query('symbol') symbol: string,
    @Query('period') period?: string,
  ) {
    return this.dashboardService.getPriceHistory(
      symbol,
      parseDashboardPeriod(period),
    );
  }

  @Get('trending-symbols')
  @ApiOperation({
    summary: 'Get trending symbols',
    description: 'Retrieve trending symbols',
  })
  getTrendingSymbols() {
    return this.dashboardService.getTrendingSymbols();
  }

  @Get('compare-symbols')
  @ApiOperation({
    summary: 'Compare symbols',
    description: 'Compare symbols',
  })
  getCompareSymbols(
    @Query('symbols') symbols: string,
    @Query('period') period?: string,
  ) {
    return this.dashboardService.compareSymbols(
      parseCsvQuery(symbols),
      parseDashboardPeriod(period),
    );
  }
}
