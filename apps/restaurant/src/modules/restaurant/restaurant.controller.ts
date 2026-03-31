import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';
import { Order } from './schemas/order.schema';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Get Order
  @Get()
  async getOrders(): Promise<Order[]> {
    try {
      return await this.restaurantService.getOrders();
    } catch (err) {
      throw new HttpException(
        `Error fetching orders: ${err?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Get Order By ID
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    try {
      return await this.restaurantService.getOrderById(id);
    } catch (err) {
      throw new HttpException(
        `Error fetching order by ID: ${err?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Create Order
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.restaurantService.createOrder(createOrderDto);
    } catch (err) {
      throw new HttpException(
        `Error creating order: ${err?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Update Order
  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.restaurantService.updateOrder(id, updateOrderDto);
    } catch (err) {
      throw new HttpException(
        `Error updating order: ${err?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Reports
  @Get('reports/daily-sales')
  async dailySalesReport() {
    try {
      return await this.restaurantService.generateDailySalesReport();
    } catch (err) {
      throw new HttpException(
        `Error generating daily sales report: ${err?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
