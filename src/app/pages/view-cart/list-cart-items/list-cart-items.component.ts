import { Component, inject } from '@angular/core';
import { ViewPanelDirective } from '../../../directives/view-panel.directive';
import { EcommerceStore } from '../../../ecommerce';
import { ShowCartItemsComponent } from '../../show-cart-items/show-cart-items.component';

@Component({
  selector: 'app-list-cart-items',
  standalone: true,
  imports: [ViewPanelDirective, ShowCartItemsComponent],
  template: `
    <div appViewPanel>
      <h2 class="text-2xk font-bold mb-4"> Cart Items ({{store.cartCount()}})</h2>
      <div class="flex flex-col gap-6">
      @for (item of store.cartItems(); track item.product.id) {
          <app-show-cart-items [item]="item"></app-show-cart-items>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ListCartItemsComponent {
  store = inject(EcommerceStore);
}
