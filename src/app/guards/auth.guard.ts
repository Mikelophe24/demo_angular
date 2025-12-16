import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EcommerceStore } from '../ecommerce';

/**
 * Auth Guard - Bảo vệ routes yêu cầu user phải đăng nhập
 * Nếu chưa đăng nhập, redirect về trang chủ
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(EcommerceStore);
  const router = inject(Router);
  
  const user = store.user();
  
  if (!user) {
    // Chưa đăng nhập, redirect về trang chủ
    router.navigate(['/']);
    return false;
  }
  
  return true;
};
