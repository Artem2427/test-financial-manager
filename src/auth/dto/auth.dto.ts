import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({ type: String, name: 'email', required: true, maxLength: 256 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(256)
  readonly email: string;

  @ApiProperty({
    type: String,
    name: 'password',
    required: true,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 2000)
  readonly password: string;
}
