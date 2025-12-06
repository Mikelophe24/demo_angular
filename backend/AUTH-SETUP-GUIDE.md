# Hướng dẫn cài đặt hệ thống phân quyền

## Bước 1: Cài đặt dependencies

```bash
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

## Bước 2: Tạo file .env (nếu chưa có)

Tạo file `.env` trong thư mục `backend`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRATION=7d
```

## Bước 3: Khởi động lại backend

```bash
npx nest start --watch
```

## Bước 4: Tạo admin user đầu tiên

Chạy script seed admin:

```bash
node seed-admin.js
```

## Cấu trúc hệ thống phân quyền

### Roles:

- **ADMIN**: Toàn quyền quản lý hệ thống
- **CUSTOMER**: Khách hàng đã đăng ký
- **GUEST**: Khách vãng lai (chưa đăng nhập)

### Protected Endpoints:

#### Admin Only:

- `GET /users` - Xem danh sách users
- `DELETE /users/:id` - Xóa user
- `GET /orders` - Xem tất cả orders
- `PUT /orders/:id/status` - Cập nhật trạng thái order

#### Authenticated Users:

- `GET /auth/profile` - Xem profile
- `POST /reviews` - Viết review
- `POST /orders` - Đặt hàng

#### Public:

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /products` - Xem sản phẩm
- `GET /products/:id` - Xem chi tiết sản phẩm

## Test API với Postman/Thunder Client

### 1. Register (Đăng ký)

```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 2. Login (Đăng nhập)

```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:

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

### 3. Access Protected Route

```
GET http://localhost:3000/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Admin Only Route

```
GET http://localhost:3000/users
Authorization: Bearer <admin_token>
```

## Troubleshooting

### Lỗi "Cannot find module"

```bash
npm install
```

### Lỗi "Unauthorized"

- Kiểm tra token có hợp lệ không
- Kiểm tra header Authorization: Bearer <token>

### Lỗi "Forbidden"

- User không có quyền truy cập endpoint này
- Kiểm tra role của user
