import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatisticBodyDto } from 'src/statistic/dto/statistic.body.dto';
import { Repository } from 'typeorm';
import { CategoryTransactionEntity } from '../entity/category-transaction.entity';

@Injectable()
export class CategoryTransactionRepository {
  constructor(
    @InjectRepository(CategoryTransactionEntity)
    private readonly categoryTransactionRepository: Repository<CategoryTransactionEntity>,
  ) {}

  async findAllByUser(userId: string): Promise<CategoryTransactionEntity[]> {
    return await this.categoryTransactionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    categoryId: string,
    userId: string,
  ): Promise<CategoryTransactionEntity> {
    return await this.categoryTransactionRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
    });
  }

  async findOneByName(name: string): Promise<CategoryTransactionEntity> {
    return await this.categoryTransactionRepository.findOne({
      where: { name },
    });
  }

  async getCategoryWithRelations(categoryId: string, userId: string) {
    return await this.categoryTransactionRepository
      .createQueryBuilder('categoryTransaction')
      .leftJoinAndSelect('categoryTransaction.transactions', 'transactions')
      .leftJoinAndSelect('categoryTransaction.user', 'user')
      .where('user.id = :userId AND categoryTransaction.id = :categoryId', {
        userId,
        categoryId,
      })
      .getOne();
  }

  async getStatistic(statisticBodyDto: StatisticBodyDto, userId: string) {
    const queryBuilder = this.categoryTransactionRepository
      .createQueryBuilder('categoryTransaction')
      .leftJoinAndSelect('categoryTransaction.user', 'user')
      .leftJoinAndSelect(
        'categoryTransaction.transactions',
        'transactions',
        'transactions.createdAt >= :startDate AND transactions.createdAt <= :endDate',
        {
          startDate: new Date(statisticBodyDto.fromPeriod).toISOString(),
          endDate: new Date(statisticBodyDto.toPeriod).toISOString(),
        },
      )
      .where('user.id = :userId', { userId });

    if (statisticBodyDto.categoryIds.length) {
      queryBuilder.andWhere('categoryTransaction.id IN (:...categoryIds)', {
        categoryIds: statisticBodyDto.categoryIds,
      });
    }

    return await queryBuilder.getMany();
  }

  async saveCategoryTransaction(
    categoryTransaction: CategoryTransactionEntity,
  ): Promise<CategoryTransactionEntity> {
    return await this.categoryTransactionRepository.save(categoryTransaction);
  }

  async removeCategory(
    categoryTransaction: CategoryTransactionEntity,
  ): Promise<CategoryTransactionEntity> {
    return await this.categoryTransactionRepository.remove(categoryTransaction);
  }
}
