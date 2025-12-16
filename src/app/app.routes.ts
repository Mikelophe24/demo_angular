import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    // ở đây áp dụng route param
    loadComponent: () => import('./pages/products-grid/products-grid'),
  },
  {
    path: 'product/:productId',
    // Sửa thành đường dẫn chính xác đến file component
    loadComponent: () => import('./pages/view-product-detail/view-product-detail.component'),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist'),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products-grid/products-grid'),
  },
  {
    path: 'checkout',
    canActivate: [authGuard], // Phải đăng nhập mới checkout được
    loadComponent: () => import('./pages/checkout/checkout.component'),
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success.component'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/view-cart/view-cart.component'),
  },
  {
    path: 'admin',
    canActivate: [adminGuard], // Chỉ admin mới vào được
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component'),
  },
];
