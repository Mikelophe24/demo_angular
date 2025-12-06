import { UserReview } from './user-review';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  category: string;

  reviews: UserReview[];
};
