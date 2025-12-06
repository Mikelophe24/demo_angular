import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="price-filter-container">
      <h3 class="filter-title">Khoảng Giá</h3>

      <div class="price-inputs-wrapper">
        <input
          type="number"
          [(ngModel)]="minPrice"
          placeholder="0"
          class="price-input"
          min="0"
          step="10"
        />
        <span class="separator">—</span>
        <input
          type="number"
          [(ngModel)]="maxPrice"
          placeholder="500"
          class="price-input"
          min="0"
          step="10"
        />
      </div>

      <button class="apply-btn" (click)="applyFilter()" type="button">ÁP DỤNG</button>
    </div>
  `,
  styles: [
    `
      .price-filter-container {
        width: 100%;
        padding: 16px;
        background: white;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .filter-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
      }

      .price-inputs-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
        width: 100%;
      }

      .price-input {
        flex: 1;
        min-width: 0;
        padding: 10px 8px;
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        font-size: 14px;
        text-align: center;
        outline: none;
        transition: border-color 0.2s;
        background: white;
        box-sizing: border-box;
      }

      .price-input:focus {
        border-color: #ff6b35;
      }

      .price-input::placeholder {
        color: #999;
      }

      /* Remove number input arrows */
      .price-input::-webkit-outer-spin-button,
      .price-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .price-input[type='number'] {
        -moz-appearance: textfield;
      }

      .separator {
        color: #666;
        font-weight: 400;
        font-size: 14px;
        flex-shrink: 0;
      }

      .apply-btn {
        width: 100%;
        padding: 10px;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .apply-btn:hover {
        background: #ff5722;
      }

      .apply-btn:active {
        transform: scale(0.98);
      }
    `,
  ],
})
export class PriceFilterComponent {
  minPrice: number | null = 0;
  maxPrice: number | null = 0;

  priceChange = output<{ min: number | null; max: number | null }>();

  applyFilter() {
    this.priceChange.emit({
      min: this.minPrice,
      max: this.maxPrice,
    });
  }
}
