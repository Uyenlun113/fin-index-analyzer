import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IndexDocument = MarketIndex & Document;

@Schema({
  timestamps: true,
  collection: 'market_indices',
})
export class MarketIndex {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  symbol: string;

  @Prop({ required: true })
  currentPrice: number;

  @Prop({ required: true })
  openPrice: number;

  @Prop({ required: true })
  highPrice: number;

  @Prop({ required: true })
  lowPrice: number;

  @Prop({ required: true })
  changePercent: number;

  @Prop({ required: true })
  volume: number;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const IndexSchema = SchemaFactory.createForClass(MarketIndex);
