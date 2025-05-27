import { CrawlerService } from './crawler.service';
export declare class CrawlerController {
    private readonly crawlerService;
    private readonly logger;
    constructor(crawlerService: CrawlerService);
    startCrawling(): Promise<{
        endpoint: string;
        timestamp: Date;
        success: boolean;
        message: string;
        data?: any;
    }>;
    getStatus(): {
        success: boolean;
        data: any;
        timestamp: Date;
    };
}
