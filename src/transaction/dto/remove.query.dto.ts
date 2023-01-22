import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RemoveTransactionQueryDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsUUID('all', { each: true, message: 'Not valid Id' })
  readonly bankId: string;
}
