import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    sort?: string,
  ): Promise<any[]> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'review')
      .leftJoinAndSelect('product.stars', 'star');

    if (category && category !== 'all') {
      query.andWhere('product.category = :category', { category });
    }

    if (minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (sort) {
      switch (sort) {
        case 'price_asc':
          query.orderBy('product.price', 'ASC');
          break;
        case 'price_desc':
          query.orderBy('product.price', 'DESC');
          break;
        case 'name_asc':
          query.orderBy('product.name', 'ASC');
          break;
        case 'newest':
          query.orderBy('product.id', 'DESC');
          break;
      }
    }

    const products = await query.getMany();

    // Compute virtual properties for frontend compatibility
    return products.map((p) => {
      const reviewCount = p.reviews.length;
      const totalRating = p.stars.reduce((sum, s) => sum + s.value, 0);
      const rating =
        p.stars.length > 0
          ? parseFloat((totalRating / p.stars.length).toFixed(1))
          : 0;

      // Optimization: Don't send all review text properties in list view to save bandwidth
      // But for simplicity now, we send them or clear them.
      // Let's clear them in list view to avoid huge payloads, frontend only needs stats.
      return { ...p, reviewCount, rating };
    });
  }

  async findOne(id: number): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['reviews', 'stars'],
    });

    if (!product) return null;

    const reviewCount = product.reviews.length;
    const totalRating = product.stars.reduce((sum, s) => sum + s.value, 0);
    const rating =
      product.stars.length > 0
        ? parseFloat((totalRating / product.stars.length).toFixed(1))
        : 0;

    return { ...product, reviewCount, rating };
  }

  create(product: Partial<Product>): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, product);
    return this.productsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
