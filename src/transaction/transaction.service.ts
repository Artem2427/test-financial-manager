import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BankRepository } from 'src/bank/repository/bank.repository';
import { CategoryTransactionService } from 'src/category-transaction/category-transaction.service';
import { DefaultResponseDto } from 'src/core/dto/default.response';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PaginateResponseDto } from './dto/paginate.response.dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { TransactionEntity } from './entity/transaction.entity';
import {
  ERROR_CREATE,
  NOT_ENOUGH_MONEY,
  NOT_FOUND_TRANSACTION,
} from './errors/errors';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionTypeEnum } from './type.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly bankRepository: BankRepository,
    private readonly transactionRepository: TransactionRepository,

    private readonly categoriesTransactionService: CategoryTransactionService,
    private readonly httpService: HttpService,
  ) {}

  async getAllTransactionByBank({
    bankId,
    paginationQueryDto,
  }: {
    bankId: string;
    paginationQueryDto: PaginationQueryDto;
  }): Promise<PaginateResponseDto> {
    const take = paginationQueryDto.pageSize || 30;
    const skip = (paginationQueryDto.page - 1) * take;

    const result = await this.transactionRepository.getTransactionsWithPaginate(
      bankId,
      take,
      skip,
    );

    return {
      ...result,
      statusCode: HttpStatus.OK,
    };
  }

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<DefaultResponseDto> {
    const transformCreateDto = {
      ...createTransactionDto,
      amount: Math.abs(createTransactionDto.amount),
    };

    if (transformCreateDto.amount === 0) {
      throw new BadRequestException(ERROR_CREATE);
    }

    const bank = await this.bankRepository.findOne(
      transformCreateDto.bankId,
      userId,
    );

    if (
      bank.balance < Math.abs(transformCreateDto.amount) &&
      transformCreateDto.type === TransactionTypeEnum.Consumable
    ) {
      throw new BadRequestException(NOT_ENOUGH_MONEY);
    }

    const { categoryTransaction } =
      await this.categoriesTransactionService.findOne(
        transformCreateDto.categoryTransactionId,
        userId,
      );

    const newTransaction = new TransactionEntity();
    newTransaction.amount = transformCreateDto.amount;
    newTransaction.type = transformCreateDto.type;
    newTransaction.bank = bank;
    newTransaction.category = categoryTransaction;

    if (transformCreateDto.type === TransactionTypeEnum.Profitable) {
      bank.balance += transformCreateDto.amount;
    } else {
      if (bank.balance > transformCreateDto.amount) {
        bank.balance -= transformCreateDto.amount;
      } else {
        throw new BadRequestException(NOT_ENOUGH_MONEY);
      }
    }

    await this.bankRepository.saveBank(bank);

    const transaction = await this.transactionRepository.saveTransaction(
      newTransaction,
    );

    this.httpService
      .post(
        'https://webhook.site/8593913b-1b2d-4414-9e7c-84cf887abe9e',
        transaction,
      )
      .subscribe({
        complete: () => {
          console.log('completed');
        },
        error: (err) => {},
      });

    return {
      message: `Transaction (${transaction.id}) was successfully added`,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(
    transactionId: string,
    bankId: string,
    userId: string,
  ): Promise<DefaultResponseDto> {
    const transaction = await this.transactionRepository.findOneById(
      transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_TRANSACTION);
    }

    const bank = await this.bankRepository.findOne(bankId, userId);

    if (transaction.type === TransactionTypeEnum.Consumable) {
      bank.balance += transaction.amount;
    } else {
      if (bank.balance > transaction.amount) {
        bank.balance -= transaction.amount;
      } else {
        throw new BadRequestException(NOT_ENOUGH_MONEY);
      }
    }
    bank.updatedAt = new Date();
    await this.bankRepository.saveBank(bank);

    await this.transactionRepository.removeTransaction(transaction);

    return {
      message: `Transaction (${transaction.id}) was successfully deleted`,
      statusCode: HttpStatus.OK,
    };
  }
}
