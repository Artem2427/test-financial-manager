import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/core/dto/success.response.dto';
import { TransactionEntity } from '../entity/transaction.entity';

export class PaginateResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: [TransactionEntity] })
  transactions: TransactionEntity[];
}
