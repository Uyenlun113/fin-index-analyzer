import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalysisModule } from '../analysis/analysis.module';

import { IndexSchema, MarketIndex } from 'src/indices/index.schema';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { WebsocketModule } from 'src/websocket/websocket.module';

/**
 * Module cho crawler system
 * Theo yêu cầu đề bài: Crawler dữ liệu từ Yahoo Finance và tích hợp WebSocket
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: MarketIndex.name, schema: IndexSchema }]),
    WebsocketModule, // Để gửi real-time updates
    AnalysisModule, // Để thực hiện phân tích sau khi crawl
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
