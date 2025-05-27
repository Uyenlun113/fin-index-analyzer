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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexResponseDto = exports.CreateIndexDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIndexDto {
    name;
    symbol;
    currentPrice;
    openPrice;
    highPrice;
    lowPrice;
    changePercent;
    volume;
    timestamp;
}
exports.CreateIndexDto = CreateIndexDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tên chỉ số thị trường',
        example: 'Dow Jones Industrial Average',
        type: String,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndexDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Symbol của chỉ số',
        example: '^DJI',
        enum: ['^DJI', '^GSPC', '^IXIC'],
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIndexDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá hiện tại',
        example: 34567.89,
        type: Number,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "currentPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá mở cửa',
        example: 34500.0,
        type: Number,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "openPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá cao nhất trong phiên',
        example: 34600.0,
        type: Number,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "highPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Giá thấp nhất trong phiên',
        example: 34450.0,
        type: Number,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "lowPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phần trăm thay đổi so với phiên trước',
        example: 0.23,
        type: Number,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "changePercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Khối lượng giao dịch',
        example: 123456789,
        type: Number,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIndexDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thời gian cập nhật',
        example: '2024-01-15T10:30:00Z',
        type: Date,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateIndexDto.prototype, "timestamp", void 0);
class IndexResponseDto {
    success;
    data;
    error;
    timestamp;
}
exports.IndexResponseDto = IndexResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Trạng thái response',
        example: true,
        type: Boolean,
    }),
    __metadata("design:type", Boolean)
], IndexResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dữ liệu chỉ số',
        type: Object,
    }),
    __metadata("design:type", Object)
], IndexResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Thông báo lỗi (nếu có)',
        example: 'Index not found',
        type: String,
    }),
    __metadata("design:type", String)
], IndexResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Thời gian response',
        example: '2024-01-15T10:30:00Z',
        type: Date,
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], IndexResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=index.dto.js.map