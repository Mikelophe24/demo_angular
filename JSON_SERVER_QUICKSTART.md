# 🚀 Quick Start - JSON Server

## Chạy JSON Server

### Terminal 1: JSON Server
```bash
npm run json-server
```

### Terminal 2: Angular
```bash
npm start
```

### Hoặc chạy cả 2 cùng lúc:
```bash
npm run dev
```

## Test API

### 1. Mở browser: http://localhost:3000/users

Bạn sẽ thấy:
```json
[
  {
    "id": "admin-001",
    "email": "admin@demo.com",
    "name": "Admin User",
    "password": "admin123",
    "imageUrl": "https://i.pravatar.cc/150?u=admin@demo.com",
    "role": "admin"
  },
  {
    "id": "customer-001",
    "email": "customer@demo.com",
    "name": "Customer User",
    "password": "customer123",
    "imageUrl": "https://i.pravatar.cc/150?u=customer@demo.com",
    "role": "customer"
  }
]
```

### 2. Login với accounts có sẵn:

**Admin:**
- Email: `admin@demo.com`
- Password: `admin123`

**Customer:**
- Email: `customer@demo.com`
- Password: `customer123`

## Endpoints

- `GET http://localhost:3000/users` - Lấy tất cả users
- `GET http://localhost:3000/users/admin-001` - Lấy user theo ID
- `GET http://localhost:3000/users?email=admin@demo.com` - Tìm theo email
- `POST http://localhost:3000/users` - Tạo user mới
- `PATCH http://localhost:3000/users/admin-001` - Cập nhật user
- `DELETE http://localhost:3000/users/admin-001` - Xóa user

## Xem chi tiết

Đọc file `JSON_SERVER_GUIDE.md` để biết thêm chi tiết!
