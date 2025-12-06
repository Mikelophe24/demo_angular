import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CurrencyPipe, DatePipe, ViewportScroller } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    BaseChartDirective,
    MatTabsModule,
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <mat-card class="p-4 !rounded-xl !shadow-sm border border-gray-100 bg-white">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"
            >
              <mat-icon>inventory_2</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Products</p>
              <h3 class="text-2xl font-bold text-gray-900">{{ stats().productsCount }}</h3>
            </div>
          </div>
        </mat-card>

        <mat-card class="p-4 !rounded-xl !shadow-sm border border-gray-100 bg-white">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600"
            >
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 class="text-2xl font-bold text-gray-900">{{ stats().ordersCount }}</h3>
            </div>
          </div>
        </mat-card>

        <mat-card class="p-4 !rounded-xl !shadow-sm border border-gray-100 bg-white">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"
            >
              <mat-icon>attach_money</mat-icon>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 class="text-2xl font-bold text-gray-900">{{ stats().revenue | currency }}</h3>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <mat-card class="p-6 !rounded-xl !shadow-sm border border-gray-100 bg-white">
          <h3 class="font-bold text-gray-800 mb-4">Revenue Analytics</h3>
          <div class="w-full h-[300px]">
            @if(isChartDataReady()){
            <canvas
              baseChart
              [data]="revenueChartData"
              [options]="lineChartOptions"
              [type]="'line'"
            >
            </canvas>
            }
          </div>
        </mat-card>

        <mat-card class="p-6 !rounded-xl !shadow-sm border border-gray-100 bg-white">
          <h3 class="font-bold text-gray-800 mb-4">Top Products</h3>
          <mat-tab-group>
            <mat-tab label="Best Selling">
              <div class="overflow-auto h-[250px] mt-2">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 border-b">
                      <th class="py-2">Name</th>
                      <th class="py-2 text-right">Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for(item of topSellingProducts(); track item.name){
                    <tr class="border-b last:border-0 hover:bg-gray-50">
                      <td class="py-3 font-medium text-gray-700 truncate max-w-[200px]">
                        {{ item.name }}
                      </td>
                      <td class="py-3 text-right font-bold text-blue-600">{{ item.sold }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
            </mat-tab>
            <mat-tab label="Top Inventory">
              <div class="overflow-auto h-[250px] mt-2">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 border-b">
                      <th class="py-2">Name</th>
                      <th class="py-2 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for(item of topInventoryProducts(); track item.name){
                    <tr class="border-b last:border-0 hover:bg-gray-50">
                      <td class="py-3 font-medium text-gray-700 truncate max-w-[200px]">
                        {{ item.name }}
                      </td>
                      <td class="py-3 text-right font-bold text-orange-600">{{ item.stock }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 class="font-bold text-gray-800">Recent Orders</h3>
          <button mat-button color="primary" routerLink="/admin/orders">View All</button>
        </div>

        <table mat-table [dataSource]="recentOrders()" class="w-full">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef class="bg-gray-50">Order ID</th>
            <td mat-cell *matCellDef="let element" class="font-medium text-gray-700">
              #{{ element.id }}
            </td>
          </ng-container>

          <!-- Customer Column -->
          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef class="bg-gray-50">Customer</th>
            <td mat-cell *matCellDef="let element">{{ element.customerName }}</td>
          </ng-container>

          <!-- Total Column -->
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef class="bg-gray-50">Total</th>
            <td mat-cell *matCellDef="let element" class="font-bold text-gray-900">
              {{ element.totalAmount | currency }}
            </td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef class="bg-gray-50">Date</th>
            <td mat-cell *matCellDef="let element" class="text-gray-500">
              {{ element.createdAt | date : 'shortDate' }}
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="bg-gray-50">Status</th>
            <td mat-cell *matCellDef="let element">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                [class.bg-yellow-100]="element.status === 'PENDING'"
                [class.text-yellow-700]="element.status === 'PENDING'"
                [class.bg-blue-100]="element.status === 'SHIPPING'"
                [class.text-blue-700]="element.status === 'SHIPPING'"
                [class.bg-green-100]="element.status === 'COMPLETED'"
                [class.text-green-700]="element.status === 'COMPLETED'"
                [class.bg-red-100]="element.status === 'CANCELLED'"
                [class.text-red-700]="element.status === 'CANCELLED'"
              >
                {{ element.status }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  apiService = inject(ApiService);

  stats = signal({
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
  });

  recentOrders = signal<any[]>([]);
  topSellingProducts = signal<{ name: string; sold: number }[]>([]);
  topInventoryProducts = signal<{ name: string; stock: number }[]>([]);

  displayedColumns: string[] = ['id', 'customer', 'total', 'date', 'status'];

  // Chart Data
  isChartDataReady = signal(false);
  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue',
        fill: true,
        tension: 0.4,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#8b5cf6',
        pointHoverBackgroundColor: '#8b5cf6',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  constructor() {
    this.loadData();
  }

  loadData() {
    // Load Products
    this.apiService.getProducts().subscribe((products) => {
      this.stats.update((s) => ({ ...s, productsCount: products.length }));

      // Top Inventory
      const sortedByStock = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5);
      this.topInventoryProducts.set(sortedByStock.map((p) => ({ name: p.name, stock: p.stock })));
    });

    // Load Orders
    this.apiService.getOrders().subscribe((orders) => {
      const validOrders = orders.filter((o) => o.status !== 'CANCELLED');
      const revenue = validOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

      this.stats.update((s) => ({ ...s, ordersCount: orders.length, revenue }));
      this.recentOrders.set(orders.sort((a, b) => b.id - a.id).slice(0, 5));

      // Calculate Chart Data (Revenue by Date)
      this.calculateRevenueChart(validOrders);

      // Calculate Top Selling
      this.calculateTopSelling(validOrders);
    });
  }

  calculateRevenueChart(orders: any[]) {
    const revenueMap = new Map<string, number>();

    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      revenueMap.set(date, (revenueMap.get(date) || 0) + Number(order.totalAmount));
    });

    // Sort by date (naive implementation, assumes recent dates)
    // Actually API returns usually ordered, but let's reverse to be chronological if descending
    // Just taking the map keys as they appear might be random.
    // Better to aggregate last 7 days explicitly or just use existing data points.

    // Convert to arrays
    const labels = Array.from(revenueMap.keys());
    const data = Array.from(revenueMap.values());

    this.revenueChartData = {
      ...this.revenueChartData,
      labels,
      datasets: [{ ...this.revenueChartData.datasets[0], data }],
    };
    this.isChartDataReady.set(true);
  }

  calculateTopSelling(orders: any[]) {
    const productSales = new Map<string, number>(); // Name -> Quantity

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          const productName = item.product?.name || 'Unknown Product';
          productSales.set(productName, (productSales.get(productName) || 0) + item.quantity);
        });
      }
    });

    const sortedSales = Array.from(productSales.entries())
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    this.topSellingProducts.set(sortedSales);
  }
}
