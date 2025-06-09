# 🚀 Hướng dẫn Deploy Self-Invoice

## Lựa chọn 1: Railway (Khuyên dùng) - Fullstack đơn giản

### Bước 1: Chuẩn bị Database cho Production

1. **Cập nhật Prisma Schema để hỗ trợ PostgreSQL:**

```bash
cd packages/backend
```

Sửa file `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Thay vì "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Generate lại Prisma Client:**

```bash
npx prisma generate
```

### Bước 2: Deploy lên Railway

1. **Đăng ký Railway:**

   - Truy cập https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo Project mới:**

   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Thiết lập Database:**

   - Trong Railway dashboard, click "New"
   - Chọn "Database" → "PostgreSQL"
   - Copy DATABASE_URL từ Variables tab

4. **Thiết lập Environment Variables:**

   Trong Settings → Variables, thêm:

   ```
   DATABASE_URL=postgresql://... (từ PostgreSQL service)
   FRONTEND_URL=https://your-app-name.up.railway.app
   PORT=5002
   NODE_ENV=production
   ```

5. **Deploy Backend:**

   ```bash
   # Railway sẽ tự động detect và build
   # Đảm bảo có file railway.json ở root
   ```

6. **Migrate Database:**

   Sau khi deploy thành công, chạy migration:

   ```bash
   # Trong Railway console hoặc local với DATABASE_URL production
   npx prisma db push
   npx prisma db seed  # Nếu muốn data mẫu
   ```

### Bước 3: Deploy Frontend

Railway sẽ tự động detect Next.js và deploy frontend.

**Cập nhật `packages/frontend/next.config.js`:**

```js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://your-backend-url.railway.app/api/:path*"
            : "http://localhost:5002/api/:path*",
      },
    ];
  },
};
```

---

## Lựa chọn 2: Vercel - Chuyên cho Next.js

### Bước 1: Chuyển Backend sang Vercel Functions

1. **Tạo thư mục API:**

```bash
mkdir -p packages/frontend/pages/api
```

2. **Chuyển đổi Express routes thành Vercel Functions:**

Tạo `packages/frontend/pages/api/products.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      include: { brand: true },
    });
    res.json(products);
  }
  // ... other methods
}
```

### Bước 2: Deploy Frontend + API

1. **Cài Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
cd packages/frontend
vercel
```

3. **Thiết lập Database:**
   - Dùng PlanetScale (MySQL) hoặc Supabase (PostgreSQL)
   - Cập nhật DATABASE_URL trong Vercel dashboard

---

## Lựa chọn 3: Render - Miễn phí hoàn toàn

### Bước 1: Tách riêng Frontend và Backend

1. **Deploy Backend:**

   - Tạo repository riêng cho backend
   - Render sẽ auto-deploy từ GitHub
   - Thêm PostgreSQL database (miễn phí)

2. **Deploy Frontend:**
   - Deploy Next.js như static site
   - Cập nhật API endpoints

### Environment Variables cần thiết:

**Backend:**

```
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-frontend.onrender.com
NODE_ENV=production
```

**Frontend:**

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## ⚡ Khuyên dùng Railway vì:

✅ **Đơn giản nhất** - Deploy toàn bộ monorepo  
✅ **Database included** - PostgreSQL sẵn có  
✅ **Auto-deploy** - Mỗi lần push Git  
✅ **Custom domain** - Miễn phí subdomain  
✅ **Logs & Monitoring** - Built-in

**Chi phí:** ~$5/tháng sau khi hết $5 credit miễn phí.

Bạn muốn tôi hướng dẫn chi tiết deploy lên platform nào?
