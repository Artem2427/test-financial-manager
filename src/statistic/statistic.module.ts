import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { CategoryTransactionModule } from 'src/category-transaction/category-transaction.module';

@Module({
  imports: [CategoryTransactionModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
