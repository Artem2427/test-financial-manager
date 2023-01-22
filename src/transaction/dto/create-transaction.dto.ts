import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionTypeEnum } from '../type.enum';

export class CreateTransactionDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ enum: TransactionTypeEnum })
  @IsEnum(TransactionTypeEnum)
  readonly type: TransactionTypeEnum;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsUUID('all', { each: true, message: 'Not valid Id' })
  readonly bankId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUUID('all', { each: true, message: 'Not valid Ids' })
  readonly categoryTransactionId: string;
}
