# 🚀 Quick Guide: Deploy Backend lên Vercel

## ⚠️ QUAN TRỌNG: Database Issue

Backend hiện tại dùng **SQLite** (file database), nhưng **Vercel serverless không hỗ trợ persistent file storage**.

**Bạn CẦN chuyển sang PostgreSQL** trước khi deploy!

## 📋 Các bước nhanh

### Bước 1: Setup PostgreSQL Database

**Option A: Vercel Postgres (Khuyến nghị)**
1. Vào [vercel.com/dashboard](https://vercel.com/dashboard)
2. Tạo Storage → Postgres
3. Copy connection string

**Option B: Supabase (Free)**
1. Vào [supabase.com](https://supabase.com)
2. Tạo project
3. Lấy connection string từ Settings → Database

### Bước 2: Cài PostgreSQL driver

```bash
cd backend
npm install pg @types/pg
```

### Bước 3: Cập nhật app.module.ts

Thay thế nội dung `backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tự động tạo tables (chỉ dùng khi mới setup)
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class AppModule {}
```

### Bước 4: Deploy lên Vercel

**Cách 1: Qua CLI**

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

**Cách 2: Qua GitHub**

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com)
3. Import project
4. Root Directory: `backend` (nếu backend là subfolder)

### Bước 5: Set Environment Variables

Vào Vercel Dashboard → Project Settings → Environment Variables:

- **DATABASE_URL**: Connection string từ PostgreSQL
- **NODE_ENV**: `production`
- **JWT_SECRET**: (nếu có)

### Bước 6: Lấy Backend URL

Sau khi deploy xong, Vercel sẽ cho URL như:
`https://ecommerce-backend-xxx.vercel.app`

### Bước 7: Cập nhật Frontend

Cập nhật `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://ecommerce-backend-xxx.vercel.app', // ← URL từ Vercel
};
```

## ✅ Files đã được tạo sẵn

- ✅ `backend/vercel.json` - Cấu hình Vercel
- ✅ `backend/api/index.ts` - Serverless handler
- ✅ `backend/DEPLOY-VERCEL.md` - Hướng dẫn chi tiết

## 🐛 Troubleshooting

**Lỗi: Database connection failed**
→ Kiểm tra DATABASE_URL đã được set trên Vercel

**Lỗi: Module not found**
→ Đảm bảo `npm install` đã chạy và `node_modules` có trong repo

**Lỗi: Function timeout**
→ Vercel free plan có timeout 10s, cần optimize code

## 📚 Xem thêm

Xem file `DEPLOY-VERCEL.md` để biết chi tiết hơn!

