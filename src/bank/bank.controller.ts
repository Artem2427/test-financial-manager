import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DefaultResponseDto } from 'src/core/dto/default.response';
import { IdValidationPipe } from '../core/pipes/id-validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { GetAllBanksResponseDto } from './dto/get-all-banks.response.dto';
import { GetBankResponseDto } from './dto/get-bank.response.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@ApiTags('Bank flow')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get one' })
  @ApiCreatedResponse({
    description: 'Create bank',
    type: GetBankResponseDto,
  })
  @Get('one/:bankId')
  @UseGuards(AuthGuard)
  async getOne(
    @Param('bankId', IdValidationPipe) bankId: string,
    @User('id') userId: string,
  ): Promise<GetBankResponseDto> {
    return await this.bankService.getOne(bankId, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all banks' })
  @ApiCreatedResponse({
    description: 'Get all banks',
    type: GetAllBanksResponseDto,
  })
  @Get('all')
  @UseGuards(AuthGuard)
  async getAll(@User('id') userId: string): Promise<GetAllBanksResponseDto> {
    return await this.bankService.getAll(userId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new bank' })
  @ApiCreatedResponse({
    description: 'Create bank',
    type: DefaultResponseDto,
  })
  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createOne(
    @User() user: UserEntity,
    @Body() createBankDto: CreateBankDto,
  ): Promise<DefaultResponseDto> {
    return await this.bankService.createOne(createBankDto, user);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update bank' })
  @ApiCreatedResponse({
    description: 'Update bank',
    type: DefaultResponseDto,
  })
  @Patch(':bankId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateOne(
    @User('id') userId: string,
    @Param('bankId', IdValidationPipe) bankId: string,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    return await this.bankService.updateOne({
      bankId,
      updateBankDto,
      userId,
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete bank' })
  @ApiCreatedResponse({
    description: 'Delete bank',
    type: DefaultResponseDto,
  })
  @Delete(':bankId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deleteOne(
    @Param('bankId', IdValidationPipe) bankId: string,
    @User('id') userId: string,
  ): Promise<DefaultResponseDto> {
    return await this.bankService.deleteOne(bankId, userId);
  }
}
