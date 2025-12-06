export class CreateReviewDto {
  userName: string;
  userImageUrl?: string;
  rating: number;
  comment: string;
  title?: string;
  productId: number;
}
