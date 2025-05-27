import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import { AnalysisService } from '../analysis/analysis.service';
import { MarketData } from '../common/interfaces/market-data.interface';

import { IndexDocument, MarketIndex } from 'src/indices/index.schema';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly indices = [
    { name: 'Dow Jones Industrial Average', symbol: '^DJI' },
    { name: 'S&P 500', symbol: '^GSPC' },
    { name: 'NASDAQ Composite', symbol: '^IXIC' },
  ];

  constructor(
    @InjectModel(MarketIndex.name) private indexModel: Model<IndexDocument>,
    private websocketGateway: WebsocketGateway,
    private analysisService: AnalysisService,
  ) {}

  @Cron('0 */5 * * * *')
  async scheduledCrawl(): Promise<void> {
    if (!this.isMarketHours()) {
      this.logger.log('⏸️ Skipping crawler - Outside market hours');
      return;
    }

    await this.crawlMarketData();
  }

  async crawlMarketData(): Promise<void> {
    this.logger.log('🔄 Starting market data crawling...');
    const results: IndexDocument[] = [];
    for (const index of this.indices) {
      try {
        const data = await this.fetchMarketData(index.symbol);
        if (data) {
          const marketData: MarketData = {
            name: index.name,
            symbol: index.symbol,
            currentPrice: data.currentPrice || 0,
            openPrice: data.openPrice || 0,
            highPrice: data.highPrice || 0,
            lowPrice: data.lowPrice || 0,
            changePercent: data.changePercent || 0,
            volume: data.volume || 0,
            timestamp: new Date(),
          };
          const savedData = await this.saveMarketData(marketData);
          results.push(savedData);
          this.websocketGateway.broadcastMarketUpdate(marketData);
          this.logger.log(`✅ Successfully crawled and saved ${index.name}`);
        }
      } catch (error) {
        this.logger.error(`❌ Error crawling ${index.name}: ${error.message}`);
      }
    }
    if (results.length > 0) {
      try {
        const analysisResults = await this.analysisService.analyzeAllIndices();
        this.websocketGateway.broadcastAnalysisUpdate(analysisResults);
        this.logger.log(
          `📊 Analysis completed and broadcasted for ${analysisResults.length} indices`,
        );
      } catch (error) {
        this.logger.error(`❌ Error during analysis: ${error.message}`);
      }
    }
  }

  private async fetchMarketData(symbol: string): Promise<Partial<MarketData> | null> {
    try {
      this.logger.log(`📡 Fetching data for ${symbol} from Yahoo Finance...`);
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const apiTimeout = process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : 10000;
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: apiTimeout,
      });

      if (!response.data?.chart?.result?.[0]) {
        this.logger.warn(`⚠️ No data received for ${symbol}`);
        return null;
      }
      const result = response.data.chart.result[0];
      const quote = result.indicators?.quote?.[0];
      const meta = result.meta;
      if (!quote || !meta) {
        this.logger.warn(`⚠️ Invalid data structure for ${symbol}`);
        return null;
      }
      const latestIndex = quote.open.length - 1;
      const marketData = {
        currentPrice: meta.regularMarketPrice || meta.previousClose || 0,
        openPrice: quote.open[latestIndex] || meta.previousClose || 0,
        highPrice: quote.high[latestIndex] || meta.regularMarketPrice || 0,
        lowPrice: quote.low[latestIndex] || meta.regularMarketPrice || 0,
        changePercent: parseFloat(
          (
            (((meta.regularMarketPrice || meta.previousClose || 0) - (meta.previousClose || 0)) /
              (meta.previousClose || 1)) *
            100
          ).toFixed(2),
        ),
        volume: quote.volume[latestIndex] || 0,
      };
      return marketData;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        this.logger.error(`⏰ Timeout fetching data for ${symbol}`);
      } else if (error.response?.status) {
        this.logger.error(
          `🚫 HTTP ${error.response.status} error for ${symbol}: ${error.response.statusText}`,
        );
      } else {
        this.logger.error(`❌ Failed to fetch data for ${symbol}: ${error.message}`);
      }
      return null;
    }
  }

  private async saveMarketData(data: MarketData): Promise<IndexDocument> {
    try {
      const newIndex = new this.indexModel(data);
      const savedData = await newIndex.save();
      return savedData;
    } catch (error: any) {
      this.logger.error(`❌ Failed to save data for ${data.name}: ${error.message}`);
      throw error;
    }
  }

  async crawlNow(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      await this.crawlMarketData();
      return {
        success: true,
        message: 'Crawling completed successfully',
        data: {
          timestamp: new Date(),
          indicesProcessed: this.indices.length,
        },
      };
    } catch (error: any) {
      this.logger.error(`❌ Manual crawl failed: ${error.message}`);
      return {
        success: false,
        message: `Crawling failed: ${error.message}`,
      };
    }
  }

  /**
   * Kiểm tra giờ giao dịch thị trường
   */
  private isMarketHours(): boolean {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const dayOfWeek = now.getUTCDay();
    // Convert to EST (UTC-5, simplified)
    const estHours = (utcHours - 5 + 24) % 24;
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    // Market hours: 9:30 AM - 4:00 PM EST
    return estHours >= 9 && estHours <= 16 && !(estHours === 9 && now.getUTCMinutes() < 30);
  }

  /**
   * Lấy thông tin trạng thái crawler
   */
  getStatus(): any {
    return {
      status: 'active',
      isMarketHours: this.isMarketHours(),
      nextCrawlTime: 'Every 5 minutes during market hours',
      supportedIndices: this.indices,
      timezone: 'EST',
      currentTime: new Date().toISOString(),
    };
  }
}
