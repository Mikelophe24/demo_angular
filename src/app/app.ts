import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { EcommerceStore } from './ecommerce';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  template: `
    <app-header/>
    <div class="h-[calc(100%-64px)] overflow-auto">
      <router-outlet />
    </div>
    

  `,
  styles: [],
})
export class App {
  private store = inject(EcommerceStore);

  constructor() {
    // Load products từ JSON Server khi app khởi động
    this.store.loadProducts();
  }
}
