import { Model } from 'mongoose';
import { AnalysisService } from '../analysis/analysis.service';
import { IndexDocument } from 'src/indices/index.schema';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export declare class CrawlerService {
    private indexModel;
    private websocketGateway;
    private analysisService;
    private readonly logger;
    private readonly indices;
    constructor(indexModel: Model<IndexDocument>, websocketGateway: WebsocketGateway, analysisService: AnalysisService);
    scheduledCrawl(): Promise<void>;
    crawlMarketData(): Promise<void>;
    private fetchMarketData;
    private saveMarketData;
    crawlNow(): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    private isMarketHours;
    getStatus(): any;
}
