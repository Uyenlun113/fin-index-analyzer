import { Document } from 'mongoose';
export type IndexDocument = MarketIndex & Document;
export declare class MarketIndex {
    name: string;
    symbol: string;
    currentPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    changePercent: number;
    volume: number;
    timestamp: Date;
}
export declare const IndexSchema: any;
