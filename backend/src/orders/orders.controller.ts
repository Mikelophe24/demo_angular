import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() orderData: any): Promise<Order> {
    return this.ordersService.create(orderData);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.ordersService.updateStatus(+id, status);
  }
}
