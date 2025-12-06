# Hướng dẫn lấy Connection String từ Supabase

## 🔗 Connection String là gì?

Connection string là một chuỗi kết nối chứa thông tin để kết nối đến database PostgreSQL của bạn.

Format thường thấy:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

## 📍 Cách lấy Connection String từ Supabase

### Bước 1: Vào Supabase Dashboard
1. Đăng nhập vào [supabase.com](https://supabase.com)
2. Chọn project của bạn

### Bước 2: Lấy Connection String
1. Vào **Settings** (biểu tượng bánh răng) ở sidebar
2. Chọn **Database**
3. Scroll xuống phần **Connection string**
4. Chọn tab **URI** hoặc **Connection pooling**

### Bước 3: Copy Connection String

Bạn sẽ thấy 2 loại:

**1. URI (Direct connection):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.ukopejyynydcviseyeiw.supabase.co:5432/postgres
```

**2. Connection Pooling (Khuyến nghị cho production):**
```
postgresql://postgres.ukopejyynydcviseyeiw:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Lưu ý:** Thay `[YOUR-PASSWORD]` bằng password database của bạn (password bạn đã set khi tạo project).

## 🔐 Lấy Password Database

Nếu bạn quên password:
1. Vào **Settings** → **Database**
2. Scroll xuống phần **Database password**
3. Click **Reset database password** (nếu cần)
4. Copy password mới

## ✅ Sử dụng Connection String

### Cách 1: Dùng Environment Variable (Khuyến nghị)

**Trên Vercel:**
1. Vào Project Settings → Environment Variables
2. Thêm biến:
   - **Key:** `DATABASE_URL`
   - **Value:** Connection string từ Supabase (đã thay password)

**Trong code:**
```typescript
// app.module.ts sẽ tự động dùng process.env.DATABASE_URL
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ← Tự động lấy từ env
  // ...
})
```

### Cách 2: Dùng trực tiếp (Chỉ cho test, không khuyến nghị)

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: 'postgresql://postgres:your-password@db.ukopejyynydcviseyeiw.supabase.co:5432/postgres',
  // ...
})
```

⚠️ **KHÔNG BAO GIỜ** commit password vào Git!

## 🔍 Kiểm tra Connection String

Sau khi có connection string, bạn có thể test bằng:

```bash
# Test connection
psql "postgresql://postgres:password@db.ukopejyynydcviseyeiw.supabase.co:5432/postgres"
```

Hoặc dùng tool như pgAdmin, DBeaver để test.

## 📝 Ví dụ đầy đủ

Giả sử bạn có:
- **Host:** `db.ukopejyynydcviseyeiw.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** `your-super-secret-password`

Connection string sẽ là:
```
postgresql://postgres:your-super-secret-password@db.ukopejyynydcviseyeiw.supabase.co:5432/postgres
```

## 🚀 Sau khi có Connection String

1. Thêm vào Vercel Environment Variables
2. Cập nhật `app.module.ts` (đã được cấu hình sẵn)
3. Deploy lại backend

