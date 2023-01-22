import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 4444;

  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Financial Manager API')
    .setDescription('Documentations REST API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Enter JWT token',
        scheme: 'bearer',
        name: 'Authorization',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT);
}
bootstrap();
