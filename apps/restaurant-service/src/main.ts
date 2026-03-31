import { NestFactory } from '@nestjs/core';
import { RestaurantServiceModule } from './restaurant-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log(
    `Restaurant  listening on port ${process.env.RESTAURANT_SERVICE_PORT ?? 4000}`,
  );
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RestaurantServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ ?? 'amqp://admin:admin@localhost:5673'],
        queue: process.env.MESSAGE_QUEUE ?? 'orders_queue',
        queueOptions: {
          durable: true,
        },
        deserializer: {
          deserialize: (value) => {
            const pattern = value.schema.name.replace('.Envelope', '');
            return { pattern, data: value.payload };
          },
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
