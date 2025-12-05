import { Component, computed, input } from '@angular/core';
import { Product } from '../../../models/products';
import { count } from 'rxjs';

import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';

@Component({
  selector: 'app-rating-summary',
  standalone: true,
  imports: [StarRatingComponent],
  template: `
    <h3 class="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

    <div class="flex items-center gap-12 p-8 bg-gray-50 rounded-xl">
      <!-- Left Column: Overall Rating -->
      <div class="flex flex-col items-center min-w-[150px]">
        <div class="text-5xl font-bold text-gray-900 mb-2">{{ averageRating() }}</div>
        <div class="mb-2">
          <app-star-rating [rating]="averageRating()" />
        </div>
        <div class="text-sm text-gray-500">Based on {{ totalReviews() }} reviews</div>
      </div>

      <!-- Right Column: Rating Bars -->
      <div class="flex-1 w-full">
        @for (breakdown of ratingBreakdown(); track breakdown.stars) {
        <div class="flex items-center gap-4 mb-3 last:mb-0">
          <span class="text-sm font-medium w-6 text-gray-900">{{ breakdown.stars }}★</span>
          <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-out"
              [style.width.%]="breakdown.percentage"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-700 w-8 text-right">{{
            breakdown.count
          }}</span>
        </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class RatingSummaryComponent {
  product = input.required<Product>();
  totalReviews = computed(() => this.product().reviews.length);

  averageRating = computed(() => {
    const reviews = this.product().reviews;
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  });

  ratingBreakdown = computed(() => {
    const reviews = this.product().reviews;
    const total = reviews.length;

    if (total === 0) {
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: 0,
        percentage: 0,
      }));
    }

    const counts = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((review) => review.rating === stars).length;

      return {
        stars,
        count,
        percentage: (count / total) * 100,
      };
    });

    return counts;
  });
}
