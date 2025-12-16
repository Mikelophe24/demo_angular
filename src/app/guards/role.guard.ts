import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EcommerceStore } from '../ecommerce';
import { UserRole } from '../models/user';

/**
 * Role Guard Factory - Tạo guard kiểm tra role của user
 * @param allowedRoles - Danh sách các role được phép truy cập
 * @returns CanActivateFn
 * 
 * Cách sử dụng:
 * { path: 'admin', canActivate: [roleGuard([UserRole.ADMIN])] }
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const store = inject(EcommerceStore);
    const router = inject(Router);
    
    const user = store.user();
    
    // Chưa đăng nhập
    if (!user) {
      router.navigate(['/']);
      return false;
    }
    
    // Kiểm tra role
    if (!allowedRoles.includes(user.role)) {
      // Không có quyền truy cập
      router.navigate(['/']);
      return false;
    }
    
    return true;
  };
};

/**
 * Admin Guard - Chỉ cho phép Admin truy cập
 */
export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);

/**
 * Customer Guard - Chỉ cho phép Customer truy cập
 */
export const customerGuard: CanActivateFn = roleGuard([UserRole.CUSTOMER]);
