# Hướng dẫn Deploy Backend NestJS lên Vercel

## ⚠️ Lưu ý quan trọng về Database

**Vấn đề:** Backend hiện tại đang dùng **SQLite** (file database), nhưng Vercel serverless functions có file system **ephemeral** (tạm thời), nghĩa là:
- File database sẽ bị mất sau mỗi lần function restart
- SQLite không phù hợp với serverless architecture

**Giải pháp:** Cần chuyển sang **PostgreSQL** hoặc database cloud (Vercel Postgres, Supabase, Railway, etc.)

## 🚀 Cách 1: Deploy với Vercel Postgres (Khuyến nghị)

### Bước 1: Tạo Vercel Postgres Database

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project → **Storage** tab
3. Click **Create Database** → Chọn **Postgres**
4. Chọn plan (Hobby plan miễn phí)
5. Copy connection string

### Bước 2: Cập nhật AppModule để dùng PostgreSQL

Cập nhật `backend/src/app.module.ts`:

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
      url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
      // Hoặc dùng connection string từ Vercel:
      // url: process.env.POSTGRES_PRISMA_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Chỉ dùng trong development, production nên dùng migrations
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

### Bước 3: Cài đặt PostgreSQL driver

```bash
cd backend
npm install pg
npm install --save-dev @types/pg
```

### Bước 4: Cập nhật package.json

Đảm bảo có script `vercel-build`:

```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### Bước 5: Deploy lên Vercel

**Cách 1: Qua Vercel CLI**

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

Khi được hỏi:
- **Set up and deploy?** → Yes
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → No (tạo mới)
- **Project name?** → `ecommerce-backend` (hoặc tên bạn muốn)
- **Directory?** → `./` (current directory)

**Cách 2: Qua GitHub**

1. Push backend code lên GitHub (tạo repo riêng hoặc subfolder)
2. Vào [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import repository
5. Cấu hình:
   - **Root Directory:** `backend` (nếu backend là subfolder)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Bước 6: Thêm Environment Variables

Vào Vercel Dashboard → Project Settings → Environment Variables:

1. **POSTGRES_URL** hoặc **DATABASE_URL**: Connection string từ Vercel Postgres
2. **JWT_SECRET**: Secret key cho JWT (nếu có)
3. **NODE_ENV**: `production`

### Bước 7: Seed Database (Nếu cần)

Sau khi deploy, bạn có thể cần seed database. Có thể:
- Tạo API endpoint để seed
- Hoặc chạy script seed local và migrate data

## 🚀 Cách 2: Deploy với Supabase (Alternative)

### Bước 1: Tạo Supabase Project

1. Vào [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy connection string từ Settings → Database

### Bước 2: Cập nhật AppModule

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Supabase connection string
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
})
```

### Bước 3: Deploy như trên

## 🚀 Cách 3: Deploy với Railway (Easiest cho SQLite)

Railway hỗ trợ persistent storage, có thể giữ SQLite:

1. Vào [railway.app](https://railway.app)
2. Tạo project mới
3. Deploy từ GitHub hoặc CLI
4. Railway sẽ tự động detect NestJS và deploy

## 📝 Files đã được tạo

### 1. `backend/vercel.json`
Cấu hình Vercel để chạy NestJS như serverless function.

### 2. `backend/api/index.ts`
Serverless handler cho Vercel - entry point cho tất cả requests.

## 🔧 Cấu trúc sau khi deploy

```
Vercel sẽ:
1. Build NestJS: npm run build
2. Tạo serverless function từ api/index.ts
3. Route tất cả requests đến function này
4. Function sẽ khởi tạo NestJS app và xử lý requests
```

## ⚙️ Cấu hình Database cho Production

### Option 1: Vercel Postgres (Tốt nhất cho Vercel)

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Production: dùng migrations
  autoLoadEntities: true,
})
```

### Option 2: Supabase

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // ... rest
})
```

### Option 3: Railway / Render

Có thể giữ SQLite nếu dùng persistent storage, nhưng không khuyến nghị.

## 🐛 Troubleshooting

### Lỗi: Cannot find module
- Đảm bảo `npm install` đã chạy
- Kiểm tra `node_modules` có trong repo (thường nên gitignore)

### Lỗi: Database connection failed
- Kiểm tra environment variables đã được set
- Kiểm tra connection string đúng format
- Kiểm tra SSL configuration

### Lỗi: Function timeout
- Vercel free plan có timeout 10s
- Upgrade lên Pro plan để có 60s timeout
- Hoặc optimize code để chạy nhanh hơn

### Lỗi: CORS
- Đảm bảo CORS đã được enable trong `main.ts` hoặc `api/index.ts`
- Thêm frontend URL vào allowed origins

## ✅ Checklist trước khi deploy

- [ ] Database đã được setup (PostgreSQL)
- [ ] AppModule đã được cập nhật để dùng PostgreSQL
- [ ] `pg` package đã được cài đặt
- [ ] `vercel.json` đã được tạo
- [ ] `api/index.ts` đã được tạo
- [ ] Environment variables đã được set trên Vercel
- [ ] Build thành công local: `npm run build`
- [ ] Test API endpoints hoạt động

## 📦 Sau khi deploy

1. Lấy URL backend từ Vercel (ví dụ: `https://ecommerce-backend.vercel.app`)
2. Cập nhật `src/environments/environment.prod.ts` trong frontend:
   ```typescript
   apiUrl: 'https://ecommerce-backend.vercel.app'
   ```
3. Test API endpoints:
   - `https://ecommerce-backend.vercel.app/products`
   - `https://ecommerce-backend.vercel.app/auth/login`

## 🎯 Quick Start (Tóm tắt)

```bash
# 1. Cài PostgreSQL driver
cd backend
npm install pg @types/pg

# 2. Cập nhật app.module.ts để dùng PostgreSQL

# 3. Deploy
vercel

# 4. Set environment variables trên Vercel Dashboard

# 5. Lấy URL và cập nhật frontend
```

## 💡 Tips

1. **Sử dụng Vercel Postgres**: Tích hợp tốt nhất với Vercel
2. **Dùng Migrations**: Production nên dùng migrations thay vì `synchronize: true`
3. **Environment Variables**: Luôn dùng env vars, không hardcode
4. **Monitoring**: Sử dụng Vercel Analytics để monitor performance

