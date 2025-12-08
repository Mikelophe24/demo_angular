import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HeaderActions } from '../header-actions/header-actions';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { EcommerceStore } from '../../ecommerce';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbar, MatIconButton, MatIcon, HeaderActions, SearchBarComponent],
  template: `
    <mat-toolbar class="w-full elevated py-2 z-10 relative bg-gray-50">
      <div class="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-4">
        <!-- Left: Menu + Store Name -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button matIconButton class="text-gray-700" (click)="store.toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="text-gray-800 font-medium">Modern Store</span>
        </div>

        <!-- Center: Search Bar -->
        <div class="flex-1 max-w-[650px] mx-4" *ngIf="!isProductDetailPage()">
          <app-search-bar />
        </div>

        <!-- Right: Header Actions -->
        <div class="flex-shrink-0">
          <app-header-actions />
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: ``,
})
export class Header {
  store = inject(EcommerceStore);
  private router = inject(Router);

  // Check if current route is product detail, wishlist, or cart page
  isProductDetailPage = toSignal(
    this.router.events.pipe(
      map(() => {
        const url = this.router.url;
        return url.includes('/product/') || url.includes('/wishlist') || url.includes('/cart');
      })
    ),
    {
      initialValue: (() => {
        const url = this.router.url;
        return url.includes('/product/') || url.includes('/wishlist') || url.includes('/cart');
      })(),
    }
  );
}
