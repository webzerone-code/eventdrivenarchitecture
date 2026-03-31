import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);
  await app.listen(process.env.RESTAURANT_APP_PORT ?? 3000);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  console.log(
    `Restaurant Service started on port ${process.env.RESTAURANT_APP_PORT}`,
  );
}
bootstrap();
