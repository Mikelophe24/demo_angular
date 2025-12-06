import { Component, computed, inject, input, signal } from '@angular/core';
import { Product } from '../../../models/products';
import { TitleCasePipe } from '@angular/common';
import { StockStatusComponent } from '../stock-status/stock-status.component';
import { QtySelector } from '../../../components/qty-selector/qty-selector';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { ToggleWishlistButtonComponent } from '../../../components/toggle-wishlist-button/toggle-wishlist-button.component';
import { EcommerceStore } from '../../../ecommerce';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    TitleCasePipe,
    StockStatusComponent,
    QtySelector,
    MatIcon,
    MatButtonModule,
    ToggleWishlistButtonComponent,
    MatIconButton,
    StarRatingComponent,
  ],
  template: `
    <div class="text-xs rounded-xl bg-gray-100 px-2 py-1 w-fit mb-2">
      {{ product().category | titlecase }}
    </div>
    <h1 class="text-2xl font-extrabold mb-3">{{ product().name }}</h1>
    <app-star-rating [rating]="averageRating()" class="mb-3 block">
      {{ averageRating() }}({{ totalReviews() }} reviews)
    </app-star-rating>
    <p class="text-3xl font-extrabold mb-4">{{ product().price }}</p>
    <app-stock-status class="mb-4" [inStock]="product().inStock" />

    <p class="font-semibold mb-2">Description</p>
    <p class="text-gray-600 border-b border-gray-200 pb-4">{{ product().description }}</p>

    <div class="flex items-center gap-2 mb-3 pt-4">
      <span class="font-semibold">Quantity:</span>
      <app-qty-selector [quantity]="quantity()" (qtyUpdate)="quantity.set($event)" />
    </div>

    <div class="flex gap-4 mb border-b border-gray-200 pb-4">
      <button
        matButton="filled"
        class="w-2/3 flex items-center gap-2"
        (click)="store.addToCart(product(), quantity())"
        [disabled]="!product().inStock"
      >
        <mat-icon>shopping_cart</mat-icon>
        {{ product().inStock ? 'Add to Cart' : 'Out of Stock' }}
      </button>
      <app-toggle-wishlist-button [product]="product()" />
      <button matIconButton>
        <mat-icon>share</mat-icon>
      </button>
    </div>
    <div class="pt-6 flex flex-col gap-2 text-gray-700 text-xs">
      <div class="flex items-center gap-3">
        <mat-icon class="small">local_shipping</mat-icon>
        <span>Free shipping on orders over $50</span>
      </div>
      <div class="flex items-center gap-3">
        <mat-icon class="small">autorenew</mat-icon>
        <span>30-day return policy</span>
      </div>
      <div class="flex items-center gap-3">
        <mat-icon class="small">shield</mat-icon>
        <span>2 years warranty included</span>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductInfoComponent {
  product = input.required<Product>();

  quantity = signal(1);

  store = inject(EcommerceStore);

  totalReviews = computed(() => this.product().reviews?.length || this.product().reviewCount || 0);

  averageRating = computed(() => {
    const reviews = this.product().reviews;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / reviews.length).toFixed(1));
    }
    return this.product().rating || 0;
  });
}
