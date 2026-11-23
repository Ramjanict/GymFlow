import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev flexible
      }
    },
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('GymFlow Multi-Tenant SaaS API')
    .setDescription(
      'Enterprise multi-tenant gym management, class scheduling, membership, and booking API.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Organizations')
    .addTag('Branches')
    .addTag('Classes')
    .addTag('Schedules')
    .addTag('Sessions')
    .addTag('Bookings')
    .addTag('Memberships')
    .addTag('Attendance')
    .addTag('Dashboard')
    .addTag('Upload')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 GymFlow API Gateway running on http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger API Documentation on http://localhost:${port}/api/docs`);
}

bootstrap();
