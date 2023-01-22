import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ type: String, name: 'name', required: true, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly name: string;
}
