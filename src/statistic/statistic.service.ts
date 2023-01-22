import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryTransactionRepository } from 'src/category-transaction/repository/category-transaction.repository';
import { TransactionTypeEnum } from 'src/transaction/type.enum';
import { StatisticBodyDto } from './dto/statistic.body.dto';
import { StatisticResponseDto } from './dto/statistic.response.dto';

@Injectable()
export class StatisticService {
  constructor(
    private readonly categoryRepository: CategoryTransactionRepository,
  ) {}

  async getStatistic(
    statisticBodyDto: StatisticBodyDto,
    userId: string,
  ): Promise<StatisticResponseDto> {
    const categories = await this.categoryRepository.getStatistic(
      statisticBodyDto,
      userId,
    );

    const result: { [key: string]: number } = {};

    for (let i = 0; i < categories.length; i++) {
      const balance = categories[i].transactions
        .map((transaction) =>
          transaction.type === TransactionTypeEnum.Consumable
            ? -1 * transaction.amount
            : transaction.amount,
        )
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);

      result[categories[i].name] = balance;
    }

    return {
      statistic: result,
      statusCode: HttpStatus.OK,
    };
  }
}
