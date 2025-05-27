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
var AnalysisService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const recommendation_enum_1 = require("../common/enum/recommendation.enum");
const index_schema_1 = require("../indices/index.schema");
let AnalysisService = AnalysisService_1 = class AnalysisService {
    indexModel;
    logger = new common_1.Logger(AnalysisService_1.name);
    constructor(indexModel) {
        this.indexModel = indexModel;
    }
    async analyzeIndex(symbol) {
        try {
            this.logger.log(`🔍 Analyzing index: ${symbol}`);
            const historicalData = await this.indexModel
                .find({ symbol })
                .sort({ timestamp: -1 })
                .limit(10)
                .exec();
            if (historicalData.length < 5) {
                this.logger.warn(`⚠️ Not enough data for analysis: ${symbol} (${historicalData.length} records)`);
                return null;
            }
            const currentData = historicalData[0];
            const previousData = historicalData.slice(1, 6);
            const averagePrice = previousData.reduce((sum, data) => sum + data.currentPrice, 0) / previousData.length;
            const priceComparison = ((currentData.currentPrice - averagePrice) / averagePrice) * 100;
            const recommendation = this.getRecommendation(priceComparison);
            const confidence = this.calculateConfidence(priceComparison, historicalData);
            const result = {
                symbol: currentData.symbol,
                name: currentData.name,
                currentPrice: currentData.currentPrice,
                averagePrice: parseFloat(averagePrice.toFixed(2)),
                priceComparison: parseFloat(priceComparison.toFixed(2)),
                recommendation,
                confidence,
                timestamp: new Date(),
            };
            this.logger.log(`✅ Analysis completed for ${symbol}: ${recommendation} (${confidence}% confidence)`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Analysis failed for ${symbol}: ${error.message}`);
            return null;
        }
    }
    async analyzeAllIndices() {
        this.logger.log('🔍 Analyzing all indices...');
        const symbols = ['^DJI', '^GSPC', '^IXIC'];
        const results = [];
        for (const symbol of symbols) {
            const analysis = await this.analyzeIndex(symbol);
            if (analysis) {
                results.push(analysis);
            }
        }
        this.logger.log(`✅ Completed analysis for ${results.length} indices`);
        return results;
    }
    getRecommendation(priceComparison) {
        if (priceComparison > 5) {
            return recommendation_enum_1.RecommendationType.SELL;
        }
        else if (priceComparison < -5) {
            return recommendation_enum_1.RecommendationType.BUY;
        }
        else {
            return recommendation_enum_1.RecommendationType.HOLD;
        }
    }
    calculateConfidence(priceComparison, historicalData) {
        const volatility = this.calculatePriceVolatility(historicalData);
        const trendStrength = Math.abs(priceComparison);
        let confidence = Math.min(90, trendStrength * 8);
        confidence = Math.max(confidence - volatility * 3, 30);
        if (trendStrength > 10) {
            confidence = Math.min(confidence + 15, 95);
        }
        return parseFloat(confidence.toFixed(1));
    }
    calculatePriceVolatility(data) {
        if (data.length < 2)
            return 0;
        const changes = data.slice(0, -1).map((current, index) => {
            const previous = data[index + 1];
            return Math.abs(((current.currentPrice - previous.currentPrice) / previous.currentPrice) * 100);
        });
        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        return parseFloat(avgChange.toFixed(2));
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = AnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_schema_1.MarketIndex.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map