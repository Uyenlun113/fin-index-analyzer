import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

// Feature modules
import { AnalysisModule } from './analysis/analysis.module';
import { CrawlerModule } from './crawler/crawler.module';
import { IndicesModule } from './indices/indices.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-crawler',
    ),
    ScheduleModule.forRoot(),
    CrawlerModule,
    IndicesModule,
    AnalysisModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
