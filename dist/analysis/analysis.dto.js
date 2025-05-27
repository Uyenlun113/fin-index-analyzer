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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const recommendation_enum_1 = require("../common/enum/recommendation.enum");
class AnalysisResultDto {
    symbol;
    name;
    currentPrice;
    averagePrice;
    priceComparison;
    recommendation;
    confidence;
    timestamp;
}
exports.AnalysisResultDto = AnalysisResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Symbol chỉ số',
        example: '^DJI',
        enum: ['^DJI', '^GSPC', '^IXIC'],
    }),
    __metadata("design:type", String)
], AnalysisResultDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tên chỉ số',
        example: 'Dow Jones Industrial Average',
    }),
    __metadata("design:type", String)
], AnalysisResultDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá hiện tại',
        example: 34567.89,
        type: Number,
    }),
    __metadata("design:type", Number)
], AnalysisResultDto.prototype, "currentPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá trung bình 5 phiên trước',
        example: 34234.56,
        type: Number,
    }),
    __metadata("design:type", Number)
], AnalysisResultDto.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phần trăm so sánh với giá trung bình',
        example: 0.97,
        type: Number,
    }),
    __metadata("design:type", Number)
], AnalysisResultDto.prototype, "priceComparison", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Khuyến nghị đầu tư',
        enum: recommendation_enum_1.RecommendationType,
        example: recommendation_enum_1.RecommendationType.HOLD,
    }),
    __metadata("design:type", String)
], AnalysisResultDto.prototype, "recommendation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Độ tin cậy của khuyến nghị (%)',
        example: 75.5,
        type: Number,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], AnalysisResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Thời gian phân tích',
        example: '2024-01-15T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", Date)
], AnalysisResultDto.prototype, "timestamp", void 0);
//# sourceMappingURL=analysis.dto.js.map