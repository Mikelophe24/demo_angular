import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid'),
  },
  {
    path: 'product/:productId',
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
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component'),
  },
  {
    path: 'order-success',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-success/order-success.component'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/view-cart/view-cart.component'),
  },
  {
    path: 'my-orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/my-orders/my-orders.component').then((m) => m.MyOrdersComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products-admin/products-admin').then(
            (m) => m.ProductsAdminComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/orders-admin/orders-admin').then((m) => m.OrdersAdminComponent),
      },
    ],
  },
];
