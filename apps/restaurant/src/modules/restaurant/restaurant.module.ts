import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import dbConfig from '../../config/db.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import redisConfig from '../../config/redis.config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import elasticConfig from '../../config/elastic.config';
import { ElasticController } from './elastic.controller';
import { ElasticService } from './elastic.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, redisConfig, elasticConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (
        mongoConfig: ConfigType<typeof dbConfig>,
      ): { uri: string } => ({
        uri: mongoConfig.mongoUrlConnection.uri,
      }),
    }),
    CacheModule.registerAsync({
      inject: [redisConfig.KEY],
      isGlobal: true,
      useFactory: (cacheConfig: ConfigType<typeof redisConfig>) => ({
        store: redisStore,
        socket: {
          host: cacheConfig.REDIS_HOST,
          port: cacheConfig.REDIS_PORT,
        },
        ttl: 86400000,
      }),
    }),
    ElasticsearchModule.registerAsync({
      inject: [elasticConfig.KEY],
      useFactory: (elasticConf: ConfigType<typeof elasticConfig>) => ({
        node: elasticConf.elasticConnection.url,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        auth: {
          username: String(elasticConf.elasticConnection.username),
          password: String(elasticConf.elasticConnection.password),
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [RestaurantController, ElasticController],
  providers: [RestaurantService, ElasticService],
})
export class RestaurantModule {}
