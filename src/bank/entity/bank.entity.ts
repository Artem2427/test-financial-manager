import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { TransactionEntity } from 'src/transaction/entity/transaction.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'banks' })
export class BankEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 200, nullable: false })
  @Column({ type: 'varchar', length: '200', nullable: false, unique: true })
  name: string;

  @ApiProperty({ type: Number, minimum: 0 })
  @Column({ type: 'real', default: 0, nullable: false })
  balance: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.banks)
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.bank)
  transactions: TransactionEntity[];
}
