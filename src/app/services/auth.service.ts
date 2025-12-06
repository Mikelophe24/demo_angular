import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  imageUrl?: string;
  role: 'admin' | 'customer' | 'guest';
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === 'customer';
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  register(data: RegisterData): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/profile`);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('current_user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private getUserFromStorage(): AuthUser | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.currentUser?.role || '');
  }
}
