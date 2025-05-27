import { RecommendationType } from 'src/common/enum/recommendation.enum';
export declare class AnalysisResultDto {
    symbol: string;
    name: string;
    currentPrice: number;
    averagePrice: number;
    priceComparison: number;
    recommendation: RecommendationType;
    confidence: number;
    timestamp: Date;
}
