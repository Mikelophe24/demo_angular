import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RouterLink,
  ],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">My Orders</h1>
        <p class="text-gray-600 mt-2">View and track your order history</p>
      </div>

      <!-- Loading State -->
      @if (loading()) {
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      }

      <!-- Empty State -->
      @else if (orders().length === 0) {
      <mat-card class="text-center py-16">
        <mat-icon class="text-gray-400 mb-4" style="font-size: 64px; width: 64px; height: 64px;">
          shopping_bag
        </mat-icon>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
        <p class="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <button mat-raised-button color="primary" routerLink="/products/all">Start Shopping</button>
      </mat-card>
      }

      <!-- Orders List -->
      @else {
      <div class="space-y-4">
        @for (order of orders(); track order.id) {
        <mat-card class="order-card">
          <!-- Order Header -->
          <div class="flex justify-between items-start mb-4 pb-4 border-b">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold">Order #{{ order.id }}</h3>
                <mat-chip [class]="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </mat-chip>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <div class="flex items-center gap-2">
                  <mat-icon
                    class="text-gray-400"
                    style="font-size: 18px; width: 18px; height: 18px;"
                  >
                    calendar_today
                  </mat-icon>
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <mat-icon
                    class="text-gray-400"
                    style="font-size: 18px; width: 18px; height: 18px;"
                  >
                    person
                  </mat-icon>
                  <span>{{ order.customerName }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">
                {{ order.totalAmount | currency }}
              </div>
              <div class="text-sm text-gray-500">{{ order.items.length || 0 }} item(s)</div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3">
            @for (item of order.items; track item.id) {
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <img
                [src]="item.product?.imageUrl || 'https://via.placeholder.com/80'"
                [alt]="item.product?.name"
                class="w-20 h-20 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800">{{ item.product?.name }}</h4>
                <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <div class="font-semibold text-gray-800">
                  {{ item.price | currency }}
                </div>
                <div class="text-sm text-gray-500">× {{ item.quantity }}</div>
              </div>
            </div>
            }
          </div>

          <!-- Order Footer -->
          <mat-divider class="my-4"></mat-divider>
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              <strong>Total:</strong> {{ order.totalAmount | currency }}
            </div>
            <div class="flex gap-2">
              <button mat-stroked-button (click)="viewOrderDetails(order)">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
              @if (order.status === 'pending') {
              <button mat-stroked-button color="warn" (click)="cancelOrder(order)">
                <mat-icon>cancel</mat-icon>
                Cancel Order
              </button>
              }
            </div>
          </div>
        </mat-card>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .order-card {
        transition: box-shadow 0.3s ease;
      }

      .order-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .status-pending {
        background-color: #fff3cd;
        color: #856404;
      }

      .status-processing {
        background-color: #cfe2ff;
        color: #084298;
      }

      .status-shipped {
        background-color: #d1e7dd;
        color: #0f5132;
      }

      .status-delivered {
        background-color: #d1e7dd;
        color: #0a3622;
      }

      .status-cancelled {
        background-color: #f8d7da;
        color: #842029;
      }
    `,
  ],
})
export class MyOrdersComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const user = this.authService.currentUser;
    if (!user) {
      this.loading.set(false);
      return;
    }

    // TODO: Update API to filter by user email
    this.apiService.getOrders().subscribe({
      next: (allOrders) => {
        // Filter orders by current user's email
        const userOrders = allOrders.filter((order) => order.customerEmail === user.email);
        this.orders.set(userOrders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading.set(false);
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  viewOrderDetails(order: Order) {
    // TODO: Navigate to order details page or open dialog
    console.log('View order details:', order);
  }

  cancelOrder(order: Order) {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      // TODO: Implement cancel order API
      console.log('Cancel order:', order);
    }
  }
}
