import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from './success.response.dto';

export class DefaultResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: String })
  message: string;
}
