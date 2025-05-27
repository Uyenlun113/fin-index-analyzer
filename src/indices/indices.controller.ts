import { Controller, Get, HttpException, HttpStatus, Logger, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IndexResponseDto } from './index.dto';
import { IndicesService } from './indices.service';
import { AnalysisService } from 'src/analysis/analysis.service';

@ApiTags('indices')
@Controller('indices')
export class IndicesController {
  private readonly logger = new Logger(IndicesController.name);

  constructor(
    private readonly indicesService: IndicesService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả chỉ số thị trường',
  })
  async getAllIndices(): Promise<any> {
    try {
      const indices = await this.indicesService.findAll();
      const analysis = await this.analysisService.analyzeAllIndices();

      return {
        success: true,
        data: {
          indices,
          analysis,
          summary: {
            totalIndices: indices.length,
            lastUpdated: indices.length > 0 ? indices[0].timestamp : null,
            recommendations: {
              buy: analysis.filter(a => a.recommendation === 'BUY').length,
              sell: analysis.filter(a => a.recommendation === 'SELL').length,
              hold: analysis.filter(a => a.recommendation === 'HOLD').length,
            },
          },
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`❌ Error getting all indices: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: 'Failed to retrieve indices data',
          details: error.message,
          timestamp: new Date(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':symbol')
  @ApiOperation({
    summary: 'Lấy dữ liệu chỉ số cụ thể',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Symbol của chỉ số thị trường',
    enum: ['^DJI', '^GSPC', '^IXIC'],
    example: '^DJI',
  })
  async getIndexBySymbol(@Param('symbol') symbol: string): Promise<any> {
    try {
      const validSymbols = ['^DJI', '^GSPC', '^IXIC'];
      if (!validSymbols.includes(symbol)) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid symbol',
            validSymbols,
            timestamp: new Date(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const index = await this.indicesService.findBySymbol(symbol);
      if (!index) {
        throw new HttpException(
          {
            success: false,
            error: 'Index not found',
            symbol,
            timestamp: new Date(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const analysis = await this.analysisService.analyzeIndex(symbol);
      const historicalData = await this.indicesService.findHistoricalData(symbol, 5);

      return {
        success: true,
        data: {
          currentData: index,
          analysis,
          historicalData,
          metadata: {
            symbol,
            dataPoints: historicalData.length,
            lastUpdated: index.timestamp,
          },
        },
        timestamp: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`❌ Error getting index ${symbol}: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: 'Failed to retrieve index data',
          symbol,
          details: error.message,
          timestamp: new Date(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
