import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { CreateIndexDto } from './index.dto';
import { IndexDocument, MarketIndex } from './index.schema';

@Injectable()
export class IndicesService {
  private readonly logger = new Logger(IndicesService.name);

  constructor(@InjectModel(MarketIndex.name) private indexModel: Model<IndexDocument>) {}

  /**
   * Tạo mới một record chỉ số
   */
  async create(createIndexDto: CreateIndexDto): Promise<IndexDocument> {
    try {
      const createdIndex = new this.indexModel({
        ...createIndexDto,
        timestamp: new Date(),
      });
      const saved = await createdIndex.save();
      this.logger.log(`✅ Created index record for ${createIndexDto.name}`);
      return saved;
    } catch (error: any) {
      this.logger.error(`❌ Failed to create index: ${error.message}`);
      throw error;
    }
  }
  async findAll(): Promise<IndexDocument[]> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $sort: { symbol: 1 as const, timestamp: -1 as -1 },
        },
        {
          $group: {
            _id: '$symbol',
            latestData: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$latestData' },
        },
        {
          $sort: { name: 1 as const },
        },
      ];

      const indices = await this.indexModel.aggregate(pipeline);
      this.logger.log(`📊 Retrieved ${indices.length} latest indices`);
      return indices;
    } catch (error: any) {
      this.logger.error(`❌ Failed to find all indices: ${error.message}`);
      throw error;
    }
  }

  async findBySymbol(symbol: string): Promise<IndexDocument | null> {
    try {
      const index = await this.indexModel.findOne({ symbol }).sort({ timestamp: -1 }).exec();

      if (index) {
        this.logger.log(`📈 Retrieved latest data for ${symbol}`);
      } else {
        this.logger.warn(`⚠️ No data found for symbol: ${symbol}`);
      }

      return index;
    } catch (error: any) {
      this.logger.error(`❌ Failed to find index ${symbol}: ${error.message}`);
      throw error;
    }
  }

  async findHistoricalData(symbol: string, limit: number = 10): Promise<IndexDocument[]> {
    try {
      const historicalData = await this.indexModel
        .find({ symbol })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();

      this.logger.log(`📊 Retrieved ${historicalData.length} historical records for ${symbol}`);
      return historicalData;
    } catch (error: any) {
      this.logger.error(`❌ Failed to get historical data for ${symbol}: ${error.message}`);
      throw error;
    }
  }

  async cleanOldData(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.indexModel.deleteMany({
        timestamp: { $lt: cutoffDate },
      });

      this.logger.log(`🧹 Cleaned ${result.deletedCount} old records`);
      return result.deletedCount;
    } catch (error: any) {
      this.logger.error(`❌ Failed to clean old data: ${error.message}`);
      throw error;
    }
  }
}
