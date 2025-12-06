import { Component, computed, input } from '@angular/core';
import { Product } from '../../../models/products';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';

@Component({
  selector: 'app-rating-summary',
  standalone: true,
  imports: [StarRatingComponent],
  template: `
    <div class="flex items-center gap-12 p-8 bg-gray-50 rounded-xl mb-6">
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
  styles: [],
})
export class RatingSummaryComponent {
  product = input.required<Product>();

  totalReviews = computed(() => this.product().reviews?.length || this.product().reviewCount || 0);

  averageRating = computed(() => {
    const reviews = this.product().reviews;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / reviews.length).toFixed(1));
    }
    return this.product().rating || 0;
  });

  ratingBreakdown = computed(() => {
    const reviews = this.product().reviews;
    const totalReal = reviews ? reviews.length : 0;

    // 1. Use real reviews if available
    if (totalReal > 0) {
      return [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews!.filter((review) => review.rating === stars).length;
        return {
          stars,
          count,
          percentage: (count / totalReal) * 100,
        };
      });
    }

    // 2. Fallback: Simulate breakdown from summary stats
    const total = this.totalReviews();
    const avg = this.averageRating();

    if (total === 0) {
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: 0,
        percentage: 0,
      }));
    }

    // Distribute counts to match the average
    // Example: 4.6 avg.
    // Fraction 0.6 means 60% of reviews are "ceil" (5), 40% are "floor" (4).
    const ceil = Math.ceil(avg);
    const floor = Math.floor(avg);
    const fraction = avg - floor;

    // If avg is integer (e.g. 5.0), fraction is 0, countCeil is 0, countFloor is total.
    // Logic check: 5.0 -> floor 5, ceil 5.

    let countCeil = Math.round(total * fraction);
    let countFloor = total - countCeil;

    // Adjust for pure integer case (4.0 or 5.0) where fraction is nearly 0
    if (ceil === floor) {
      countCeil = 0;
      countFloor = total;
    }

    return [5, 4, 3, 2, 1].map((stars) => {
      let count = 0;
      if (stars === ceil) count += countCeil;
      if (stars === floor) count += countFloor;

      return {
        stars,
        count,
        percentage: (count / total) * 100,
      };
    });
  });
}
