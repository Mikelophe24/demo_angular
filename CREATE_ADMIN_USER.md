# Tạo Admin User

Để test chức năng admin, bạn cần tạo một admin user.

## Cách 1: Qua Browser Console

1. Mở browser (F12)
2. Vào tab Console
3. Paste đoạn code sau:

```javascript
// Tạo admin user
const adminUser = {
  id: crypto.randomUUID(),
  email: 'admin@demo.com',
  name: 'Admin User',
  imageUrl: 'https://i.pravatar.cc/150?u=admin@demo.com',
  role: 'admin',
  password: 'admin123'
};

// Lưu vào localStorage
const users = JSON.parse(localStorage.getItem('app_users') || '[]');
users.push(adminUser);
localStorage.setItem('app_users', JSON.stringify(users));

console.log('✅ Admin user created!');
console.log('Email: admin@demo.com');
console.log('Password: admin123');
```

4. Refresh trang
5. Login với:
   - Email: `admin@demo.com`
   - Password: `admin123`

## Cách 2: Sign Up rồi Promote

1. Sign up một user bình thường
2. Mở Console
3. Paste code sau (thay `your-email@example.com` bằng email bạn vừa đăng ký):

```javascript
const users = JSON.parse(localStorage.getItem('app_users') || '[]');
const user = users.find(u => u.email === 'your-email@example.com');
if (user) {
  user.role = 'admin';
  localStorage.setItem('app_users', JSON.stringify(users));
  console.log('✅ User promoted to admin!');
  console.log('Please refresh the page');
} else {
  console.log('❌ User not found');
}
```

4. Refresh trang

## Test Admin Features

Sau khi login as admin, bạn sẽ thấy:

1. ✅ Role "admin" hiển thị trong user menu
2. ✅ "Admin Dashboard" link trong menu
3. ✅ Có thể truy cập `/admin`
4. ✅ Có thể promote/demote users

## Test Customer Features

Login as customer (sign up bình thường):

1. ✅ Role "customer" hiển thị trong user menu
2. ❌ Không thấy "Admin Dashboard" link
3. ❌ Không thể truy cập `/admin` (sẽ redirect về home)
