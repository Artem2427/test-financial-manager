import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { TransactionEntity } from 'src/transaction/entity/transaction.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'category-transaction' })
export class CategoryTransactionEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.categoriesTransactions, {
    cascade: true,
  })
  user: UserEntity;

  @ApiProperty({ type: () => [TransactionEntity] })
  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: TransactionEntity[];
}
