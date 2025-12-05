import { Component, effect, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EcommerceStore } from '../../ecommerce';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  template: `
    <div class="w-full">
      <mat-form-field appearance="outline" class="w-full">
        <mat-icon matPrefix class="text-gray-500">search</mat-icon>
        <input
          matInput
          [value]="searchQuery()"
          (input)="onInput($event)"
          placeholder="Search products..."
        />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .mat-mdc-form-field {
        width: 100%;
      }
      :host ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: white;
        border-radius: 24px;
      }
      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    `,
  ],
})
export class SearchBarComponent {
  store = inject(EcommerceStore);
  router = inject(Router);
  searchQuery = signal('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Effect to watch search query changes and update store with debounce
    effect(() => {
      const query = this.searchQuery();
      
      // Clear previous timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // Debounce the search update
      this.debounceTimer = setTimeout(() => {
        const trimmedQuery = query.trim();
        this.store.setSearchQuery(trimmedQuery);
        
        // Navigate to products page if user starts searching and not already there
        if (trimmedQuery && !this.router.url.includes('/products')) {
          this.router.navigate(['/products/all']);
        }
      }, 300);
    });
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }
}

