# Hướng dẫn Deploy dự án E-commerce

## 📋 Yêu cầu trước khi deploy

1. **Backend đã được deploy**: Đảm bảo backend NestJS đã được deploy và có URL production
2. **Cập nhật API URL**: Cập nhật URL backend trong `src/environments/environment.prod.ts`

## 🚀 Deploy lên Vercel

### Bước 1: Cài đặt Vercel CLI (nếu chưa có)

```bash
npm install -g vercel
```

### Bước 2: Đăng nhập Vercel

```bash
vercel login
```

### Bước 3: Cập nhật API URL

Mở file `src/environments/environment.prod.ts` và thay đổi `apiUrl` thành URL backend production của bạn:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.vercel.app', // Thay đổi URL này
};
```

### Bước 4: Build và test local

```bash
npm run build
```

Kiểm tra thư mục `dist/ng-ecommerce/browser` đã được tạo thành công.

### Bước 5: Deploy lên Vercel

**Cách 1: Deploy qua CLI**

```bash
vercel
```

Hoặc deploy production:

```bash
vercel --prod
```

**Cách 2: Deploy qua GitHub (Khuyến nghị)**

1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com)
3. Import project từ GitHub
4. Vercel sẽ tự động detect Angular project và sử dụng cấu hình trong `vercel.json`

### Bước 6: Cấu hình Environment Variables (Nếu cần)

Nếu bạn muốn sử dụng environment variables thay vì hardcode URL:

1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm biến `API_URL` với giá trị là URL backend của bạn
3. Cập nhật `src/environments/environment.prod.ts` để sử dụng biến này (cần custom build script)

## 🔧 Cấu hình đã được thiết lập

### 1. Vercel Configuration (`vercel.json`)
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist/ng-ecommerce/browser`
- ✅ SPA routing: Tất cả routes được redirect về `/index.html`
- ✅ Security headers đã được thêm

### 2. Environment Configuration
- ✅ Development: `src/environments/environment.ts` (localhost:3000)
- ✅ Production: `src/environments/environment.prod.ts` (cần cập nhật URL)

### 3. Services đã được cập nhật
- ✅ `ApiService` sử dụng `environment.apiUrl`
- ✅ `AuthService` sử dụng `environment.apiUrl`

## 📝 Lưu ý quan trọng

1. **CORS**: Đảm bảo backend đã cấu hình CORS để cho phép requests từ domain frontend
2. **HTTPS**: Vercel tự động cung cấp HTTPS
3. **Environment Variables**: Nếu backend URL thay đổi, cần rebuild và redeploy
4. **Build Optimization**: Production build đã được tối ưu với tree shaking và lazy loading

## 🐛 Troubleshooting

### Lỗi: Build failed
- Kiểm tra `package.json` có đầy đủ dependencies
- Chạy `npm install` trước khi build
- Kiểm tra TypeScript errors: `npm run build`

### Lỗi: API không kết nối được
- Kiểm tra CORS configuration trên backend
- Kiểm tra API URL trong `environment.prod.ts`
- Kiểm tra backend đã được deploy và hoạt động

### Lỗi: Routes không hoạt động
- Kiểm tra `vercel.json` có cấu hình `rewrites` đúng
- Đảm bảo tất cả routes được redirect về `/index.html`

## 📦 Alternative: Deploy lên các platform khác

### Netlify
1. Tạo file `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist/ng-ecommerce/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Firebase Hosting
1. Cài đặt Firebase CLI: `npm install -g firebase-tools`
2. Chạy `firebase init`
3. Cấu hình `firebase.json`:
```json
{
  "hosting": {
    "public": "dist/ng-ecommerce/browser",
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}
```
4. Deploy: `firebase deploy`

### GitHub Pages
1. Cài đặt `angular-cli-ghpages`: `npm install -g angular-cli-ghpages`
2. Build: `ng build --configuration production --base-href=/repository-name/`
3. Deploy: `npx angular-cli-ghpages --dir=dist/ng-ecommerce/browser`

## ✅ Checklist trước khi deploy

- [ ] Backend đã được deploy và hoạt động
- [ ] API URL đã được cập nhật trong `environment.prod.ts`
- [ ] Build thành công local: `npm run build`
- [ ] Đã test các chức năng chính (login, products, cart, checkout)
- [ ] CORS đã được cấu hình trên backend
- [ ] Environment variables đã được set (nếu cần)

## 🎉 Sau khi deploy

1. Kiểm tra website hoạt động đúng
2. Test các chức năng: login, register, browse products, add to cart, checkout
3. Kiểm tra console không có lỗi
4. Test trên mobile devices

