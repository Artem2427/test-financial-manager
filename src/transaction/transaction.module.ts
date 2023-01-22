import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { BankModule } from 'src/bank/bank.module';
import { CategoryTransactionModule } from 'src/category-transaction/category-transaction.module';
import { TransactionRepository } from './repository/transaction.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BankModule,
    HttpModule,
    CategoryTransactionModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionRepository],
})
export class TransactionModule {}
