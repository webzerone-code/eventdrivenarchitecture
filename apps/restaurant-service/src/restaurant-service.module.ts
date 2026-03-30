import { Module } from '@nestjs/common';
import { RestaurantServiceController } from './restaurant-service.controller';
import { RestaurantServiceService } from './restaurant-service.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        auth: {
          username: 'elastic',
          password: 'password',
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  controllers: [RestaurantServiceController],
  providers: [RestaurantServiceService],
})
export class RestaurantServiceModule {}
