import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalysisModule } from '../analysis/analysis.module';
import { IndexSchema, MarketIndex } from './index.schema';
import { IndicesController } from './indices.controller';
import { IndicesService } from './indices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MarketIndex.name, schema: IndexSchema }]),
    AnalysisModule,
  ],
  controllers: [IndicesController],
  providers: [IndicesService],
  exports: [IndicesService],
})
export class IndicesModule {}
