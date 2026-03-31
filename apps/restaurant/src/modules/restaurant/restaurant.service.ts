import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.find().sort({ createdAt: -1 }).exec();
    } catch (err) {
      throw new BadRequestException({
        message: `Error fetching orders: ${err?.message}`,
        error: 'Internal Server Error',
      });
    }
  }
  async getOrderById(id: string): Promise<Order> {
    if (!isValidObjectId(id))
      throw new BadRequestException({
        message: 'Invalid Order ID',
        error: 'Invalid ID',
      });
    const order = await this.orderModel.findById(id);
    if (!order) throw new BadRequestException('Order not found');
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { products } = createOrderDto;
    let totalOrderPrice = 0;
    const seenProductNames = new Set<string>();
    const validatedProducts = products.map((product) => {
      const { quantity, unitePrice } = product;
      if (seenProductNames.has(product.productName)) {
        throw new BadRequestException({
          message: `Duplicate product found: ${product.productName}`,
          error: 'Validation Error',
          details: 'Each product in the order must have a unique name.',
        });
      }
      if (quantity < 1)
        throw new BadRequestException({
          message: 'Quantity must be greater than  1',
          error: 'Invalid Quantity',
        });
      seenProductNames.add(product.productName);
      product.totalUnitPrice = quantity * unitePrice;
      totalOrderPrice += product.totalUnitPrice;
      return { ...product };
    });
    const order = new this.orderModel({
      ...createOrderDto,
      products: validatedProducts,
      totalOrderPrice,
    });
    await order.save();
    await this.cacheManager.del('dailySalesReport');
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
      const seenProductNames = new Set<string>();
      const validatedProducts = updateOrderDto.products.map((product) => {
        const { quantity, unitePrice } = product;
        if (quantity < 1)
          throw new BadRequestException({
            message: 'Quantity must be greater than  1',
            error: 'Invalid Quantity',
          });
        if (seenProductNames.has(product.productName)) {
          throw new BadRequestException({
            message: `Duplicate product found: ${product.productName}`,
            error: 'Validation Error',
            details: 'Each product in the order must have a unique name.',
          });
        }
        seenProductNames.add(product.productName);
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
    await this.cacheManager.del('dailySalesReport');
    return order;
  }

  async generateDailySalesReport() {
    const cacheKey = 'dailySalesReport';
    const cachedReport = await this.cacheManager.get(cacheKey);
    if (cachedReport) {
      return cachedReport;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const report = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: 'COMPLETED',
        },
      },

      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
                orderCount: { $sum: 1 },
              },
            },
          ],
          topItems: [
            { $unwind: '$products' },
            {
              $group: {
                _id: '$products.productName',
                totalQuantitySold: { $sum: '$products.quantity' },
              },
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 },
          ],
        },
      },

      {
        $project: {
          totalRevenue: { $arrayElemAt: ['$stats.totalRevenue', 0] },
          numberOfOrders: { $arrayElemAt: ['$stats.orderCount', 0] },
          topSellingItems: '$topItems',
        },
      },
    ]);
    await this.cacheManager.set(cacheKey, report, 3600000);
    return report;
  }
}
