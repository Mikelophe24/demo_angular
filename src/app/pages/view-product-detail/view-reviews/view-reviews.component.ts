import { Component, input } from '@angular/core';
import { Product } from '../../../models/products';
import { RatingSummaryComponent } from '../rating-summary/rating-summary.component';

@Component({
  selector: 'app-view-reviews',
  standalone: true,
  imports: [RatingSummaryComponent],
  template: `
    <div class="div appViewPanel">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Customer Reviews</h2>
    </div>
    <app-rating-summary [product]="product()" />
    <div class="flex flex-col gap-6">
        @for (review of product().reviews; track review.id) {

        
            }
    </div>
</div>
  `,
  styles: ``,
})
export class ViewReviewsComponent {
  product = input.required<Product>();
}
