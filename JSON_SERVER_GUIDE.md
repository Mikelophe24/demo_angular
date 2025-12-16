# 🗄️ JSON Server Setup Guide

## ✅ Đã Setup Thành Công!

Project đã được cấu hình với **JSON Server** để lưu trữ dữ liệu users.

## 📁 Files Đã Tạo

1. **`db.json`** - Database file chứa users, orders, products
2. **`src/app/services/auth.service.ts`** - Service để tương tác với API
3. **`package.json`** - Đã thêm scripts và dependencies

## 🚀 Cách Sử Dụng

### Option 1: Chạy JSON Server riêng

```bash
npm run json-server
```

Server sẽ chạy tại: `http://localhost:3000`

### Option 2: Chạy đồng thời Angular + JSON Server

```bash
npm run dev
```

Sẽ chạy:
- Angular dev server: `http://localhost:4200`
- JSON Server: `http://localhost:3000`

## 📊 Database Structure

### Users Collection

```json
{
  "users": [
    {
      "id": "admin-001",
      "email": "admin@demo.com",
      "name": "Admin User",
      "password": "admin123",
      "imageUrl": "https://i.pravatar.cc/150?u=admin@demo.com",
      "role": "admin"
    }
  ]
}
```

## 🔌 API Endpoints

JSON Server tự động tạo REST API:

### GET - Lấy tất cả users
```
GET http://localhost:3000/users
```

### GET - Lấy user theo ID
```
GET http://localhost:3000/users/admin-001
```

### GET - Tìm user theo email
```
GET http://localhost:3000/users?email=admin@demo.com
```

### GET - Tìm user theo email và password (login)
```
GET http://localhost:3000/users?email=admin@demo.com&password=admin123
```

### POST - Tạo user mới
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "id": "user-123",
  "email": "newuser@demo.com",
  "name": "New User",
  "password": "password123",
  "imageUrl": "https://i.pravatar.cc/150?u=newuser@demo.com",
  "role": "customer"
}
```

### PATCH - Cập nhật user
```
PATCH http://localhost:3000/users/user-123
Content-Type: application/json

{
  "role": "admin"
}
```

### DELETE - Xóa user
```
DELETE http://localhost:3000/users/user-123
```

## 💻 Auth Service Methods

### 1. Sign Up

```typescript
import { AuthService } from './services/auth.service';

authService.signUp({
  email: 'test@demo.com',
  name: 'Test User',
  password: 'password123',
  role: UserRole.CUSTOMER // optional
}).subscribe(user => {
  if (user) {
    console.log('User created:', user);
  }
});
```

### 2. Sign In

```typescript
authService.signIn({
  email: 'admin@demo.com',
  password: 'admin123'
}).subscribe(user => {
  if (user) {
    console.log('Login success:', user);
  } else {
    console.log('Invalid credentials');
  }
});
```

### 3. Get All Users (Admin only)

```typescript
authService.getAllUsers().subscribe(users => {
  console.log('All users:', users);
});
```

### 4. Update User Role

```typescript
authService.updateUserRole('user-123', UserRole.ADMIN).subscribe(user => {
  console.log('User updated:', user);
});
```

### 5. Delete User

```typescript
authService.deleteUser('user-123').subscribe(success => {
  console.log('Deleted:', success);
});
```

### 6. Check Email Exists

```typescript
authService.checkEmailExists('test@demo.com').subscribe(exists => {
  console.log('Email exists:', exists);
});
```

## 🔄 Migration từ localStorage sang JSON Server

### Bước 1: Export users từ localStorage

Mở browser console:

```javascript
const users = JSON.parse(localStorage.getItem('app_users') || '[]');
console.log(JSON.stringify(users, null, 2));
```

### Bước 2: Copy users vào db.json

Paste vào file `db.json`:

```json
{
  "users": [
    // Paste users từ localStorage vào đây
  ]
}
```

### Bước 3: Restart JSON Server

```bash
npm run json-server
```

## 🧪 Testing với Postman/Thunder Client

### Test Login

```
GET http://localhost:3000/users?email=admin@demo.com&password=admin123
```

Response:
```json
[
  {
    "id": "admin-001",
    "email": "admin@demo.com",
    "name": "Admin User",
    "imageUrl": "https://i.pravatar.cc/150?u=admin@demo.com",
    "role": "admin"
  }
]
```

### Test Create User

```
POST http://localhost:3000/users
Content-Type: application/json

{
  "id": "test-001",
  "email": "test@demo.com",
  "name": "Test User",
  "password": "test123",
  "imageUrl": "https://i.pravatar.cc/150?u=test@demo.com",
  "role": "customer"
}
```

## 📝 Default Users

Database đi kèm 2 users mẫu:

### Admin User
- **Email**: `admin@demo.com`
- **Password**: `admin123`
- **Role**: `admin`

### Customer User
- **Email**: `customer@demo.com`
- **Password**: `customer123`
- **Role**: `customer`

## 🔒 Security Notes

⚠️ **Quan trọng:**

1. **Password plain text**: JSON Server lưu password dạng plain text (chỉ demo)
2. **No authentication**: API không có authentication (public)
3. **No validation**: Không có validation rules
4. **Development only**: Chỉ dùng cho development, KHÔNG dùng production

### Production Recommendations:

- Dùng backend thật (NestJS, Express, .NET, etc.)
- Hash passwords (bcrypt)
- JWT authentication
- Input validation
- Rate limiting
- HTTPS

## 🛠️ Troubleshooting

### Port 3000 đã được sử dụng?

Đổi port trong package.json:

```json
"json-server": "json-server --watch db.json --port 3001"
```

Và update `apiUrl` trong `auth.service.ts`:

```typescript
private apiUrl = 'http://localhost:3001/users';
```

### JSON Server không start?

Kiểm tra:
1. File `db.json` có đúng format JSON không
2. Port 3000 có bị chiếm không
3. Đã cài `json-server` chưa: `npm install -D json-server`

### CORS errors?

JSON Server tự động enable CORS, không cần config thêm.

## 📚 Resources

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [JSON Server npm](https://www.npmjs.com/package/json-server)
- [REST API Best Practices](https://restfulapi.net/)

## 🎯 Next Steps

1. ✅ Chạy JSON Server: `npm run json-server`
2. ✅ Test API với Postman/Thunder Client
3. ✅ Integrate AuthService vào components
4. ✅ Replace localStorage logic với HTTP calls
5. ✅ Test login/signup flow

---

**JSON Server đã sẵn sàng! 🎉**
