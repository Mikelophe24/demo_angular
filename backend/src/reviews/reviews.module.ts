import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { ProductsModule } from '../products/products.module';

import { Star } from './star.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Star]), ProductsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
