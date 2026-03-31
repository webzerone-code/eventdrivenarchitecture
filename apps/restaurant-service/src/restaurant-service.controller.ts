import { Controller, Logger } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantServiceService,
  ) {}

  @EventPattern('restaurant_cdc.restaurant.orders') // Match the routing key
  async handleOrderChange(@Payload() data: any) {
    try {
      await this.restaurantServiceService.order(data);
    } catch (err) {
      Logger.error(err);
    }
  }
}
//docker exec -it  elasticsearch curl -X DELETE "http://localhost:9200/orders" -u elastic:password
