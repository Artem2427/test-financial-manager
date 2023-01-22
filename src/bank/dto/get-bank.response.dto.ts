import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/core/dto/success.response.dto';
import { BankEntity } from '../entity/bank.entity';

export class GetBankResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: BankEntity })
  readonly bank: BankEntity;
}
