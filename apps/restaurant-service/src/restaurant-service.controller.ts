import { Controller } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantServiceService,
  ) {}

  @EventPattern('restaurant_cdc.restaurant.orders') // Match the routing key
  handleOrderChange(@Payload() data: any) {
    console.log('Received event:', data);
    const operation = data.op; // 'c' for create, 'u' for update, 'd' for delete
    const newOrderData = data.after;

    // console.log(
    //   `Received ${operation} event for Order ID: ${newOrderData._id}`,
    // );
    // Your logic here (e.g., notify user via Socket.IO)
  }
}
