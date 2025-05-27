import { Model } from 'mongoose';
import { CreateIndexDto } from './index.dto';
import { IndexDocument } from './index.schema';
export declare class IndicesService {
    private indexModel;
    private readonly logger;
    constructor(indexModel: Model<IndexDocument>);
    create(createIndexDto: CreateIndexDto): Promise<IndexDocument>;
    findAll(): Promise<IndexDocument[]>;
    findBySymbol(symbol: string): Promise<IndexDocument | null>;
    findHistoricalData(symbol: string, limit?: number): Promise<IndexDocument[]>;
    cleanOldData(daysToKeep?: number): Promise<number>;
}
