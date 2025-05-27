export declare class CreateIndexDto {
    name: string;
    symbol: string;
    currentPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    changePercent: number;
    volume: number;
    timestamp?: Date;
}
export declare class IndexResponseDto {
    success: boolean;
    data: any;
    error?: string;
    timestamp: Date;
}
