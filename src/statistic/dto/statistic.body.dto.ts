import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class StatisticBodyDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  readonly fromPeriod: Date;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  readonly toPeriod: Date;

  @ApiProperty({
    type: [String],
    default: [],
    isArray: true,
  })
  @IsUUID('all', { each: true, message: 'Not valid Id' })
  readonly categoryIds: string[];
}
