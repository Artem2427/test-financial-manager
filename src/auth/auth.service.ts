import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { IToken, TokenDecodeData } from './types/token.interface';
import { ConfigService } from '@nestjs/config';
import { EMAIL_IS_TAKEN, INVALID_EMAIL_OR_PASSWORD } from './errors/errors';
import { AuthResponseDto } from './dto/auth.response.dto';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(loginUserDto: AuthDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password', 'email'],
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException(INVALID_EMAIL_OR_PASSWORD);
    }

    const isPassEquals = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPassEquals) {
      throw new NotFoundException(INVALID_EMAIL_OR_PASSWORD);
    }

    return {
      ...this.generateToken({
        id: user.id,
        email: user.email,
      }),
      statusCode: HttpStatus.OK,
    };
  }

  async register(createUserDto: AuthDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new BadRequestException(EMAIL_IS_TAKEN);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const newUserFromDatabase = await this.userRepository.save(newUser);

    return {
      ...this.generateToken({
        id: newUserFromDatabase.id,
        email: newUserFromDatabase.email,
      }),
      statusCode: HttpStatus.OK,
    };
  }

  validateToken(token: string, secret: string): TokenDecodeData | null {
    try {
      const userData = <TokenDecodeData>jwt.verify(token, secret);
      return userData;
    } catch (error) {
      return null;
    }
  }

  generateToken(secretData: TokenDecodeData): IToken {
    const accessToken = jwt.sign(
      secretData,
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: '2h',
      },
    );

    return {
      accessToken,
    };
  }
}
