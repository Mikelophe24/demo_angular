import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../models/products';

/**
 * Product Service - Load products từ JSON Server
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  /**
   * Load tất cả products từ API
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Failed to load products:', error);
        return of([]); // Return empty array nếu fail
      })
    );
  }

  /**
   * Get product theo ID
   */
  getProduct(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Failed to load product:', error);
        return of(null);
      })
    );
  }
}
