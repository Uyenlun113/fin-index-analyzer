import { ApiProperty } from '@nestjs/swagger';
import { RecommendationType } from 'src/common/enum/recommendation.enum';

export class AnalysisResultDto {
  @ApiProperty({
    description: 'Symbol chỉ số',
    example: '^DJI',
    enum: ['^DJI', '^GSPC', '^IXIC'],
  })
  symbol: string;

  @ApiProperty({
    description: 'Tên chỉ số',
    example: 'Dow Jones Industrial Average',
  })
  name: string;

  @ApiProperty({
    description: 'Giá hiện tại',
    example: 34567.89,
    type: Number,
  })
  currentPrice: number;

  @ApiProperty({
    description: 'Giá trung bình 5 phiên trước',
    example: 34234.56,
    type: Number,
  })
  averagePrice: number;

  @ApiProperty({
    description: 'Phần trăm so sánh với giá trung bình',
    example: 0.97,
    type: Number,
  })
  priceComparison: number;

  @ApiProperty({
    description: 'Khuyến nghị đầu tư',
    enum: RecommendationType,
    example: RecommendationType.HOLD,
  })
  recommendation: RecommendationType;

  @ApiProperty({
    description: 'Độ tin cậy của khuyến nghị (%)',
    example: 75.5,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  confidence: number;

  @ApiProperty({
    description: 'Thời gian phân tích',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  timestamp: Date;
}
