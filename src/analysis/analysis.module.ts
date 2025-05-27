import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IndexSchema, MarketIndex } from 'src/indices/index.schema';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MarketIndex.name, schema: IndexSchema }])],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
