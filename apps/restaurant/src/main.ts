import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';

async function bootstrap() {
  console.log(
    `Restaurant Service listening on port ${process.env.port ?? 3000}`,
  );
  const app = await NestFactory.create(RestaurantModule);
  await app.listen(3000);
}
bootstrap();
