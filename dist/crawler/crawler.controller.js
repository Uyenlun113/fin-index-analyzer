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
var CrawlerController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crawler_service_1 = require("./crawler.service");
let CrawlerController = CrawlerController_1 = class CrawlerController {
    crawlerService;
    logger = new common_1.Logger(CrawlerController_1.name);
    constructor(crawlerService) {
        this.crawlerService = crawlerService;
    }
    async startCrawling() {
        this.logger.log('🎯 Manual crawl requested via API');
        const result = await this.crawlerService.crawlNow();
        return {
            ...result,
            endpoint: '/crawler/start',
            timestamp: new Date(),
        };
    }
    getStatus() {
        return {
            success: true,
            data: this.crawlerService.getStatus(),
            timestamp: new Date(),
        };
    }
};
exports.CrawlerController = CrawlerController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({
        summary: 'Chạy crawler thủ công',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlerController.prototype, "startCrawling", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Kiểm tra trạng thái crawler',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrawlerController.prototype, "getStatus", null);
exports.CrawlerController = CrawlerController = CrawlerController_1 = __decorate([
    (0, swagger_1.ApiTags)('crawler'),
    (0, common_1.Controller)('crawler'),
    __metadata("design:paramtypes", [crawler_service_1.CrawlerService])
], CrawlerController);
//# sourceMappingURL=crawler.controller.js.map