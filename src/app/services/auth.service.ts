import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { User, UserRole } from '../models/user';

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

/**
 * Auth Service - Tương tác với JSON Server API
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  /**
   * Sign Up - Tạo user mới
   */
  signUp(request: AuthRequest): Observable<User | null> {
    // Kiểm tra email đã tồn tại chưa
    return this.http.get<any[]>(`${this.apiUrl}?email=${request.email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        
        const newUser: any = {
          id: crypto.randomUUID(),
          email: request.email,
          name: request.name!,
          password: request.password,
          imageUrl: `https://i.pravatar.cc/150?u=${request.email}`,
          role: request.role || UserRole.CUSTOMER
        };

        // POST user mới
        return this.http.post<any>(this.apiUrl, newUser).pipe(
          map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
          })
        );
      }),
      catchError(error => {
        console.error('Sign up error:', error);
        return of(null);
      })
    );
  }

  /**
   * Sign In - Đăng nhập
   */
  signIn(request: AuthRequest): Observable<User | null> {
    return this.http.get<any[]>(
      `${this.apiUrl}?email=${request.email}&password=${request.password}`
    ).pipe(
      map(users => {
        if (users.length === 0) {
          return null;
        }
        
        const { password, ...userWithoutPassword } = users[0];
        return userWithoutPassword as User;
      }),
      catchError(error => {
        console.error('Sign in error:', error);
        return of(null);
      })
    );
  }

  /**
   * Get All Users (Admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(({ password, ...user }) => user as User)),
      catchError(error => {
        console.error('Get all users error:', error);
        return of([]);
      })
    );
  }

  /**
   * Update User Role
   */
  updateUserRole(userId: string, role: UserRole): Observable<User | null> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, { role }).pipe(
      map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }),
      catchError(error => {
        console.error('Update user role error:', error);
        return of(null);
      })
    );
  }

  /**
   * Delete User
   */
  deleteUser(userId: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Delete user error:', error);
        return of(false);
      })
    );
  }

  /**
   * Check if email exists
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }
}
