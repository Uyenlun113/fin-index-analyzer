import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnalysisResult } from 'src/common/interfaces/analysis.interface';
import { MarketData } from '../common/interfaces/market-data.interface';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastMarketUpdate(data: MarketData): void;
    broadcastAnalysisUpdate(analysisResults: AnalysisResult[]): void;
    broadcastIndexUpdate(symbol: string, data: MarketData, analysis?: AnalysisResult): void;
    handleSubscribeToIndex(client: Socket, payload: {
        symbol: string;
    }): void;
    handleUnsubscribeFromIndex(client: Socket, payload: {
        symbol: string;
    }): void;
    handleGetStatus(client: Socket): void;
    broadcastError(error: string, details?: any): void;
    getConnectionStats(): {
        totalConnections: number;
        clients: string[];
    };
}
