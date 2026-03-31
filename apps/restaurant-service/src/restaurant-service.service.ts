import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class RestaurantServiceService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  async order(data: any) {
    const operation = data.op; // 'c' for create, 'u' for update, 'd' for delete
    const newOrderData = data.after;
    if (operation === 'c' || operation === 'u') {
      const rawData =
        typeof data.after === 'string' ? JSON.parse(data.after) : data.after;
      if (!rawData) return;

      const products: any[] = rawData.products.map((product: any) => {
        return {
          productName: product.productName,
          unitePrice: parseFloat(product.unitePrice).toFixed(2),
          quantity: parseInt(product.quantity).toFixed(2),
          totalUnitPrice: parseFloat(product.totalUnitPrice).toFixed(2),
        };
      });

      const elasticId = String(rawData._id?.$oid || rawData._id);

      const getCleanDate = (val: any) => {
        if (!val) return new Date();
        const dateValue = val.$date || val.$numberLong || val;
        return new Date(dateValue);
      };
      const response = await this.elasticsearchService.index({
        index: 'orders',
        id: elasticId,
        document: {
          id: elasticId,
          orderID: rawData.orderID,
          status: rawData.status,
          customer: rawData.customer,
          products: products,
          totalPrice: parseFloat(rawData.totalPrice).toFixed(2),
          createdAt: getCleanDate(rawData.createdAt),
          updatedAt: getCleanDate(rawData.updatedAt),
        },
        refresh: true,
      });
    }
  }
}
