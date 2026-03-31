import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
    } catch (error) {
      throw new HttpException(
        `Error fetching orders: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Get Order By ID
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    try {
      return await this.restaurantService.getOrderById(id);
    } catch (error) {
      throw new HttpException(
        `Error fetching order by ID: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Create Order
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.restaurantService.createOrder(createOrderDto);
    } catch (error) {
      throw new HttpException(
        `Error creating order: ${error?.message}`,
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
    } catch (error) {
      throw new HttpException(
        `Error updating order: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Reports
  @Get('reports/daily-sales')
  async dailySalesReport() {
    try {
      return await this.restaurantService.generateDailySalesReport();
    } catch (error) {
      throw new HttpException(
        `Error generating daily sales report: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
