import { Logger } from '@nestjs/common';
import {
        ConnectedSocket,
        MessageBody,
        OnGatewayConnection,
        OnGatewayDisconnect,
        SubscribeMessage,
        WebSocketGateway,
        WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AnalysisResult } from 'src/common/interfaces/analysis.interface';
import { MarketData } from '../common/interfaces/market-data.interface';

/**
 * WebSocket Gateway cho real-time data streaming
 * Theo yêu cầu đề bài:
 * - Tích hợp WebSocket để gửi dữ liệu mới đến client theo thời gian thực
 * - Gửi dữ liệu mới (chỉ số + phân tích) ngay khi crawler cập nhật
 * - Client có thể nhận real-time data + khuyến nghị
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private connectedClients = new Map<string, Socket>();

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    this.logger.log(`🔌 Client connected: ${client.id} (Total: ${this.connectedClients.size})`);

    // Gửi welcome message với available events
    client.emit('connected', {
      message: 'Connected to Financial Crawler WebSocket',
      clientId: client.id,
      timestamp: new Date(),
      availableEvents: [
        'marketUpdate', // Dữ liệu chỉ số mới
        'analysisUpdate', // Kết quả phân tích mới
        'subscribeToIndex', // Subscribe chỉ số cụ thể
        'unsubscribeFromIndex', // Unsubscribe
        'getStatus', // Trạng thái server
      ],
    });
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`🔌 Client disconnected: ${client.id} (Total: ${this.connectedClients.size})`);
  }

  /**
   * Broadcast market update tới tất cả clients
   * Theo yêu cầu đề bài: Gửi dữ liệu mới ngay khi crawler cập nhật
   */
  broadcastMarketUpdate(data: MarketData) {
    const payload = {
      type: 'marketUpdate',
      data: {
        ...data,
        timestamp: new Date(),
      },
    };

    this.server.emit('marketUpdate', payload);
    this.logger.log(
      `📡 Broadcasted market update for ${data.symbol} to ${this.connectedClients.size} clients`,
    );
  }

  /**
   * Broadcast analysis results tới tất cả clients
   * Theo yêu cầu đề bài: Client có thể nhận real-time data + khuyến nghị
   */
  broadcastAnalysisUpdate(analysisResults: AnalysisResult[]) {
    const payload = {
      type: 'analysisUpdate',
      data: {
        results: analysisResults,
        timestamp: new Date(),
        summary: {
          totalAnalyzed: analysisResults.length,
          recommendations: {
            buy: analysisResults.filter(r => r.recommendation === 'BUY').length,
            sell: analysisResults.filter(r => r.recommendation === 'SELL').length,
            hold: analysisResults.filter(r => r.recommendation === 'HOLD').length,
          },
        },
      },
    };

    this.server.emit('analysisUpdate', payload);
    this.logger.log(`📊 Broadcasted analysis results for ${analysisResults.length} indices`);
  }

  /**
   * Gửi update cho specific index subscribers
   */
  broadcastIndexUpdate(symbol: string, data: MarketData, analysis?: AnalysisResult) {
    const payload = {
      type: 'indexUpdate',
      symbol,
      data: {
        marketData: data,
        analysis,
        timestamp: new Date(),
      },
    };

    this.server.to(`index_${symbol}`).emit('indexUpdate', payload);
    this.logger.log(`📈 Sent ${symbol} update to subscribed clients`);
  }

  /**
   * Handle client subscription to specific index
   * Cho phép client subscribe theo chỉ số cụ thể
   */
  @SubscribeMessage('subscribeToIndex')
  handleSubscribeToIndex(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { symbol: string },
  ) {
    const { symbol } = payload;
    const validSymbols = ['^DJI', '^GSPC', '^IXIC'];

    if (!validSymbols.includes(symbol)) {
      client.emit('error', {
        message: 'Invalid symbol',
        validSymbols,
        timestamp: new Date(),
      });
      return;
    }

    client.join(`index_${symbol}`);
    this.logger.log(`📡 Client ${client.id} subscribed to ${symbol}`);

    client.emit('subscribed', {
      symbol,
      message: `Successfully subscribed to ${symbol} updates`,
      timestamp: new Date(),
    });
  }

  /**
   * Handle client unsubscription from specific index
   */
  @SubscribeMessage('unsubscribeFromIndex')
  handleUnsubscribeFromIndex(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { symbol: string },
  ) {
    const { symbol } = payload;

    client.leave(`index_${symbol}`);
    this.logger.log(`📡 Client ${client.id} unsubscribed from ${symbol}`);

    client.emit('unsubscribed', {
      symbol,
      message: `Successfully unsubscribed from ${symbol} updates`,
      timestamp: new Date(),
    });
  }

  /**
   * Handle status request từ client
   */
  @SubscribeMessage('getStatus')
  handleGetStatus(@ConnectedSocket() client: Socket) {
    const status = {
      server: 'Financial Crawler WebSocket',
      status: 'active',
      connectedClients: this.connectedClients.size,
      supportedSymbols: ['^DJI', '^GSPC', '^IXIC'],
      timestamp: new Date(),
    };

    client.emit('status', status);
  }

  /**
   * Broadcast error tới tất cả clients
   */
  broadcastError(error: string, details?: any) {
    const payload = {
      type: 'error',
      message: error,
      details,
      timestamp: new Date(),
    };

    this.server.emit('error', payload);
    this.logger.error(`❌ Broadcasted error: ${error}`);
  }

  /**
   * Get connection statistics
   */
  getConnectionStats() {
    return {
      totalConnections: this.connectedClients.size,
      clients: Array.from(this.connectedClients.keys()),
    };
  }
}
