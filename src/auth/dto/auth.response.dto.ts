import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/core/dto/success.response.dto';
import { IToken } from '../types/token.interface';

export class AuthResponseDto extends SuccessResponseDto implements IToken {
  @ApiProperty({ type: String })
  accessToken: string;
}
