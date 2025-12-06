import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';
import { Star } from '../reviews/star.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 'general' })
  category: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Star, (star) => star.product)
  stars: Star[];
}
