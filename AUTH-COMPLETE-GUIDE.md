# 🔐 Hệ Thống Phân Quyền Chuyên Nghiệp - Hướng Dẫn Đầy Đủ

## 📋 Tổng Quan

Hệ thống phân quyền Role-Based Access Control (RBAC) hoàn chỉnh với:

- ✅ JWT Authentication
- ✅ 3 Roles: Admin, Customer, Guest
- ✅ Protected Routes (Frontend & Backend)
- ✅ HTTP Interceptor tự động
- ✅ Password Hashing với bcrypt
- ✅ Token expiration & refresh

---

## 🚀 BƯỚC 1: Cài Đặt Backend Dependencies

```bash
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

---

## 🔧 BƯỚC 2: Cấu Hình Environment

Tạo/cập nhật file `backend/.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-abc123xyz
JWT_EXPIRATION=7d
```

---

## 🗄️ BƯỚC 3: Reset Database (Quan Trọng!)

Vì đã thêm User entity mới, cần reset database:

```bash
cd backend

# Stop backend nếu đang chạy (Ctrl+C)

# Xóa database cũ
Remove-Item ecommerce.db

# Khởi động backend (sẽ tạo database mới với User table)
npx nest start --watch
```

Đợi thấy message: `Nest application successfully started`

---

## 👤 BƯỚC 4: Seed Data

### 4.1 Seed Products (Terminal mới)

```bash
cd backend
node seed-products.js
```

### 4.2 Seed Admin User

```bash
node seed-admin.js
```

**Thông tin đăng nhập Admin:**

- Email: `admin@example.com`
- Password: `admin123`

### 4.3 Cập nhật Role thành Admin

Vì API register mặc định tạo role "customer", cần update thủ công:

**Option 1: Sử dụng SQLite Browser**

1. Tải [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Mở file `backend/ecommerce.db`
3. Tab "Browse Data" → Table "user"
4. Tìm user có email `admin@example.com`
5. Double-click vào cột `role`, đổi từ `customer` thành `admin`
6. Ctrl+S để save

**Option 2: SQL Query**

```sql
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
```

### 4.4 Seed Reviews (Optional)

```bash
node seed-reviews.js
```

---

## 🧪 BƯỚC 5: Test API với Postman/Thunder Client

### 5.1 Register Customer

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 5.2 Login Admin

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### 5.3 Get Profile (Authenticated)

```http
GET http://localhost:3000/auth/profile
Authorization: Bearer <your_access_token>
```

### 5.4 Get All Users (Admin Only)

```http
GET http://localhost:3000/users
Authorization: Bearer <admin_access_token>
```

---

## 🎨 BƯỚC 6: Test Frontend

### 6.1 Khởi động Frontend

```bash
cd ..  # về root project
npm start
```

### 6.2 Test Flows

**Flow 1: Guest User**

- Truy cập http://localhost:4200
- Xem products ✅
- Thử truy cập /admin → Redirect về home ❌
- Thử checkout → Redirect về home ❌

**Flow 2: Customer User**

- Đăng nhập với customer account
- Xem products ✅
- Add to cart ✅
- Checkout ✅
- Thử truy cập /admin → Redirect về home ❌

**Flow 3: Admin User**

- Đăng nhập với admin account
- Truy cập /admin ✅
- Quản lý products ✅
- Quản lý orders ✅
- Xem danh sách users ✅

---

## 🔒 Cấu Trúc Phân Quyền

### Roles & Permissions

| Role         | Products | Cart      | Checkout | Reviews  | Admin Panel |
| ------------ | -------- | --------- | -------- | -------- | ----------- |
| **Guest**    | View ✅  | View ✅   | ❌       | ❌       | ❌          |
| **Customer** | View ✅  | Manage ✅ | ✅       | Write ✅ | ❌          |
| **Admin**    | Full ✅  | Full ✅   | ✅       | Full ✅  | Full ✅     |

### Protected Routes (Frontend)

```typescript
// Auth Guard - Requires login
- /checkout
- /order-success

// Admin Guard - Requires admin role
- /admin/*
  - /admin/dashboard
  - /admin/products
  - /admin/orders
```

### Protected Endpoints (Backend)

```typescript
// Public
POST /auth/login
POST /auth/register
GET /products
GET /products/:id

// Authenticated
GET /auth/profile
POST /reviews
POST /orders

// Admin Only
GET /users
DELETE /users/:id
PUT /orders/:id/status
```

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot find module '@nestjs/jwt'"

```bash
cd backend
npm install
```

### Lỗi: "Unauthorized" khi call API

- Kiểm tra token có hợp lệ
- Kiểm tra header: `Authorization: Bearer <token>`
- Token có thể đã hết hạn (7 days)

### Lỗi: "Forbidden" / Access Denied

- User không có quyền truy cập
- Kiểm tra role trong database
- Admin cần role = 'admin'

### Frontend không redirect sau login

- Kiểm tra AuthService đã inject đúng
- Kiểm tra localStorage có token
- Clear browser cache

### Backend không start

- Kiểm tra port 3000 có bị chiếm
- Xóa node_modules và npm install lại
- Kiểm tra .env file

---

## 📚 Tài Liệu Kỹ Thuật

### JWT Token Structure

```json
{
  "email": "admin@example.com",
  "sub": 1,
  "role": "admin",
  "name": "Admin User",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Database Schema

**User Table:**

```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  imageUrl TEXT,
  role TEXT DEFAULT 'customer',
  isActive BOOLEAN DEFAULT 1,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## 🎯 Next Steps

1. ✅ Implement Password Reset
2. ✅ Add Email Verification
3. ✅ Implement Refresh Tokens
4. ✅ Add Rate Limiting
5. ✅ Implement 2FA
6. ✅ Add Audit Logs

---

## 📞 Support

Nếu gặp vấn đề, check:

1. Backend logs trong terminal
2. Browser console (F12)
3. Network tab để xem API calls
4. Database với SQLite Browser

**Happy Coding! 🚀**
