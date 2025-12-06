# Giải thích về Environment Files

## 🎯 Mục đích

Environment files giúp bạn quản lý các cấu hình khác nhau cho từng môi trường:
- **Development** (phát triển): Chạy trên máy local
- **Production** (triển khai): Chạy trên server thật

## 📁 Các file Environment

### 1. `environment.ts` - Dùng cho Development
```typescript
export const environment = {
  production: false,              // Đang ở chế độ development
  apiUrl: 'http://localhost:3000', // Backend chạy trên máy local
};
```

**Khi nào dùng:**
- Khi chạy `ng serve` hoặc `npm start`
- Khi test trên máy local
- Backend chạy ở `localhost:3000`

### 2. `environment.prod.ts` - Dùng cho Production
```typescript
export const environment = {
  production: true,                              // Đang ở chế độ production
  apiUrl: 'https://your-backend-url.vercel.app', // Backend trên server thật
};
```

**Khi nào dùng:**
- Khi build production: `npm run build:prod`
- Khi deploy lên Vercel, Netlify, etc.
- Backend đã được deploy lên server

## 🔄 Cách hoạt động

### Trong Development:
```typescript
// Khi chạy: ng serve
// Angular sử dụng: src/environments/environment.ts
// → apiUrl = 'http://localhost:3000'
```

### Trong Production:
```typescript
// Khi chạy: ng build --configuration production
// Angular tự động thay thế:
//   src/environments/environment.ts 
//   → src/environments/environment.prod.ts
// → apiUrl = 'https://your-backend-url.vercel.app'
```

### Cấu hình trong `angular.json`:
```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}
```

## 💡 Ví dụ thực tế

### Scenario 1: Đang phát triển trên máy local
```typescript
// environment.ts được dùng
apiUrl = 'http://localhost:3000'
// → Frontend gọi API đến: http://localhost:3000/products
```

### Scenario 2: Đã deploy lên Vercel
```typescript
// environment.prod.ts được dùng
apiUrl = 'https://my-backend.vercel.app'
// → Frontend gọi API đến: https://my-backend.vercel.app/products
```

## 🔧 Cách sử dụng trong code

### Trong Service (đã được cấu hình sẵn):
```typescript
// src/app/services/api.service.ts
import { environment } from '../../environments/environment';

export class ApiService {
  private apiUrl = environment.apiUrl; // Tự động dùng đúng URL theo môi trường
  
  getProducts() {
    return this.http.get(`${this.apiUrl}/products`);
    // Development: http://localhost:3000/products
    // Production: https://your-backend-url.vercel.app/products
  }
}
```

## 📝 Cách cập nhật API URL cho Production

### Bước 1: Tìm URL backend production của bạn
Ví dụ:
- Backend deploy trên Vercel: `https://my-ecommerce-api.vercel.app`
- Backend deploy trên Railway: `https://my-api.railway.app`
- Backend deploy trên Render: `https://my-api.onrender.com`

### Bước 2: Cập nhật `environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://my-ecommerce-api.vercel.app', // ← Thay đổi URL này
};
```

### Bước 3: Build lại
```bash
npm run build:prod
```

## ⚠️ Lưu ý quan trọng

1. **Không hardcode URL trong code**
   ```typescript
   // ❌ SAI
   this.http.get('http://localhost:3000/products')
   
   // ✅ ĐÚNG
   this.http.get(`${environment.apiUrl}/products`)
   ```

2. **Luôn dùng environment.apiUrl**
   - Tự động chuyển đổi giữa dev và prod
   - Dễ bảo trì và cập nhật

3. **Kiểm tra URL trước khi deploy**
   - Đảm bảo backend đã được deploy
   - Test API URL có hoạt động không
   - Kiểm tra CORS đã được cấu hình

## 🎬 Workflow thực tế

### Khi phát triển:
```bash
npm start
# → Dùng environment.ts
# → API: http://localhost:3000
```

### Khi deploy:
```bash
# 1. Cập nhật environment.prod.ts với URL backend thật
# 2. Build production
npm run build:prod
# → Dùng environment.prod.ts
# → API: https://your-backend-url.vercel.app

# 3. Deploy
vercel --prod
```

## ❓ Câu hỏi thường gặp

**Q: Tại sao cần 2 file environment?**
A: Để tách biệt cấu hình dev và prod, tránh phải thay đổi code mỗi lần deploy.

**Q: Có thể thêm nhiều biến khác không?**
A: Có! Ví dụ:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  appName: 'My E-commerce',
  version: '1.0.0',
  enableAnalytics: true,
};
```

**Q: Làm sao biết đang dùng file nào?**
A: Kiểm tra `environment.production`:
```typescript
if (environment.production) {
  console.log('Đang chạy production mode');
} else {
  console.log('Đang chạy development mode');
}
```

