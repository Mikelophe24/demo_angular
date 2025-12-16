# 🔐 Role-Based Access Control (RBAC) Implementation Guide

## Tổng quan

Project đã được implement hệ thống phân quyền hoàn chỉnh với 2 roles:
- **Admin**: Toàn quyền quản lý hệ thống
- **Customer**: Người dùng thông thường

## 📁 Cấu trúc Files

```
src/app/
├── models/
│   └── user.ts                    # UserRole enum & User type
├── guards/
│   ├── auth.guard.ts              # Kiểm tra đăng nhập
│   └── role.guard.ts              # Kiểm tra quyền truy cập
├── directives/
│   └── has-role.directive.ts      # Directive ẩn/hiện UI theo role
└── pages/
    └── admin-dashboard/           # Admin Dashboard page
        └── admin-dashboard.component.ts
```

## 🎯 Các Thành Phần

### 1. User Model với Role

```typescript
export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

export type User = {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
    role: UserRole;  // ← Role của user
}
```

### 2. Auth Guard

**File**: `guards/auth.guard.ts`

**Mục đích**: Kiểm tra user đã đăng nhập chưa

**Cách sử dụng**:
```typescript
{
  path: 'checkout',
  canActivate: [authGuard],  // ← Phải đăng nhập
  loadComponent: () => import('./pages/checkout/checkout.component'),
}
```

### 3. Role Guard

**File**: `guards/role.guard.ts`

**Mục đích**: Kiểm tra role của user

**Cách sử dụng**:
```typescript
// Chỉ admin mới vào được
{
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component'),
}

// Hoặc tùy chỉnh roles
{
  path: 'special',
  canActivate: [roleGuard([UserRole.ADMIN, UserRole.CUSTOMER])],
  loadComponent: () => import('./pages/special/special.component'),
}
```

### 4. HasRole Directive

**File**: `directives/has-role.directive.ts`

**Mục đích**: Ẩn/hiện UI elements dựa trên role

**Cách sử dụng**:

```typescript
// Import directive
import { HasRoleDirective } from './directives/has-role.directive';
import { UserRole } from './models/user';

@Component({
  imports: [HasRoleDirective],
  template: `
    <!-- Chỉ admin mới thấy -->
    <div *hasRole="UserRole.ADMIN">
      Admin only content
    </div>

    <!-- Admin hoặc Customer đều thấy -->
    <div *hasRole="[UserRole.ADMIN, UserRole.CUSTOMER]">
      All users content
    </div>
  `
})
export class MyComponent {
  UserRole = UserRole; // Expose enum để template dùng
}
```

### 5. Admin Dashboard

**File**: `pages/admin-dashboard/admin-dashboard.component.ts`

**Features**:
- ✅ Xem thống kê (Total Products, Orders, Users)
- ✅ Quản lý users (Promote/Demote roles)
- ✅ Quick actions (View Products, Clear Data)
- ✅ Logout

**Access**: Chỉ admin mới truy cập được `/admin`

## 🔄 Flow Hoạt Động

### Sign Up Flow

1. User điền form đăng ký
2. System tạo user mới với `role: UserRole.CUSTOMER` (mặc định)
3. Lưu vào localStorage
4. Auto login

### Sign In Flow

1. User nhập email/password
2. System tìm user trong localStorage
3. Nếu tìm thấy → set user vào store (kèm role)
4. Redirect về trang trước đó

### Route Protection Flow

```
User truy cập /admin
    ↓
adminGuard được trigger
    ↓
Kiểm tra: user đã login?
    ├─ NO → Redirect về "/"
    └─ YES → Kiểm tra role === ADMIN?
              ├─ NO → Redirect về "/"
              └─ YES → Cho phép truy cập
```

## 🎨 UI/UX Features

### Header Menu

- Hiển thị role của user (admin/customer)
- Admin thấy thêm "Admin Dashboard" link
- Customer không thấy admin link

### Admin Dashboard

- **Stats Cards**: Tổng sản phẩm, đơn hàng, users
- **User Table**: Danh sách tất cả users
- **Actions**: 
  - Promote Customer → Admin
  - Demote Admin → Customer
  - Clear all data

## 🧪 Testing Guide

### Test 1: Tạo Admin User

```typescript
// Trong browser console hoặc tạo qua code
const adminUser = {
  id: crypto.randomUUID(),
  email: 'admin@test.com',
  name: 'Admin User',
  imageUrl: 'https://i.pravatar.cc/150?u=admin@test.com',
  role: 'admin',
  password: '123456'
};

const users = JSON.parse(localStorage.getItem('app_users') || '[]');
users.push(adminUser);
localStorage.setItem('app_users', JSON.stringify(users));
```

### Test 2: Kiểm tra Guards

1. **Auth Guard**:
   - Chưa login → truy cập `/checkout` → redirect về `/`
   - Đã login → truy cập `/checkout` → OK

2. **Admin Guard**:
   - Login as Customer → truy cập `/admin` → redirect về `/`
   - Login as Admin → truy cập `/admin` → OK

### Test 3: Kiểm tra Directive

1. Login as Customer → Không thấy "Admin Dashboard" trong menu
2. Login as Admin → Thấy "Admin Dashboard" trong menu

## 📝 Các Store Methods Mới

### `updateUserRole(role: UserRole)`

Cập nhật role của current user

```typescript
store.updateUserRole(UserRole.ADMIN);
```

### `signOut()`

Đăng xuất và clear data

```typescript
store.signOut(); // Clear user, cart, wishlist
```

## 🚀 Mở rộng trong tương lai

### Thêm Role mới

1. Thêm vào enum:
```typescript
export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    MODERATOR = 'moderator'  // ← New role
}
```

2. Tạo guard mới:
```typescript
export const moderatorGuard: CanActivateFn = roleGuard([UserRole.MODERATOR]);
```

3. Sử dụng:
```typescript
{
  path: 'moderate',
  canActivate: [moderatorGuard],
  loadComponent: () => import('./pages/moderate/moderate.component'),
}
```

### Thêm Permissions chi tiết

```typescript
export type Permission = 
  | 'view_products'
  | 'edit_products'
  | 'delete_products'
  | 'manage_users';

export type User = {
  // ... existing fields
  role: UserRole;
  permissions: Permission[];  // ← Thêm permissions
}
```

## 🔒 Security Notes

⚠️ **Quan trọng**: 
- Guards chỉ bảo vệ ở client-side
- Trong production, cần validate role ở backend
- Password đang lưu plain text (chỉ demo)
- Trong thực tế, dùng JWT tokens + HttpOnly cookies

## 📚 Resources

- [Angular Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [Structural Directives](https://angular.dev/guide/directives/structural-directives)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)
