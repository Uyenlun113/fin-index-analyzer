"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const analysis_module_1 = require("../analysis/analysis.module");
const index_schema_1 = require("./index.schema");
const indices_controller_1 = require("./indices.controller");
const indices_service_1 = require("./indices.service");
let IndicesModule = class IndicesModule {
};
exports.IndicesModule = IndicesModule;
exports.IndicesModule = IndicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: index_schema_1.MarketIndex.name, schema: index_schema_1.IndexSchema }]),
            analysis_module_1.AnalysisModule,
        ],
        controllers: [indices_controller_1.IndicesController],
        providers: [indices_service_1.IndicesService],
        exports: [indices_service_1.IndicesService],
    })
], IndicesModule);
//# sourceMappingURL=indices.module.js.map