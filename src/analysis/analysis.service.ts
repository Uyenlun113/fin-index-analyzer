import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecommendationType } from 'src/common/enum/recommendation.enum';
import { AnalysisResult } from 'src/common/interfaces/analysis.interface';
import { IndexDocument, MarketIndex } from 'src/indices/index.schema';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(@InjectModel(MarketIndex.name) private indexModel: Model<IndexDocument>) {}

  async analyzeIndex(symbol: string): Promise<AnalysisResult | null> {
    try {
      this.logger.log(`🔍 Analyzing index: ${symbol}`);
      const historicalData = await this.indexModel
        .find({ symbol })
        .sort({ timestamp: -1 })
        .limit(10)
        .exec();

      if (historicalData.length < 5) {
        this.logger.warn(
          `⚠️ Not enough data for analysis: ${symbol} (${historicalData.length} records)`,
        );
        return null;
      }

      const currentData = historicalData[0];
      const previousData = historicalData.slice(1, 6);
      const averagePrice =
        previousData.reduce((sum, data) => sum + data.currentPrice, 0) / previousData.length;
      const priceComparison = ((currentData.currentPrice - averagePrice) / averagePrice) * 100;
      const recommendation = this.getRecommendation(priceComparison);
      const confidence = this.calculateConfidence(priceComparison, historicalData);

      const result: AnalysisResult = {
        symbol: currentData.symbol,
        name: currentData.name,
        currentPrice: currentData.currentPrice,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        priceComparison: parseFloat(priceComparison.toFixed(2)),
        recommendation,
        confidence,
        timestamp: new Date(),
      };

      this.logger.log(
        `✅ Analysis completed for ${symbol}: ${recommendation} (${confidence}% confidence)`,
      );
      return result;
    } catch (error) {
      this.logger.error(`❌ Analysis failed for ${symbol}: ${error.message}`);
      return null;
    }
  }

  /**
   * Phân tích tất cả chỉ số
   * Theo yêu cầu đề bài: Gửi kết quả phân tích qua API Restful và WebSocket
   */
  async analyzeAllIndices(): Promise<AnalysisResult[]> {
    this.logger.log('🔍 Analyzing all indices...');
    const symbols = ['^DJI', '^GSPC', '^IXIC'];
    const results: AnalysisResult[] = [];
    for (const symbol of symbols) {
      const analysis = await this.analyzeIndex(symbol);
      if (analysis) {
        results.push(analysis);
      }
    }
    this.logger.log(`✅ Completed analysis for ${results.length} indices`);
    return results;
  }

  /**
   * Xác định khuyến nghị dựa trên % thay đổi
   * Theo yêu cầu đề bài:
   * - Nếu giá hiện tại cao hơn trung bình 5% → Khuyến nghị bán
   * - Nếu giá hiện tại thấp hơn trung bình 5% → Khuyến nghị mua
   */
  private getRecommendation(priceComparison: number): RecommendationType {
    if (priceComparison > 5) {
      return RecommendationType.SELL;
    } else if (priceComparison < -5) {
      return RecommendationType.BUY;
    } else {
      return RecommendationType.HOLD;
    }
  }

  /**
   * Tính độ tin cậy của khuyến nghị
   * Dựa trên độ mạnh của trend và volatility của thị trường
   */
  private calculateConfidence(priceComparison: number, historicalData: IndexDocument[]): number {
    const volatility = this.calculatePriceVolatility(historicalData);
    const trendStrength = Math.abs(priceComparison);
    let confidence = Math.min(90, trendStrength * 8);
    confidence = Math.max(confidence - volatility * 3, 30);
    if (trendStrength > 10) {
      confidence = Math.min(confidence + 15, 95);
    }
    return parseFloat(confidence.toFixed(1));
  }

  /**
   * Tính độ biến động giá trong các phiên gần đây
   */
  private calculatePriceVolatility(data: IndexDocument[]): number {
    if (data.length < 2) return 0;

    const changes = data.slice(0, -1).map((current, index) => {
      const previous = data[index + 1];
      return Math.abs(
        ((current.currentPrice - previous.currentPrice) / previous.currentPrice) * 100,
      );
    });

    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return parseFloat(avgChange.toFixed(2));
  }
}
