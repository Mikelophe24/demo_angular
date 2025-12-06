import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../models/products';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`, { params: params as any }).pipe(
      map((backendProducts) =>
        backendProducts.map((p) => ({
          ...p,
          id: p.id.toString(), // Convert number to string for frontend
          inStock: p.stock > 0,
          reviews: p.reviews || [], // Allow backend reviews to pass through
        }))
      )
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`).pipe(
      map((p) => ({
        ...p,
        id: p.id.toString(),
        inStock: p.stock > 0,
        reviews: p.reviews || [],
      }))
    );
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  // Admin / Orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  // Admin / Products
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  submitReview(review: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews`, review);
  }
}
