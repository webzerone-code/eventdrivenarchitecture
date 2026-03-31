import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ElasticService } from './elastic.service';

@Controller('elastic')
export class ElasticController {
  constructor(private readonly elasticService: ElasticService) {}
  @Get('search')
  async searchOrders(@Query('q') query: string) {
    if (!query) return { message: 'Please provide a search query' };
    try {
      return await this.elasticService.searchOrders(query);
    } catch (error) {
      throw new HttpException(
        `Error fetching orders: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
