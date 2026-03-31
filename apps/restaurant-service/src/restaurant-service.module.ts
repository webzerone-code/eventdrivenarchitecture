import { Module } from '@nestjs/common';
import { RestaurantServiceController } from './restaurant-service.controller';
import { RestaurantServiceService } from './restaurant-service.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigType } from '@nestjs/config';
import elasticConfig from './config/elastic.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [elasticConfig] }),
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
  ],
  controllers: [RestaurantServiceController],
  providers: [RestaurantServiceService],
})
export class RestaurantServiceModule {}
