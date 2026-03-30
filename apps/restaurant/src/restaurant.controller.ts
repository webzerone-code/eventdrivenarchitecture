import { Controller, Get } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Controller()
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  @Get()
  async getHello(): Promise<OrderDocument> {
    return await this.orderModel.insertOne({
      name: 'orderName',
      description: 'test',
      price: 10,
      status: 'ACTIVE',
      imageUrl: 'test',
    });
  }
}
