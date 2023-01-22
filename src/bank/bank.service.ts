import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { DefaultResponseDto } from 'src/core/dto/default.response';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateBankDto } from './dto/create-bank.dto';

import { GetAllBanksResponseDto } from './dto/get-all-banks.response.dto';
import { GetBankResponseDto } from './dto/get-bank.response.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { BankEntity } from './entity/bank.entity';
import { BANK_IS_TAKEN, BANK_NOT_FOUND, DELETE_BANK } from './errors/errors';
import { BankRepository } from './repository/bank.repository';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async getOne(bankId: string, userId: string): Promise<GetBankResponseDto> {
    const bank = await this.bankRepository.findOne(bankId, userId);

    if (!bank) {
      throw new NotFoundException(BANK_NOT_FOUND);
    }

    return { bank, statusCode: HttpStatus.OK };
  }

  async getAll(userId: string): Promise<GetAllBanksResponseDto> {
    const banks = await this.bankRepository.findAll(userId);

    return {
      banks,
      statusCode: HttpStatus.OK,
    };
  }

  async createOne(
    createBankDto: CreateBankDto,
    user: UserEntity,
  ): Promise<DefaultResponseDto> {
    const bank = await this.bankRepository.findOneByName(createBankDto.name);

    if (bank) {
      throw new BadRequestException(BANK_IS_TAKEN);
    }

    const newBank = new BankEntity();
    Object.assign(newBank, createBankDto);
    newBank.user = user;

    await this.bankRepository.saveBank(newBank);

    return {
      message: `Bank ${newBank.name} was successfully created`,
      statusCode: HttpStatus.OK,
    };
  }

  async updateOne({
    bankId,
    userId,
    updateBankDto,
  }: {
    bankId: string;
    userId: string;
    updateBankDto: UpdateBankDto;
  }): Promise<DefaultResponseDto> {
    const bank = await this.bankRepository.findOne(bankId, userId);

    if (!bank) {
      throw new NotFoundException(BANK_NOT_FOUND);
    }
    const oldBankName = bank.name;
    bank.name = updateBankDto.name;
    bank.updatedAt = new Date();

    await this.bankRepository.saveBank(bank);

    return {
      message: `Bank name was successfully changed from ${oldBankName} to ${updateBankDto.name}`,
      statusCode: HttpStatus.OK,
    };
  }

  async deleteOne(bankId: string, userId: string): Promise<DefaultResponseDto> {
    const bank = await this.bankRepository.findOneWithRelations(bankId, userId);

    if (!bank) {
      throw new NotFoundException(BANK_NOT_FOUND);
    }

    if (bank.transactions.length) {
      throw new BadRequestException(DELETE_BANK);
    }

    await this.bankRepository.remove(bank);

    return {
      message: `Bank ${bank.name} was successful deleted`,
      statusCode: HttpStatus.OK,
    };
  }
}
