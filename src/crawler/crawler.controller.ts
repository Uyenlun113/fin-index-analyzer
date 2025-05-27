import { Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';

/**
 * Controller cho crawler API endpoints
 * Cung cấp khả năng crawler thủ công và kiểm tra trạng thái
 */
@ApiTags('crawler')
@Controller('crawler')
export class CrawlerController {
  private readonly logger = new Logger(CrawlerController.name);

  constructor(private readonly crawlerService: CrawlerService) {}
  @Post('start')
  @ApiOperation({
    summary: 'Chạy crawler thủ công',
  })
  async startCrawling() {
    this.logger.log('🎯 Manual crawl requested via API');
    const result = await this.crawlerService.crawlNow();

    return {
      ...result,
      endpoint: '/crawler/start',
      timestamp: new Date(),
    };
  }

  /**
   * GET /crawler/status - Kiểm tra trạng thái crawler
   */
  @Get('status')
  @ApiOperation({
    summary: 'Kiểm tra trạng thái crawler',
  })
  getStatus() {
    return {
      success: true,
      data: this.crawlerService.getStatus(),
      timestamp: new Date(),
    };
  }
}
