import { ApiProperty } from '@nestjs/swagger';
import { BankEntity } from 'src/bank/entity/bank.entity';
import { CategoryTransactionEntity } from 'src/category-transaction/entity/category-transaction.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionTypeEnum } from '../type.enum';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @ApiProperty({ type: Number })
  @Column({ type: 'real', nullable: false })
  amount: number;

  @ApiProperty({ enum: TransactionTypeEnum })
  @Column({ type: 'enum', enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @ApiProperty({ type: () => BankEntity })
  @ManyToOne(() => BankEntity, (bank) => bank.transactions)
  bank: BankEntity;

  @ApiProperty({ type: () => CategoryTransactionEntity })
  @ManyToOne(
    () => CategoryTransactionEntity,
    (categoryTransaction) => categoryTransaction.transactions,
  )
  category: CategoryTransactionEntity;
}
