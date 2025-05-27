"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const analysis_module_1 = require("../analysis/analysis.module");
const index_schema_1 = require("../indices/index.schema");
const crawler_controller_1 = require("./crawler.controller");
const crawler_service_1 = require("./crawler.service");
const websocket_module_1 = require("../websocket/websocket.module");
let CrawlerModule = class CrawlerModule {
};
exports.CrawlerModule = CrawlerModule;
exports.CrawlerModule = CrawlerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: index_schema_1.MarketIndex.name, schema: index_schema_1.IndexSchema }]),
            websocket_module_1.WebsocketModule,
            analysis_module_1.AnalysisModule,
        ],
        controllers: [crawler_controller_1.CrawlerController],
        providers: [crawler_service_1.CrawlerService],
        exports: [crawler_service_1.CrawlerService],
    })
], CrawlerModule);
//# sourceMappingURL=crawler.module.js.map