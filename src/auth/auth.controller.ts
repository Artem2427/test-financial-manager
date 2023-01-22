import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth.response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'User login', type: AuthResponseDto })
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: AuthDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({
    description: 'User Registration',
    type: AuthResponseDto,
  })
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() loginDto: AuthDto) {
    return await this.authService.register(loginDto);
  }
}
