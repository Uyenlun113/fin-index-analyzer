import { IndicesService } from './indices.service';
import { AnalysisService } from 'src/analysis/analysis.service';
export declare class IndicesController {
    private readonly indicesService;
    private readonly analysisService;
    private readonly logger;
    constructor(indicesService: IndicesService, analysisService: AnalysisService);
    getAllIndices(): Promise<any>;
    getIndexBySymbol(symbol: string): Promise<any>;
}
