import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface RatingOption {
  stars: number;
  label: string;
}

@Component({
  selector: 'app-rating-filter',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating-filter">
      <h3 class="filter-title">Đánh Giá</h3>

      <div class="rating-options">
        @for (option of visibleOptions(); track option.stars) {
        <div
          class="rating-option"
          [class.selected]="selectedRating() === option.stars"
          (click)="selectRating(option.stars)"
        >
          <div class="stars">
            @for (star of getStarArray(option.stars); track star) {
            <mat-icon class="star filled">star</mat-icon>
            } @for (emptyStar of getEmptyStarArray(option.stars); track emptyStar) {
            <mat-icon class="star empty">star_border</mat-icon>
            }
          </div>
          @if (option.label) {
          <span class="label">{{ option.label }}</span>
          }
        </div>
        }
      </div>

      <button class="show-more" (click)="toggleShowMore()">
        {{ showMore() ? 'Thu gọn' : 'Thêm' }}
        <mat-icon class="chevron" [class.rotated]="showMore()"> expand_more </mat-icon>
      </button>

      @if (selectedRating()) {
      <button class="clear-button" (click)="clearFilter()">Xóa bộ lọc</button>
      }
    </div>
  `,
  styles: [
    `
      .rating-filter {
        padding: 16px;
        background: white;
        border-radius: 4px;
      }

      .filter-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
      }

      .rating-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 8px;
      }

      .rating-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
      }

      .rating-option:hover {
        background: #f5f5f5;
      }

      .rating-option.selected {
        background: #fff3e0;
        border: 1px solid #ff9800;
      }

      .stars {
        display: flex;
        gap: 2px;
      }

      .star {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .star.filled {
        color: #ffc107;
      }

      .star.empty {
        color: #e0e0e0;
      }

      .label {
        font-size: 13px;
        color: #666;
        margin-left: 4px;
      }

      .show-more {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        padding: 8px;
        margin-top: 8px;
        background: transparent;
        border: none;
        color: #1976d2;
        font-size: 13px;
        cursor: pointer;
        transition: color 0.2s;
      }

      .show-more:hover {
        color: #1565c0;
      }

      .chevron {
        font-size: 18px;
        width: 18px;
        height: 18px;
        transition: transform 0.3s;
      }

      .chevron.rotated {
        transform: rotate(180deg);
      }

      .clear-button {
        width: 100%;
        padding: 8px;
        margin-top: 8px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        color: #666;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .clear-button:hover {
        background: #f5f5f5;
        color: #333;
      }
    `,
  ],
})
export class RatingFilterComponent {
  selectedRating = signal<number | null>(null);
  showMore = signal(false);

  ratingChange = output<number | null>();

  allOptions: RatingOption[] = [
    { stars: 5, label: '' },
    { stars: 4, label: 'trở lên' },
    { stars: 3, label: 'trở lên' },
    { stars: 2, label: 'trở lên' },
    { stars: 1, label: 'trở lên' },
  ];

  visibleOptions = signal<RatingOption[]>(this.allOptions.slice(0, 3));

  getStarArray(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStarArray(count: number): number[] {
    return Array(5 - count).fill(0);
  }

  selectRating(stars: number) {
    if (this.selectedRating() === stars) {
      this.selectedRating.set(null);
      this.ratingChange.emit(null);
    } else {
      this.selectedRating.set(stars);
      this.ratingChange.emit(stars);
    }
  }

  toggleShowMore() {
    const newShowMore = !this.showMore();
    this.showMore.set(newShowMore);

    if (newShowMore) {
      this.visibleOptions.set(this.allOptions);
    } else {
      this.visibleOptions.set(this.allOptions.slice(0, 3));
    }
  }

  clearFilter() {
    this.selectedRating.set(null);
    this.ratingChange.emit(null);
  }
}
