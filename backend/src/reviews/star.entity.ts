import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Star {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  value: number;

  @Column()
  userName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.stars, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  productId: number;
}
