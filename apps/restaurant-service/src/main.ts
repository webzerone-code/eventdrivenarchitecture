import { NestFactory } from '@nestjs/core';
import { RestaurantServiceModule } from './restaurant-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log(`Restaurant  listening on port ${process.env.port ?? 4000}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RestaurantServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'orders_queue', // Must match the name in definitions.json
        queueOptions: {
          durable: true, // Matches your definitions.json
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
