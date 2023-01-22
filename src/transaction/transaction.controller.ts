import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { IdValidationPipe } from 'src/core/pipes/id-validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PaginateResponseDto } from './dto/paginate.response.dto';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import { RemoveTransactionQueryDto } from './dto/remove.query.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction flow')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all transactions with paginate' })
  @ApiCreatedResponse({
    description: 'Get all transactions with paginate',
    type: PaginateResponseDto,
  })
  @Get(':bankId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getAllTransactionByBank(
    @Param('bankId', IdValidationPipe) bankId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginateResponseDto> {
    return await this.transactionService.getAllTransactionByBank({
      bankId,
      paginationQueryDto,
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create transaction' })
  @ApiCreatedResponse({
    description: 'Create transaction',
    type: DefaultResponseDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User('id') userId: string,
  ): Promise<DefaultResponseDto> {
    return await this.transactionService.create(createTransactionDto, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create transaction' })
  @ApiCreatedResponse({
    description: 'Create transaction',
    type: DefaultResponseDto,
  })
  @Delete(':transactionId')
  @UseGuards(AuthGuard)
  async remove(
    @Param('transactionId', IdValidationPipe) transactionId: string,
    @Query() removeTransactionQueryDto: RemoveTransactionQueryDto,
    @User('id') userId: string,
  ): Promise<DefaultResponseDto> {
    return await this.transactionService.remove(
      transactionId,
      removeTransactionQueryDto.bankId,
      userId,
    );
  }
}
