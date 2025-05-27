import { CrawlerService } from './crawler.service';
export declare class CrawlerController {
    private readonly crawlerService;
    private readonly logger;
    constructor(crawlerService: CrawlerService);
    startCrawling(): unknown;
    getStatus(): {
        success: boolean;
        data: any;
        timestamp: any;
    };
}
