import { Model } from 'mongoose';
import { AnalysisResult } from 'src/common/interfaces/analysis.interface';
import { IndexDocument } from 'src/indices/index.schema';
export declare class AnalysisService {
    private indexModel;
    private readonly logger;
    constructor(indexModel: Model<IndexDocument>);
    analyzeIndex(symbol: string): Promise<AnalysisResult | null>;
    analyzeAllIndices(): Promise<AnalysisResult[]>;
    private getRecommendation;
    private calculateConfidence;
    private calculatePriceVolatility;
}
