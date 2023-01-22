import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entity/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findOneById(id: string): Promise<TransactionEntity> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async getTransactionsWithPaginate(
    bankId: string,
    take: number,
    skip: number,
  ) {
    const queryBuilder = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.bank', 'bank')
      .where('bank.id = :bankId', { bankId })
      .orderBy('transaction.createdAt', 'DESC');

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const transactions = await queryBuilder.getMany();

    return {
      total: totalAmount,
      transactions,
    };
  }

  async saveTransaction(
    transaction: TransactionEntity,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.save(transaction);
  }

  async removeTransaction(
    transaction: TransactionEntity,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.remove(transaction);
  }
}
