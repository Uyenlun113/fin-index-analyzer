import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

/**
 * Module cho WebSocket functionality
 * Theo yêu cầu đề bài: Tích hợp WebSocket để gửi dữ liệu mới đến client theo thời gian thực
 */
@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway], // Export để các module khác sử dụng
})
export class WebsocketModule {}
