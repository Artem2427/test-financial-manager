import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankEntity } from '../entity/bank.entity';

@Injectable()
export class BankRepository {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
  ) {}

  async findOne(bankId: string, userId: string): Promise<BankEntity> {
    return await this.bankRepository.findOne({
      where: {
        id: bankId,
        user: { id: userId },
      },
    });
  }

  async findOneWithRelations(
    bankId: string,
    userId: string,
  ): Promise<BankEntity> {
    return await this.bankRepository
      .createQueryBuilder('bank')
      .leftJoinAndSelect('bank.user', 'user')
      .leftJoinAndSelect('bank.transactions', 'transactions')
      .where('bank.id = :bankId AND user.id = :userId', {
        bankId,
        userId,
      })
      .getOne();
  }

  async findOneByName(name: string): Promise<BankEntity> {
    return await this.bankRepository.findOne({ where: { name } });
  }

  async findAll(userId: string): Promise<BankEntity[]> {
    return await this.bankRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async saveBank(bank: BankEntity): Promise<BankEntity> {
    return await this.bankRepository.save(bank);
  }

  async remove(bank: BankEntity) {
    return await this.bankRepository.remove(bank);
  }
}
