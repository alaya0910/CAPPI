import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: config.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(config.get('API_PREFIX') || 'api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CAPPI API')
    .setDescription('AI Travel Concierge for LATAM - Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Users & Profiles')
    .addTag('Catalog')
    .addTag('Safety')
    .addTag('Trips & Itinerary')
    .addTag('Chat')
    .addTag('Recommendations')
    .addTag('Bookings')
    .addTag('Reviews')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 CAPPI Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
