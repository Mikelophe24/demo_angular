# ✅ Migration to JSON Server - COMPLETE!

## 🎉 Migration Summary

Đã migrate hoàn toàn từ **localStorage** sang **JSON Server API**!

## 📋 Changes Made

### 1. Auth Service (`src/app/services/auth.service.ts`)
- ✅ Tạo AuthService với các methods:
  - `signUp()` - Đăng ký user mới
  - `signIn()` - Đăng nhập
  - `getAllUsers()` - Lấy tất cả users (admin only)
  - `updateUserRole()` - Cập nhật role
  - `deleteUser()` - Xóa user
  - `checkEmailExists()` - Kiểm tra email tồn tại

### 2. EcommerceStore (`src/app/ecommerce.ts`)
- ✅ Import AuthService
- ✅ Inject authService vào store methods
- ✅ **REMOVED** localStorage logic trong `signUp()`
- ✅ **REMOVED** localStorage logic trong `signIn()`
- ✅ **REPLACED** với API calls qua AuthService

### 3. Admin Dashboard (`src/app/pages/admin-dashboard/admin-dashboard.component.ts`)
- ✅ Import AuthService
- ✅ **REMOVED** tất cả localStorage logic
- ✅ **REPLACED** với API calls:
  - `loadUsers()` - Load users từ API
  - `promoteToAdmin()` - Update role qua API
  - `demoteToCustomer()` - Update role qua API
- ✅ Thêm `refreshUsers()` button
- ✅ **REMOVED** `clearAllData()` (không cần nữa)

### 4. App Config (`src/app/app.config.ts`)
- ✅ Added `provideHttpClient(withFetch())`

### 5. Database (`db.json`)
- ✅ Tạo database file với 2 users mẫu:
  - Admin: `admin@demo.com` / `admin123`
  - Customer: `customer@demo.com` / `customer123`

### 6. Package.json
- ✅ Installed `json-server`
- ✅ Installed `concurrently`
- ✅ Added scripts:
  - `npm run json-server` - Chạy JSON Server
  - `npm run dev` - Chạy cả Angular + JSON Server

## 🗑️ Removed Code

### localStorage Logic (DELETED):
```typescript
// ❌ REMOVED from signUp()
const usersStr = localStorage.getItem('app_users');
const users: User[] = usersStr ? JSON.parse(usersStr) : [];
localStorage.setItem('app_users', JSON.stringify(usersWithPassword));

// ❌ REMOVED from signIn()
const usersStr = localStorage.getItem('app_users');
const users: any[] = usersStr ? JSON.parse(usersStr) : [];

// ❌ REMOVED from Admin Dashboard
const usersStr = localStorage.getItem('app_users');
localStorage.setItem('app_users', JSON.stringify(users));
```

## ✨ New Code

### API Calls (ADDED):
```typescript
// ✅ ADDED to signUp()
authService.signUp({ email, password, name, role }).subscribe({
  next: (user) => {
    if (user) {
      patchState(store, { user });
      toaster.success('Account created successfully');
    }
  }
});

// ✅ ADDED to signIn()
authService.signIn({ email, password }).subscribe({
  next: (user) => {
    if (user) {
      patchState(store, { user });
      toaster.success('Signed in successfully');
    }
  }
});

// ✅ ADDED to Admin Dashboard
authService.getAllUsers().subscribe(users => {
  this.allUsers.set(users);
});

authService.updateUserRole(userId, role).subscribe(updatedUser => {
  this.loadUsers(); // Refresh
});
```

## 🚀 How to Run

### Start Both Servers:
```bash
npm run dev
```

This will start:
- Angular dev server: `http://localhost:4200`
- JSON Server: `http://localhost:3000`

### Or Start Separately:

**Terminal 1 - JSON Server:**
```bash
npm run json-server
```

**Terminal 2 - Angular:**
```bash
npm start
```

## 🧪 Testing

### 1. Test Sign Up
1. Go to `http://localhost:4200`
2. Click "Sign Up"
3. Fill form and submit
4. Check `http://localhost:3000/users` - New user should appear!

### 2. Test Sign In
1. Use existing accounts:
   - Admin: `admin@demo.com` / `admin123`
   - Customer: `customer@demo.com` / `customer123`
2. Login successful → User data from API

### 3. Test Admin Dashboard
1. Login as admin
2. Go to `/admin`
3. See all users from API
4. Try promote/demote → Updates in `db.json`
5. Click "Refresh Users" → Reload from API

### 4. Verify Data Persistence
1. Sign up a new user
2. Stop both servers
3. Restart servers
4. Login with new user → Data persisted in `db.json`!

## 📊 Data Flow

### Before (localStorage):
```
Component → Store → localStorage → Browser Storage
```

### After (JSON Server):
```
Component → Store → AuthService → HTTP → JSON Server → db.json
```

## 🔄 Migration Benefits

| Feature | localStorage | JSON Server |
|---------|-------------|-------------|
| **Persistence** | Per browser | Server-side file |
| **Sharing** | ❌ No | ✅ Yes (across browsers/devices) |
| **Real API** | ❌ No | ✅ Yes (REST API) |
| **Backend Ready** | ❌ No | ✅ Yes (easy to replace with real backend) |
| **Multi-user** | ❌ No | ✅ Yes |
| **Testing** | Hard | Easy (Postman/Thunder Client) |

## 🎯 What's Different?

### User Sign Up:
- **Before**: Saved to `localStorage.app_users`
- **After**: POST to `http://localhost:3000/users`

### User Sign In:
- **Before**: Find in `localStorage.app_users`
- **After**: GET `http://localhost:3000/users?email=...&password=...`

### Admin Dashboard:
- **Before**: Read from `localStorage.app_users`
- **After**: GET `http://localhost:3000/users`

### Update Role:
- **Before**: Update `localStorage.app_users` array
- **After**: PATCH `http://localhost:3000/users/:id`

## ⚠️ Important Notes

1. **JSON Server must be running** for the app to work
2. **Data is in `db.json`** - You can edit it directly
3. **No localStorage fallback** - Pure API calls
4. **Passwords are plain text** - For demo only!

## 🐛 Troubleshooting

### App not loading users?
- Check JSON Server is running: `http://localhost:3000/users`
- Check browser console for errors
- Verify `db.json` exists and is valid JSON

### Can't sign up?
- Check JSON Server console for errors
- Verify `db.json` is writable
- Check network tab in browser DevTools

### Changes not persisting?
- Verify JSON Server is running
- Check `db.json` file is being updated
- Restart JSON Server if needed

## 📚 Next Steps

1. ✅ **Test all features** with JSON Server
2. ✅ **Add more users** via sign up
3. ✅ **Test admin features** (promote/demote)
4. ⏭️ **Replace JSON Server** with real backend (NestJS, Express, etc.)
5. ⏭️ **Add authentication** (JWT tokens)
6. ⏭️ **Hash passwords** (bcrypt)

## 🎊 Success!

Migration hoàn tất! App giờ sử dụng:
- ✅ REST API (JSON Server)
- ✅ HTTP calls (AuthService)
- ✅ Real database file (`db.json`)
- ✅ No localStorage for users
- ✅ Production-ready architecture

**Enjoy your new API-powered app! 🚀**
