import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BankEntity } from 'src/bank/entity/bank.entity';
import { CategoryTransactionEntity } from 'src/category-transaction/entity/category-transaction.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '256', nullable: false, unique: true })
  email: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: '2000', nullable: false, select: false })
  password: string;

  @ApiProperty({ type: () => [BankEntity] })
  @OneToMany(() => BankEntity, (bank) => bank.user)
  banks: BankEntity[];

  @ApiProperty({ type: () => [CategoryTransactionEntity] })
  @OneToMany(
    () => CategoryTransactionEntity,
    (categoryTransaction) => categoryTransaction.user,
  )
  categoriesTransactions: CategoryTransactionEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
