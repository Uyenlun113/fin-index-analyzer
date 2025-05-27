"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CrawlerService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
const mongoose_2 = require("mongoose");
const analysis_service_1 = require("../analysis/analysis.service");
const index_schema_1 = require("../indices/index.schema");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let CrawlerService = CrawlerService_1 = class CrawlerService {
    indexModel;
    websocketGateway;
    analysisService;
    logger = new common_1.Logger(CrawlerService_1.name);
    indices = [
        { name: 'Dow Jones Industrial Average', symbol: '^DJI' },
        { name: 'S&P 500', symbol: '^GSPC' },
        { name: 'NASDAQ Composite', symbol: '^IXIC' },
    ];
    constructor(indexModel, websocketGateway, analysisService) {
        this.indexModel = indexModel;
        this.websocketGateway = websocketGateway;
        this.analysisService = analysisService;
    }
    async scheduledCrawl() {
        if (!this.isMarketHours()) {
            this.logger.log('⏸️ Skipping crawler - Outside market hours');
            return;
        }
        await this.crawlMarketData();
    }
    async crawlMarketData() {
        this.logger.log('🔄 Starting market data crawling...');
        const results = [];
        for (const index of this.indices) {
            try {
                const data = await this.fetchMarketData(index.symbol);
                if (data) {
                    const marketData = {
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
            }
            catch (error) {
                this.logger.error(`❌ Error crawling ${index.name}: ${error.message}`);
            }
        }
        if (results.length > 0) {
            try {
                const analysisResults = await this.analysisService.analyzeAllIndices();
                this.websocketGateway.broadcastAnalysisUpdate(analysisResults);
                this.logger.log(`📊 Analysis completed and broadcasted for ${analysisResults.length} indices`);
            }
            catch (error) {
                this.logger.error(`❌ Error during analysis: ${error.message}`);
            }
        }
    }
    async fetchMarketData(symbol) {
        try {
            this.logger.log(`📡 Fetching data for ${symbol} from Yahoo Finance...`);
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
            const apiTimeout = process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : 10000;
            const response = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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
                changePercent: parseFloat(((((meta.regularMarketPrice || meta.previousClose || 0) - (meta.previousClose || 0)) /
                    (meta.previousClose || 1)) *
                    100).toFixed(2)),
                volume: quote.volume[latestIndex] || 0,
            };
            return marketData;
        }
        catch (error) {
            if (error.code === 'ECONNABORTED') {
                this.logger.error(`⏰ Timeout fetching data for ${symbol}`);
            }
            else if (error.response?.status) {
                this.logger.error(`🚫 HTTP ${error.response.status} error for ${symbol}: ${error.response.statusText}`);
            }
            else {
                this.logger.error(`❌ Failed to fetch data for ${symbol}: ${error.message}`);
            }
            return null;
        }
    }
    async saveMarketData(data) {
        try {
            const newIndex = new this.indexModel(data);
            const savedData = await newIndex.save();
            return savedData;
        }
        catch (error) {
            this.logger.error(`❌ Failed to save data for ${data.name}: ${error.message}`);
            throw error;
        }
    }
    async crawlNow() {
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
        }
        catch (error) {
            this.logger.error(`❌ Manual crawl failed: ${error.message}`);
            return {
                success: false,
                message: `Crawling failed: ${error.message}`,
            };
        }
    }
    isMarketHours() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const dayOfWeek = now.getUTCDay();
        const estHours = (utcHours - 5 + 24) % 24;
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }
        return estHours >= 9 && estHours <= 16 && !(estHours === 9 && now.getUTCMinutes() < 30);
    }
    getStatus() {
        return {
            status: 'active',
            isMarketHours: this.isMarketHours(),
            nextCrawlTime: 'Every 5 minutes during market hours',
            supportedIndices: this.indices,
            timezone: 'EST',
            currentTime: new Date().toISOString(),
        };
    }
};
exports.CrawlerService = CrawlerService;
__decorate([
    (0, schedule_1.Cron)('0 */5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerService.prototype, "scheduledCrawl", null);
exports.CrawlerService = CrawlerService = CrawlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_schema_1.MarketIndex.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, websocket_gateway_1.WebsocketGateway,
        analysis_service_1.AnalysisService])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map