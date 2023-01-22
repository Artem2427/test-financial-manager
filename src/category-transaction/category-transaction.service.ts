import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DefaultResponseDto } from 'src/core/dto/default.response';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateCategoryTransactionDto } from './dto/create-category-transaction.dto';
import { GetAllCategoriesTransactionResponseDto } from './dto/get-all-categories-transaction.response.dto';
import { GetCategoryTransactionResponseDto } from './dto/get-category-transaction.response.dto';
import { UpdateCategoryTransactionDto } from './dto/update-category-transaction.dto';
import { CategoryTransactionEntity } from './entity/category-transaction.entity';
import {
  CATEGORY_TRANSACTION_NAME_IS_EXIST,
  ERROR_DELETE_CATEGORY_TRANSACTION,
  NOT_FOUND_CATEGORY_TRANSACTION,
} from './errors/errors';
import { CategoryTransactionRepository } from './repository/category-transaction.repository';

@Injectable()
export class CategoryTransactionService {
  constructor(
    private readonly categoryTransactionRepository: CategoryTransactionRepository,
  ) {}

  async findAll(
    userId: string,
  ): Promise<GetAllCategoriesTransactionResponseDto> {
    const categoriesTransactions =
      await this.categoryTransactionRepository.findAllByUser(userId);

    return {
      categoriesTransactions,
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(
    categoryId: string,
    userId: string,
  ): Promise<GetCategoryTransactionResponseDto> {
    const categoryTransaction =
      await this.categoryTransactionRepository.findOne(categoryId, userId);

    if (!categoryTransaction) {
      throw new NotFoundException(NOT_FOUND_CATEGORY_TRANSACTION);
    }
    return {
      categoryTransaction,
      statusCode: HttpStatus.OK,
    };
  }

  async create(
    createCategoryTransactionDto: CreateCategoryTransactionDto,
    user: UserEntity,
  ): Promise<DefaultResponseDto> {
    const categoryTransaction =
      await this.categoryTransactionRepository.findOneByName(
        createCategoryTransactionDto.name,
      );

    if (categoryTransaction) {
      throw new BadRequestException(CATEGORY_TRANSACTION_NAME_IS_EXIST);
    }

    const newCategoryTransaction = new CategoryTransactionEntity();
    Object.assign(newCategoryTransaction, createCategoryTransactionDto);
    newCategoryTransaction.user = user;

    await this.categoryTransactionRepository.saveCategoryTransaction(
      newCategoryTransaction,
    );

    return {
      message: `Category transaction ${newCategoryTransaction.name} was successfully created`,
      statusCode: HttpStatus.OK,
    };
  }

  async update(
    categoryId: string,
    updateCategoryTransactionDto: UpdateCategoryTransactionDto,
    userId: string,
  ): Promise<DefaultResponseDto> {
    const categoryTransaction =
      await this.categoryTransactionRepository.findOne(categoryId, userId);

    if (!categoryTransaction) {
      throw new NotFoundException(NOT_FOUND_CATEGORY_TRANSACTION);
    }
    const oldCategoryName = categoryTransaction.name;
    categoryTransaction.name = updateCategoryTransactionDto.name;
    categoryTransaction.updatedAt = new Date();

    await this.categoryTransactionRepository.saveCategoryTransaction(
      categoryTransaction,
    );

    return {
      message: `Category name was successfully changed from ${oldCategoryName} to ${updateCategoryTransactionDto.name}`,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(
    categoryId: string,
    userId: string,
  ): Promise<DefaultResponseDto> {
    const categoryTransaction =
      await this.categoryTransactionRepository.getCategoryWithRelations(
        categoryId,
        userId,
      );

    if (!categoryTransaction) {
      throw new NotFoundException(NOT_FOUND_CATEGORY_TRANSACTION);
    }

    if (categoryTransaction.transactions.length) {
      throw new BadRequestException(ERROR_DELETE_CATEGORY_TRANSACTION);
    }

    await this.categoryTransactionRepository.removeCategory(
      categoryTransaction,
    );

    return {
      message: `Category ${categoryTransaction.name} was successful deleted`,
      statusCode: HttpStatus.OK,
    };
  }
}
