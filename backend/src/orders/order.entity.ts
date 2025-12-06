import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
