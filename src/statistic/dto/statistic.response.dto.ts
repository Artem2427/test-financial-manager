import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/core/dto/success.response.dto';

export class StatisticResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: Number })
  statistic: { [key: string]: number };
}
