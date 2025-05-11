import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Tasmil Finance API')
    .setDescription('API documentation for Tasmil Finance')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
