"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebsocketGateway_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    server;
    logger = new common_1.Logger(WebsocketGateway_1.name);
    connectedClients = new Map();
    handleConnection(client) {
        this.connectedClients.set(client.id, client);
        this.logger.log(`🔌 Client connected: ${client.id} (Total: ${this.connectedClients.size})`);
        client.emit('connected', {
            message: 'Connected to Financial Crawler WebSocket',
            clientId: client.id,
            timestamp: new Date(),
            availableEvents: [
                'marketUpdate',
                'analysisUpdate',
                'subscribeToIndex',
                'unsubscribeFromIndex',
                'getStatus',
            ],
        });
    }
    handleDisconnect(client) {
        this.connectedClients.delete(client.id);
        this.logger.log(`🔌 Client disconnected: ${client.id} (Total: ${this.connectedClients.size})`);
    }
    broadcastMarketUpdate(data) {
        const payload = {
            type: 'marketUpdate',
            data: {
                ...data,
                timestamp: new Date(),
            },
        };
        this.server.emit('marketUpdate', payload);
        this.logger.log(`📡 Broadcasted market update for ${data.symbol} to ${this.connectedClients.size} clients`);
    }
    broadcastAnalysisUpdate(analysisResults) {
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
    broadcastIndexUpdate(symbol, data, analysis) {
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
    handleSubscribeToIndex(client, payload) {
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
    handleUnsubscribeFromIndex(client, payload) {
        const { symbol } = payload;
        client.leave(`index_${symbol}`);
        this.logger.log(`📡 Client ${client.id} unsubscribed from ${symbol}`);
        client.emit('unsubscribed', {
            symbol,
            message: `Successfully unsubscribed from ${symbol} updates`,
            timestamp: new Date(),
        });
    }
    handleGetStatus(client) {
        const status = {
            server: 'Financial Crawler WebSocket',
            status: 'active',
            connectedClients: this.connectedClients.size,
            supportedSymbols: ['^DJI', '^GSPC', '^IXIC'],
            timestamp: new Date(),
        };
        client.emit('status', status);
    }
    broadcastError(error, details) {
        const payload = {
            type: 'error',
            message: error,
            details,
            timestamp: new Date(),
        };
        this.server.emit('error', payload);
        this.logger.error(`❌ Broadcasted error: ${error}`);
    }
    getConnectionStats() {
        return {
            totalConnections: this.connectedClients.size,
            clients: Array.from(this.connectedClients.keys()),
        };
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeToIndex'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleSubscribeToIndex", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribeFromIndex'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleUnsubscribeFromIndex", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getStatus'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleGetStatus", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: '/',
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map