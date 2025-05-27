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
var IndicesController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const indices_service_1 = require("./indices.service");
const analysis_service_1 = require("../analysis/analysis.service");
let IndicesController = IndicesController_1 = class IndicesController {
    indicesService;
    analysisService;
    logger = new common_1.Logger(IndicesController_1.name);
    constructor(indicesService, analysisService) {
        this.indicesService = indicesService;
        this.analysisService = analysisService;
    }
    async getAllIndices() {
        try {
            const indices = await this.indicesService.findAll();
            const analysis = await this.analysisService.analyzeAllIndices();
            return {
                success: true,
                data: {
                    indices,
                    analysis,
                    summary: {
                        totalIndices: indices.length,
                        lastUpdated: indices.length > 0 ? indices[0].timestamp : null,
                        recommendations: {
                            buy: analysis.filter(a => a.recommendation === 'BUY').length,
                            sell: analysis.filter(a => a.recommendation === 'SELL').length,
                            hold: analysis.filter(a => a.recommendation === 'HOLD').length,
                        },
                    },
                },
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error getting all indices: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                error: 'Failed to retrieve indices data',
                details: error.message,
                timestamp: new Date(),
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getIndexBySymbol(symbol) {
        try {
            const validSymbols = ['^DJI', '^GSPC', '^IXIC'];
            if (!validSymbols.includes(symbol)) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid symbol',
                    validSymbols,
                    timestamp: new Date(),
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const index = await this.indicesService.findBySymbol(symbol);
            if (!index) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Index not found',
                    symbol,
                    timestamp: new Date(),
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const analysis = await this.analysisService.analyzeIndex(symbol);
            const historicalData = await this.indicesService.findHistoricalData(symbol, 5);
            return {
                success: true,
                data: {
                    currentData: index,
                    analysis,
                    historicalData,
                    metadata: {
                        symbol,
                        dataPoints: historicalData.length,
                        lastUpdated: index.timestamp,
                    },
                },
                timestamp: new Date(),
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`❌ Error getting index ${symbol}: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                error: 'Failed to retrieve index data',
                symbol,
                details: error.message,
                timestamp: new Date(),
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IndicesController = IndicesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy tất cả chỉ số thị trường',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], IndicesController.prototype, "getAllIndices", null);
__decorate([
    (0, common_1.Get)(':symbol'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy dữ liệu chỉ số cụ thể',
    }),
    (0, swagger_1.ApiParam)({
        name: 'symbol',
        description: 'Symbol của chỉ số thị trường',
        enum: ['^DJI', '^GSPC', '^IXIC'],
        example: '^DJI',
    }),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], IndicesController.prototype, "getIndexBySymbol", null);
exports.IndicesController = IndicesController = IndicesController_1 = __decorate([
    (0, swagger_1.ApiTags)('indices'),
    (0, common_1.Controller)('indices'),
    __metadata("design:paramtypes", [indices_service_1.IndicesService,
        analysis_service_1.AnalysisService])
], IndicesController);
//# sourceMappingURL=indices.controller.js.map