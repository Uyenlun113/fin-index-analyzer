import { RecommendationType } from '../enum/recommendation.enum';
export interface AnalysisResult {
    symbol: string;
    name: string;
    currentPrice: number;
    averagePrice: number;
    priceComparison: number;
    recommendation: RecommendationType;
    confidence: number;
    timestamp: Date;
}
export interface AnalysisResponse {
    success: boolean;
    data?: AnalysisResult | AnalysisResult[];
    error?: string;
    timestamp: Date;
}
