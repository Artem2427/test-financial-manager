import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeORMConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    url:
      configService.get('DATABASE_URL_PROD') ??
      configService.get('POSTGRES_URI'),
    ssl: configService.get('DATABASE_URL_PROD')
      ? {
          rejectUnauthorized: false,
        }
      : false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  };
};
