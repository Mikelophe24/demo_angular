import { Component, computed, inject, input } from '@angular/core';
import { EcommerceStore } from '../../ecommerce';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ViewReviewsComponent } from './view-reviews/view-reviews.component';
@Component({
  selector: 'app-view-product-detail',
  standalone: true,
  imports: [BackButtonComponent, ProductInfoComponent, ViewReviewsComponent],
  template: ` <div class="mx-auto max-w-[1200px] py-6">
    <app-back-button class="mb-6" [navigateTo]="backRoute()">Continue Shopping</app-back-button>

    @if(store.selectedProduct() ; as product){
    <div class="flex gap-8 mb-8">
      <img
        [src]="product.imageUrl"
        class="w-[500px] h-[550px] object-cover rounded-lg"
        [style.view-transition-name]="'product-image-' + product.id"
      />
      <div class="flex-1">
        <app-product-info [product]="product"></app-product-info>
      </div>
    </div>
    <app-view-reviews [product]="product"></app-view-reviews>

    }
  </div>`,
  styles: ``,
})
export default class ViewProductDetailComponent {
  productId = input.required<string>();
  store = inject(EcommerceStore);

  constructor() {
    this.store.setProductId(this.productId);
  }

  backRoute = computed(() => `/products/${this.store.category()}`);
}
