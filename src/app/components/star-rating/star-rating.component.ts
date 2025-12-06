import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIcon, DecimalPipe],
  template: `
    <div class="flex items-center gap-1">
      <div class="flex items-center mr-1">
        @for (star of starArray(); track $index) {
        <mat-icon
          class="!text-lg"
          [inline]="true"
          [class]="star ? '!text-yellow-400' : '!text-gray-300'"
        >
          {{ star ? 'star' : 'star_border' }}
        </mat-icon>
        }
      </div>

      <span class="text-sm font-medium text-gray-700 mr-2">
        {{ rating() | number : '1.1-1' }}
      </span>

      <span class="text-sm text-gray-500">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styles: ``,
})
export class StarRatingComponent {
  rating = input.required<number>();

  starArray = computed(() => {
    const fullStars = Math.floor(this.rating());
    return Array(5)
      .fill(false)
      .map((_, index) => index < fullStars);
  });
}
