import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
    });
  }

  async create(orderData: any): Promise<Order> {
    // orderData expect: { customerName, customerEmail, items: [{ productId, quantity }] }

    // Calculate total and prepare items
    const items: OrderItem[] = [];
    let total = 0;

    for (const itemRequest of orderData.items) {
      const product = await this.productsService.findOne(itemRequest.productId);
      if (!product) continue;

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.productId = product.id;
      orderItem.quantity = itemRequest.quantity;
      orderItem.price = product.price; // Snapshot price

      items.push(orderItem);
      total += Number(product.price) * itemRequest.quantity;
    }

    const order = new Order();
    order.customerName = orderData.customerName;
    order.customerEmail = orderData.customerEmail;
    order.totalAmount = total;
    order.items = items;

    return this.ordersRepository.save(order);
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    await this.ordersRepository.update(id, { status });
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }
}
