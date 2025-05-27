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
var IndicesService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const index_schema_1 = require("./index.schema");
let IndicesService = IndicesService_1 = class IndicesService {
    indexModel;
    logger = new common_1.Logger(IndicesService_1.name);
    constructor(indexModel) {
        this.indexModel = indexModel;
    }
    async create(createIndexDto) {
        try {
            const createdIndex = new this.indexModel({
                ...createIndexDto,
                timestamp: new Date(),
            });
            const saved = await createdIndex.save();
            this.logger.log(`✅ Created index record for ${createIndexDto.name}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`❌ Failed to create index: ${error.message}`);
            throw error;
        }
    }
    async findAll() {
        try {
            const pipeline = [
                {
                    $sort: { symbol: 1, timestamp: -1 },
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
                    $sort: { name: 1 },
                },
            ];
            const indices = await this.indexModel.aggregate(pipeline);
            this.logger.log(`📊 Retrieved ${indices.length} latest indices`);
            return indices;
        }
        catch (error) {
            this.logger.error(`❌ Failed to find all indices: ${error.message}`);
            throw error;
        }
    }
    async findBySymbol(symbol) {
        try {
            const index = await this.indexModel.findOne({ symbol }).sort({ timestamp: -1 }).exec();
            if (index) {
                this.logger.log(`📈 Retrieved latest data for ${symbol}`);
            }
            else {
                this.logger.warn(`⚠️ No data found for symbol: ${symbol}`);
            }
            return index;
        }
        catch (error) {
            this.logger.error(`❌ Failed to find index ${symbol}: ${error.message}`);
            throw error;
        }
    }
    async findHistoricalData(symbol, limit = 10) {
        try {
            const historicalData = await this.indexModel
                .find({ symbol })
                .sort({ timestamp: -1 })
                .limit(limit)
                .exec();
            this.logger.log(`📊 Retrieved ${historicalData.length} historical records for ${symbol}`);
            return historicalData;
        }
        catch (error) {
            this.logger.error(`❌ Failed to get historical data for ${symbol}: ${error.message}`);
            throw error;
        }
    }
    async cleanOldData(daysToKeep = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            const result = await this.indexModel.deleteMany({
                timestamp: { $lt: cutoffDate },
            });
            this.logger.log(`🧹 Cleaned ${result.deletedCount} old records`);
            return result.deletedCount;
        }
        catch (error) {
            this.logger.error(`❌ Failed to clean old data: ${error.message}`);
            throw error;
        }
    }
};
exports.IndicesService = IndicesService;
exports.IndicesService = IndicesService = IndicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(index_schema_1.MarketIndex.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], IndicesService);
//# sourceMappingURL=indices.service.js.map