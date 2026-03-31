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

    // 1. Get the Clean ID (String)
    const elasticId = String(rawData._id?.$oid || rawData._id);

    // 2. Safe Date Extraction (Mongo formats: { $date: 123 } or { $date: "string" })
    const getCleanDate = (val: any) => {
      if (!val) return new Date();
      const dateValue = val.$date || val.$numberLong || val;
      return new Date(dateValue);
    };

    // 3. Perform Indexing
    const response = await this.elasticsearchService.index({
      index: 'orders',
      id: elasticId,
      document: {
        id: elasticId,
        name: rawData.name,
        description: rawData.description,
        price: rawData.price,
        status: rawData.status,
        imageUrl: rawData.imageUrl,
        createdAt: getCleanDate(rawData.createdAt),
        updatedAt: getCleanDate(rawData.updatedAt),
      },
      refresh: true,
    });
  }
}
//docker exec -it  elasticsearch curl -X DELETE "http://localhost:9200/orders" -u elastic:password
