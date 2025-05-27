export interface MarketData {
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
export interface MarketDataResponse {
  success: boolean;
  data?: MarketData | MarketData[];
  error?: string;
  timestamp: Date;
}
