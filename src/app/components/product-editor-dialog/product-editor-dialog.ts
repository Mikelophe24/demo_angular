import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/products';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-editor-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" class="flex flex-col gap-4 py-4">
        <mat-form-field appearance="outline">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Wireless Headphones" />
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Price ($)</mat-label>
            <input matInput type="number" formControlName="price" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="electronics">Electronics</mat-option>
            <mat-option value="fashion">Fashion</mat-option>
            <mat-option value="furniture">Furniture</mat-option>
            <mat-option value="photography">Photography</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="productForm.invalid" (click)="save()">
        Save
      </button>
    </mat-dialog-actions>
  `,
})
export class ProductEditorDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ProductEditorDialogComponent>);

  productForm: FormGroup;
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product?: Product } | null) {
    this.isEditMode = !!data?.product;

    this.productForm = this.fb.group({
      name: [data?.product?.name || '', Validators.required],
      price: [data?.product?.price || 0, [Validators.required, Validators.min(0)]],
      stock: [data?.product?.stock || 0, [Validators.required, Validators.min(0)]],
      category: [data?.product?.category || 'electronics', Validators.required],
      description: [data?.product?.description || ''],
      imageUrl: [data?.product?.imageUrl || ''],
    });
  }

  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}
