# Self Invoice - Hệ thống Quản lý Cửa hàng và Xuất hóa đơn

## Mô tả

Ứng dụng monorepo để quản lý sản phẩm cửa hàng và xuất hóa đơn PDF với giao diện đơn giản, dễ sử dụng.

## Tính năng chính

- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý thương hiệu
- ✅ Xuất hóa đơn PDF có thể tùy chỉnh
- ✅ Giao diện đơn giản, thân thiện
- 🔄 Import sản phẩm từ Excel (sẽ phát triển sau)

## Cấu trúc Project

```
self-invoice/
├── packages/
│   ├── backend/     # API Server (Node.js + Express + TypeScript)
│   └── frontend/    # Web App (Next.js + TypeScript)
├── package.json     # Root package.json
└── README.md
```

## Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Setup Database (chỉ cần chạy 1 lần)

```bash
cd packages/backend
npx prisma db push
npm run db:seed
cd ../..
```

### 3. Chạy development

```bash
npm run dev
```

### 4. Chạy riêng lẻ

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

## Công nghệ sử dụng

- **Backend**: Node.js, Express, TypeScript, SQLite, Prisma
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **PDF**: Puppeteer (server-side rendering)
- **Database**: SQLite (đơn giản, không cần setup)

## API Endpoints

- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `GET /api/brands` - Lấy danh sách thương hiệu
- `POST /api/brands` - Thêm thương hiệu mới
- `POST /api/invoices` - Tạo hóa đơn
- `GET /api/invoices/:id/pdf` - Xuất PDF hóa đơn
