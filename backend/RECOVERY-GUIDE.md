# Hướng dẫn khôi phục Database

## Bước 1: Khởi động Backend Server

Mở terminal mới và chạy:

```bash
cd C:\Users\minhv\ng-ecommerce\backend
npx nest start --watch
```

**Đợi cho đến khi thấy:**

```
[Nest] ... LOG [NestApplication] Nest application successfully started
```

## Bước 2: Kiểm tra Backend (Terminal mới)

Mở terminal thứ 2 và chạy:

```bash
cd C:\Users\minhv\ng-ecommerce\backend
node check-backend.js
```

Nếu thấy "Backend is NOT running", quay lại Bước 1.

## Bước 3: Seed Products

```bash
node seed-products.js
```

Bạn sẽ thấy:

```
✓ Created: Wireless Headphones
✓ Created: Smart Watch
...
```

## Bước 4: Seed Reviews

```bash
node seed-reviews.js
```

## Bước 5: Kiểm tra lại

```bash
node check-backend.js
```

Bạn sẽ thấy danh sách 12 products với reviews.

## Bước 6: Khởi động Frontend

Mở terminal thứ 3:

```bash
cd C:\Users\minhv\ng-ecommerce
npm start
```

---

## Script nhanh (Chỉ dùng khi backend đã chạy)

```bash
# Trong thư mục backend
node seed-products.js && node seed-reviews.js
```

## Nếu gặp lỗi "Connection refused"

Backend chưa chạy. Quay lại Bước 1.

## Nếu muốn reset lại từ đầu

1. Stop backend (Ctrl+C trong terminal backend)
2. Xóa database: `Remove-Item ecommerce.db`
3. Quay lại Bước 1
