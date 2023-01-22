import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { UserEntity } from 'src/user/entity/user.entity';
import { CategoryTransactionService } from './category-transaction.service';
import { CreateCategoryTransactionDto } from './dto/create-category-transaction.dto';
import { GetAllCategoriesTransactionResponseDto } from './dto/get-all-categories-transaction.response.dto';
import { GetCategoryTransactionResponseDto } from './dto/get-category-transaction.response.dto';
import { UpdateCategoryTransactionDto } from './dto/update-category-transaction.dto';

@ApiTags('Category transaction flow')
@Controller('category-transaction')
export class CategoryTransactionController {
  constructor(
    private readonly categoryTransactionService: CategoryTransactionService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all categories transaction' })
  @ApiCreatedResponse({
    description: 'Get all categories transaction',
    type: GetAllCategoriesTransactionResponseDto,
  })
  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @User('id') userId: string,
  ): Promise<GetAllCategoriesTransactionResponseDto> {
    return this.categoryTransactionService.findAll(userId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get one category transaction' })
  @ApiCreatedResponse({
    description: 'Get one category transaction',
    type: GetCategoryTransactionResponseDto,
  })
  @Get(':categoryId')
  @UseGuards(AuthGuard)
  findOne(
    @Param('categoryId', IdValidationPipe) categoryId: string,
    @User('id') userId: string,
  ): Promise<GetCategoryTransactionResponseDto> {
    return this.categoryTransactionService.findOne(categoryId, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create category transaction' })
  @ApiCreatedResponse({
    description: 'Create category transaction',
    type: DefaultResponseDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(
    @Body() createCategoryTransactionDto: CreateCategoryTransactionDto,
    @User() user: UserEntity,
  ): Promise<DefaultResponseDto> {
    return this.categoryTransactionService.create(
      createCategoryTransactionDto,
      user,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category transaction' })
  @ApiCreatedResponse({
    description: 'Update category transaction',
    type: DefaultResponseDto,
  })
  @Patch(':categoryId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  update(
    @Param('categoryId', IdValidationPipe) categoryId: string,
    @Body() updateCategoryTransactionDto: UpdateCategoryTransactionDto,
    @User('id') userId: string,
  ): Promise<DefaultResponseDto> {
    return this.categoryTransactionService.update(
      categoryId,
      updateCategoryTransactionDto,
      userId,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete category transaction' })
  @ApiCreatedResponse({
    description: 'Delete category transaction',
    type: DefaultResponseDto,
  })
  @Delete(':categoryId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  remove(
    @Param('categoryId', IdValidationPipe) categoryId: string,
    @User('id') userId: string,
  ): Promise<DefaultResponseDto> {
    return this.categoryTransactionService.remove(categoryId, userId);
  }
}
