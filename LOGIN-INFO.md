# 🔐 Thông Tin Đăng Nhập - Tất Cả Tài Khoản

## ✅ Setup Hoàn Tất!

Hệ thống phân quyền đã được cài đặt thành công với nhiều tài khoản test.

---

## � Tài Khoản Admin

**Email:** admin@example.com  
**Password:** admin123  
**Role:** admin

### Quyền Admin:

- ✅ Truy cập Admin Panel (/admin)
- ✅ Quản lý Products (CRUD)
- ✅ Quản lý Orders
- ✅ Xem danh sách Users
- ✅ Tất cả quyền của Customer

---

## 👥 Tài Khoản Customer (User)

### Customer 1 - John Doe

**Email:** customer1@example.com  
**Password:** customer123  
**Role:** customer

### Customer 2 - Jane Smith

**Email:** customer2@example.com  
**Password:** customer123  
**Role:** customer

### Customer 3 - Mike Johnson

**Email:** customer3@example.com  
**Password:** customer123  
**Role:** customer

### Quyền Customer:

- ✅ Xem products
- ✅ Add to cart
- ✅ Checkout & đặt hàng
- ✅ Viết reviews
- ✅ Quản lý wishlist
- ❌ KHÔNG truy cập được Admin Panel

---

## 🎯 So Sánh Quyền

| Tính năng        | Guest | Customer | Admin    |
| ---------------- | ----- | -------- | -------- |
| Xem Products     | ✅    | ✅       | ✅       |
| Add to Cart      | ✅    | ✅       | ✅       |
| Checkout         | ❌    | ✅       | ✅       |
| Viết Review      | ❌    | ✅       | ✅       |
| Xem Orders       | ❌    | ✅ (own) | ✅ (all) |
| Admin Panel      | ❌    | ❌       | ✅       |
| Quản lý Products | ❌    | ❌       | ✅       |
| Quản lý Users    | ❌    | ❌       | ✅       |

---

## 🧪 Test Scenarios

### Scenario 1: Guest User (Không đăng nhập)

1. Vào http://localhost:4200
2. Xem products ✅
3. Add to cart ✅
4. Thử checkout → Redirect về home ❌
5. Thử vào /admin → Redirect về home ❌

### Scenario 2: Customer User

1. Login với `customer1@example.com` / `customer123`
2. Xem products ✅
3. Add to cart ✅
4. Checkout ✅ (thành công)
5. Viết review ✅
6. Thử vào /admin → Redirect về home ❌
7. Click avatar → Không thấy "Admin Panel" menu

### Scenario 3: Admin User

1. Login với `admin@example.com` / `admin123`
2. Tất cả quyền của Customer ✅
3. Vào /admin ✅ (thành công)
4. Quản lý products ✅
5. Quản lý orders ✅
6. Click avatar → Thấy "👑 Admin" badge
7. Thấy menu "Admin Panel"

---

## 🧪 Test với Postman/Thunder Client

### 1. Login Customer

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "customer1@example.com",
  "password": "customer123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "customer1@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### 2. Login Admin

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 3. Get Profile (cần token)

```http
GET http://localhost:3000/auth/profile
Authorization: Bearer <your_access_token>
```

### 4. Get All Users (Admin only)

```http
GET http://localhost:3000/users
Authorization: Bearer <admin_access_token>
```

Nếu dùng customer token → 403 Forbidden ❌

---

## 📝 Tạo Tài Khoản Customer Mới

### Qua UI (Frontend):

1. Click "Sign In" ở header
2. Chuyển sang tab "Register"
3. Điền thông tin:
   - Name: Your Name
   - Email: your@email.com
   - Password: yourpassword
4. Click "Create Account"
5. Login với tài khoản vừa tạo

### Qua API:

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "newcustomer@example.com",
  "password": "password123",
  "name": "New Customer"
}
```

---

## 🎨 UI Differences

### Customer Login:

- Avatar menu hiển thị: "👤 Customer"
- Menu items:
  - My Profile
  - My Orders
  - Sign Out
- KHÔNG có "Admin Panel" menu

### Admin Login:

- Avatar menu hiển thị: "👑 Admin"
- Menu items:
  - **Admin Panel** ← Chỉ admin mới có
  - My Profile
  - My Orders
  - Sign Out

---

## � Seed Lại Customers

Nếu muốn tạo lại customer accounts:

```bash
cd backend
node seed-customers.js
```

---

## 📞 Troubleshooting

### Không login được customer?

- Check backend đang chạy
- Verify account đã được tạo: `GET http://localhost:3000/users` (với admin token)

### Customer vào được /admin?

- Lỗi! Customer không được vào /admin
- Check role trong database
- Check guards đã apply đúng chưa

### Quên password?

- Hiện tại chưa có password reset
- Tạo account mới hoặc reset database

---

## 🎉 Quick Reference

### Admin:

```
Email: admin@example.com
Password: admin123
```

### Customers:

```
Email: customer1@example.com
Password: customer123

Email: customer2@example.com
Password: customer123

Email: customer3@example.com
Password: customer123
```

---

**Happy Testing! 🚀**
