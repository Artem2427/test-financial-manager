import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: 200;
}
