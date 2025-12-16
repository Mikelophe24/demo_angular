import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface AdminProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface AdminOrder {
  id?: string;
  userId: string;
  userName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

/**
 * Admin Service - Quản lý Products và Orders
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // ==================== PRODUCTS ====================

  getAllProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Get products error:', error);
        return of([]);
      })
    );
  }

  getProduct(id: string): Observable<AdminProduct | null> {
    return this.http.get<AdminProduct>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error('Get product error:', error);
        return of(null);
      })
    );
  }

  createProduct(product: AdminProduct): Observable<AdminProduct | null> {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      rating: 0,
      reviewCount: 0
    };

    return this.http.post<AdminProduct>(`${this.apiUrl}/products`, newProduct).pipe(
      catchError(error => {
        console.error('Create product error:', error);
        return of(null);
      })
    );
  }

  updateProduct(id: string, product: Partial<AdminProduct>): Observable<AdminProduct | null> {
    return this.http.patch<AdminProduct>(`${this.apiUrl}/products/${id}`, product).pipe(
      catchError(error => {
        console.error('Update product error:', error);
        return of(null);
      })
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/products/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Delete product error:', error);
        return of(false);
      })
    );
  }

  // ==================== ORDERS ====================

  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`).pipe(
      catchError(error => {
        console.error('Get orders error:', error);
        return of([]);
      })
    );
  }

  getOrder(id: string): Observable<AdminOrder | null> {
    return this.http.get<AdminOrder>(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(error => {
        console.error('Get order error:', error);
        return of(null);
      })
    );
  }

  updateOrderStatus(id: string, status: AdminOrder['status']): Observable<AdminOrder | null> {
    return this.http.patch<AdminOrder>(`${this.apiUrl}/orders/${id}`, { status }).pipe(
      catchError(error => {
        console.error('Update order status error:', error);
        return of(null);
      })
    );
  }

  deleteOrder(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Delete order error:', error);
        return of(false);
      })
    );
  }
}
