import { Module } from '@nestjs/common';
import { CategoryTransactionService } from './category-transaction.service';
import { CategoryTransactionController } from './category-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTransactionEntity } from './entity/category-transaction.entity';
import { CategoryTransactionRepository } from './repository/category-transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTransactionEntity])],
  controllers: [CategoryTransactionController],
  providers: [CategoryTransactionService, CategoryTransactionRepository],
  exports: [CategoryTransactionService, CategoryTransactionRepository],
})
export class CategoryTransactionModule {}
