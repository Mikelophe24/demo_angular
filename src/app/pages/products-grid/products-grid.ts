import { Component, computed, inject, input, signal } from '@angular/core';
import { ProductCartComponent } from '../../components/product-cart/product-cart.component';
import { MatSidenavContainer, MatSidenavContent, MatSidenav } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PriceFilterComponent } from '../../components/price-filter/price-filter.component';
import { RatingFilterComponent } from '../../components/rating-filter/rating-filter.component';

import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { EcommerceStore } from '../../ecommerce';
import { ToggleWishlistButtonComponent } from '../../components/toggle-wishlist-button/toggle-wishlist-button.component';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [
    ProductCartComponent,
    TitleCasePipe,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatListItemTitle,
    RouterLink,
    ToggleWishlistButtonComponent,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    PriceFilterComponent,
    RatingFilterComponent,
  ],
  template: `
    <mat-sidenav-container class="h-full">
      <mat-sidenav
        mode="side"
        [opened]="store.isSidebarOpen()"
        class="w-80 border-r overflow-y-auto"
      >
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <mat-nav-list>
            @for(cat of categories(); track cat){
            <mat-list-item
              [activated]="cat === category()"
              class="my-1 rounded-md"
              [routerLink]="['/products', cat]"
            >
              <span matListItemTitle class="font-medium" [class.text-primary]="cat === category()"
                >{{ cat | titlecase }}
              </span>
            </mat-list-item>
            }
          </mat-nav-list>

          <!-- Price Filter -->
          <div class="mt-6 w-full">
            <app-price-filter (priceChange)="onPriceChange($event)" />
          </div>

          <!-- Rating Filter -->
          <div class="mt-4 w-full">
            <app-rating-filter (ratingChange)="onRatingChange($event)" />
          </div>

          <div class="mt-6 border-t pt-6">
            <h3 class="text-md font-bold mb-4">Sort By</h3>
            <mat-form-field appearance="outline" class="w-full">
              <mat-select [value]="store.sort()" (selectionChange)="updateSort($event.value)">
                <mat-option value="newest">Newest</mat-option>
                <mat-option value="price_asc">Price: Low to High</mat-option>
                <mat-option value="price_desc">Price: High to Low</mat-option>
                <mat-option value="name_asc">Name: A-Z</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-50 p-6 h-full">
        <div class="flex justify-between items-end mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">{{ category() | titlecase }}</h1>
            <p class="text-gray-500">
              {{ store.filteredProducts().length }}
              {{ store.filteredProducts().length <= 1 ? 'product' : 'products' }} found
            </p>
          </div>
        </div>

        <div class="responsive-grid">
          @for (product of store.filteredProducts(); track product.id ) {
          <div [style.view-transition-name]="'product-item-' + product.id">
            <app-product-cart [product]="product">
              <app-toggle-wishlist-button
                [style.view-transition-name]="'wishlist-button-' + product.id"
                class="!absolute z-10 top-3 right-3 !bg-white shadow-md rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                [product]="product"
              />
            </app-product-cart>
          </div>
          }
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ``,
})
export default class ProductsGrid {
  category = input<string>('all');
  store = inject(EcommerceStore);

  categories = signal<string[]>([
    'all',
    'electronics',
    'photography',
    'furniture',
    'fashion',
    'kitchen',
    'home',
    'accessories',
    'lifestyle',
  ]);

  constructor() {
    // Rely on effect or input change to update category,
    // but here we manually sync initially if needed, though inputs are reactive.
    // Ideally use effect(() => this.store.setCategory(this.category()));
  }

  // Use effect to sync input category to store
  // Since we are not using effect() here, we might rely on the router reloading component or input changes triggering something.
  // Actually, standard way with signals input is using effect.

  ngOnChanges() {
    this.store.setCategory(this.category());
  }

  updatePrice(min: number, max: number) {
    this.store.updateFilter({ minPrice: min, maxPrice: max, sort: this.store.sort() });
  }

  onPriceChange(priceRange: { min: number | null; max: number | null }) {
    this.store.updateFilter({
      minPrice: priceRange.min || 0,
      maxPrice: priceRange.max || 500, // Max $500 for current products
      sort: this.store.sort(),
    });
  }

  onRatingChange(rating: number | null) {
    // Update minRating in store
    this.store.setMinRating(rating);
  }

  updateSort(sort: string) {
    this.store.updateFilter({
      minPrice: this.store.minPrice(),
      maxPrice: this.store.maxPrice(),
      sort,
    });
  }
}
