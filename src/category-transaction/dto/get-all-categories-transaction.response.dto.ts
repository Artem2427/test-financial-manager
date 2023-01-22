import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/core/dto/success.response.dto';
import { CategoryTransactionEntity } from '../entity/category-transaction.entity';

export class GetAllCategoriesTransactionResponseDto extends SuccessResponseDto {
  @ApiProperty({ type: () => [CategoryTransactionEntity] })
  categoriesTransactions: CategoryTransactionEntity[];
}
