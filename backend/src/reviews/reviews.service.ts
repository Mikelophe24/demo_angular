import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Star } from './star.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Star)
    private starsRepository: Repository<Star>,
    private productsService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<any> {
    console.log('Creating review with payload:', createReviewDto);
    const star = this.starsRepository.create({
      value: createReviewDto.rating,
      productId: createReviewDto.productId,
      userName: createReviewDto.userName,
    });
    const savedStar = await this.starsRepository.save(star);

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      star: savedStar,
    });
    const savedReview = await this.reviewsRepository.save(review);

    return {
      ...savedReview,
      rating: savedStar.value,
    };
  }

  async findAllByProduct(productId: number): Promise<any[]> {
    const reviews = await this.reviewsRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
      relations: ['star'],
    });

    return reviews.map((review) => ({
      ...review,
      rating: review.star?.value || 0,
    }));
  }
}
