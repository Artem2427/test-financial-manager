import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly page: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly pageSize: number;
}
