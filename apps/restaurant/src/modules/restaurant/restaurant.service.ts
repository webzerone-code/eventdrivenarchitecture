import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Error, isValidObjectId, Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { products } = createOrderDto;
    let totalOrderPrice = 0;
    const validatedProducts = products.map((product) => {
      const { quantity, unitePrice } = product;
      if (quantity < 1)
        throw new BadRequestException({
          message: 'Quantity must be greater than  1',
          error: 'Invalid Quantity',
        });
      product.totalUnitPrice = quantity * unitePrice;
      totalOrderPrice += product.totalUnitPrice;
      return { ...product };
    });
    const order = new this.orderModel({
      ...createOrderDto,
      products: validatedProducts,
      totalOrderPrice,
    });
    return await order.toObject();
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    if (!isValidObjectId(id))
      throw new BadRequestException({
        message: 'Invalid Order ID',
        error: 'Invalid ID',
      });

    if (updateOrderDto.products) {
      let totalOrderPrice = 0;
      const validatedProducts = updateOrderDto.products.map((product) => {
        const { quantity, unitePrice } = product;
        if (quantity < 1)
          throw new BadRequestException({
            message: 'Quantity must be greater than  1',
            error: 'Invalid Quantity',
          });
        product.totalUnitPrice = quantity * unitePrice;
        totalOrderPrice += product.totalUnitPrice;
        return { ...product };
      });
      updateOrderDto.products = validatedProducts;
      updateOrderDto.totalOrderPrice = totalOrderPrice;
    }
    const order = await this.orderModel.findOneAndUpdate(
      { _id: id },
      { $set: updateOrderDto },
    );
    if (!order) throw new BadRequestException('Order not found');
    return order;
  }
}
