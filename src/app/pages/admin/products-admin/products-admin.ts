import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Product } from '../../../models/products';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToasterService } from '../../../services/toaster.service';

import { MatDialog } from '@angular/material/dialog';
import { ProductEditorDialogComponent } from '../../../components/product-editor-dialog/product-editor-dialog';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Manage Products</h2>
        <button mat-raised-button color="primary" (click)="openEditor()">Add New Product</button>
      </div>

      <table mat-table [dataSource]="products()" class="w-full border rounded-lg shadow-sm">
        <!-- Id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">
            <div class="flex items-center gap-4">
              <img [src]="element.imageUrl" class="w-10 h-10 rounded object-cover" />
              {{ element.name }}
            </div>
          </td>
        </ng-container>

        <!-- Price Column -->
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let element">{{ element.price | currency }}</td>
        </ng-container>

        <ng-container matColumnDef="rating">
          <th mat-header-cell *matHeaderCellDef>Rating</th>
          <td mat-cell *matCellDef="let element">
            <div class="flex items-center">
              <mat-icon class="text-yellow-500 text-sm h-4 w-4">star</mat-icon>
              <span class="ml-1">{{ element.rating || 0 | number : '1.1-1' }}</span>
            </div>
          </td>
        </ng-container>

        <!-- Reviews Column -->
        <ng-container matColumnDef="reviews">
          <th mat-header-cell *matHeaderCellDef>Reviews</th>
          <td mat-cell *matCellDef="let element">{{ element.reviewCount }}</td>
        </ng-container>

        <!-- Stock Column -->
        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let element">{{ element.stock }}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button
              mat-icon-button
              color="primary"
              (click)="openEditor(element); $event.stopPropagation()"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteProduct(element); $event.stopPropagation()"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          (click)="navigateToProduct(row)"
          class="cursor-pointer hover:bg-gray-50 transition-colors"
        ></tr>
      </table>
    </div>
  `,
  styles: [
    `
      .cursor-pointer {
        cursor: pointer;
      }
    `,
  ],
})
export class ProductsAdminComponent {
  apiService = inject(ApiService);
  toaster = inject(ToasterService);
  dialog = inject(MatDialog);
  router = inject(Router);

  products = signal<Product[]>([]);
  displayedColumns: string[] = ['id', 'name', 'price', 'rating', 'reviews', 'stock', 'actions'];

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data) => this.products.set(data.sort((a, b) => Number(b.id) - Number(a.id))),
      error: () => this.toaster.error('Failed to load products'),
    });
  }

  navigateToProduct(product: Product) {
    // Open product detail in new tab
    const url = this.router.serializeUrl(this.router.createUrlTree(['/product', product.id]));
    window.open(url, '_blank');
  }

  openEditor(product?: Product) {
    const dialogRef = this.dialog.open(ProductEditorDialogComponent, {
      width: '500px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (product) {
          // Update
          this.apiService.updateProduct(product.id, result).subscribe({
            next: () => {
              this.toaster.success('Product updated');
              this.loadProducts();
            },
            error: (err) => {
              console.error('Update Error:', err);
              this.toaster.error('Failed to update product');
            },
          });
        } else {
          // Create
          this.apiService.createProduct(result).subscribe({
            next: () => {
              this.toaster.success('Product created');
              this.loadProducts();
            },
            error: (err) => {
              console.error('Create Error:', err);
              this.toaster.error('Failed to create product');
            },
          });
        }
      }
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;

    this.apiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toaster.success('Product deleted successfully');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Delete Error:', err);
        this.toaster.error('Failed to delete product');
      },
    });
  }
}
