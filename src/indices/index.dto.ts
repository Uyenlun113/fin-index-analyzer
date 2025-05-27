import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIndexDto {
  @ApiProperty({
    description: 'Tên chỉ số thị trường',
    example: 'Dow Jones Industrial Average',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Symbol của chỉ số',
    example: '^DJI',
    enum: ['^DJI', '^GSPC', '^IXIC'],
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Giá hiện tại',
    example: 34567.89,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  currentPrice: number;

  @ApiProperty({
    description: 'Giá mở cửa',
    example: 34500.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  openPrice: number;

  @ApiProperty({
    description: 'Giá cao nhất trong phiên',
    example: 34600.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  highPrice: number;

  @ApiProperty({
    description: 'Giá thấp nhất trong phiên',
    example: 34450.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  lowPrice: number;

  @ApiProperty({
    description: 'Phần trăm thay đổi so với phiên trước',
    example: 0.23,
    type: Number,
  })
  @IsNumber()
  changePercent: number;

  @ApiProperty({
    description: 'Khối lượng giao dịch',
    example: 123456789,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  volume: number;

  @ApiPropertyOptional({
    description: 'Thời gian cập nhật',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  timestamp?: Date;
}

export class IndexResponseDto {
  @ApiProperty({
    description: 'Trạng thái response',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Dữ liệu chỉ số',
    type: Object,
  })
  data: any;

  @ApiPropertyOptional({
    description: 'Thông báo lỗi (nếu có)',
    example: 'Index not found',
    type: String,
  })
  error?: string;

  @ApiProperty({
    description: 'Thời gian response',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  timestamp: Date;
}
