import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchOrders(searchQuery: string) {
    const result = await this.elasticsearchService.search({
      index: 'orders',
      body: {
        query: {
          bool: {
            should: [
              {
                prefix: {
                  'orderID.keyword': {
                    value: searchQuery,
                    boost: 2,
                  },
                },
              },
              {
                term: {
                  'status.keyword': searchQuery,
                },
              },
              {
                multi_match: {
                  query: searchQuery,
                  fields: [
                    'customer.name',
                    'customer.email',
                    'customer.phone',
                    'products.productName.keyword',
                  ],
                  fuzziness: 0,
                },
              },
              // {
              //   nested: {
              //     path: 'products',
              //     ignore_unmapped: true,
              //     query: {
              //       prefix: { 'products.productName': searchQuery },
              //     },
              //   },
              // },
            ],
          },
        },
      },
    });
    return result.hits.hits.map((hit) => hit._source);
  }
}
