import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe, CurrencyPipe } from '@angular/common'; // Import DatePipe and CurrencyPipe

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Manage Orders</h2>

      <table mat-table [dataSource]="orders()" class="w-full border rounded-lg shadow-sm">
        <!-- Id Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">#{{ element.id }}</td>
        </ng-container>

        <!-- Customer Column -->
        <ng-container matColumnDef="customer">
          <th mat-header-cell *matHeaderCellDef>Customer</th>
          <td mat-cell *matCellDef="let element">
            <div class="font-medium">{{ element.customerName }}</div>
            <div class="text-xs text-gray-500">{{ element.customerEmail }}</div>
          </td>
        </ng-container>

        <!-- Total Column -->
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let element">{{ element.totalAmount | currency }}</td>
        </ng-container>

        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let element">{{ element.createdAt | date : 'short' }}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let element">
            <mat-select
              [value]="element.status"
              (selectionChange)="updateStatus(element, $event.value)"
              class="w-32"
              [class]="getStatusColor(element.status)"
            >
              <mat-option value="PENDING">Pending</mat-option>
              <mat-option value="SHIPPING">Shipping</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
            </mat-select>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styles: [],
})
export class OrdersAdminComponent {
  apiService = inject(ApiService);
  toaster = inject(ToasterService);

  orders = signal<any[]>([]);
  displayedColumns: string[] = ['id', 'customer', 'total', 'date', 'status'];

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (data) => this.orders.set(data.sort((a, b) => b.id - a.id)),
      error: () => this.toaster.error('Failed to load orders'),
    });
  }

  updateStatus(order: any, newStatus: string) {
    this.apiService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.toaster.success(`Order #${order.id} status updated`);
        this.loadOrders();
      },
      error: () => this.toaster.error('Failed to update status'),
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'text-orange-500';
      case 'SHIPPING':
        return 'text-blue-500';
      case 'COMPLETED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-500';
      default:
        return '';
    }
  }
}
