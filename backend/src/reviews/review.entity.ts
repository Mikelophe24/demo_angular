import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Star } from './star.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ nullable: true })
  userImageUrl: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column('text')
  comment: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  productId: number;

  @OneToOne(() => Star, { cascade: true, eager: true })
  @JoinColumn()
  star: Star;
}
