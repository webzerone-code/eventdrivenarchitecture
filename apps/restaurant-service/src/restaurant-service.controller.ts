import { Controller } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller()
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantServiceService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @EventPattern('restaurant_cdc.restaurant.orders') // Match the routing key
  async handleOrderChange(@Payload() data: any) {
    //console.log('Received event:', data);
    const operation = data.op; // 'c' for create, 'u' for update, 'd' for delete
    const newOrderData = data.after;
    const rawData =
      typeof data.after === 'string' ? JSON.parse(data.after) : data.after;

    if (!rawData) return;
    const elasticId = rawData._id?.$oid || rawData._id;
    const cleanDoc = {
      ...rawData,
      id: elasticId, // Add a clean string ID
      createdAt: rawData.createdAt?.$date || rawData.createdAt, // Extract number from $date
      updatedAt: rawData.updatedAt?.$date || rawData.updatedAt, // Extract number from $date
    };

    delete cleanDoc._id;
    delete cleanDoc.__v;
    console.log(newOrderData);
    await this.elasticsearchService.index({
      index: 'orders',
      id: String(elasticId),
      document: {
        name: rawData.name,
        description: rawData.description,
        price: rawData.price,
        status: rawData.status,
        imageUrl: rawData.imageUrl,
        createdAt: new Date(rawData.createdAt), // Converts timestamp to Date object
        updatedAt: new Date(rawData.updatedAt),
      }, // Use 'body: cleanDoc' if you get a TS error
      refresh: true,
    });
  }
}
