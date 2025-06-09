# 💚 Deploy Render - Miễn phí

## Bước 1: Tách Backend & Frontend

### 1.1 Tạo repo Backend riêng:

```bash
# Copy backend files
mkdir ../self-invoice-backend
cp -r packages/backend/* ../self-invoice-backend/
cd ../self-invoice-backend

# Tạo package.json root
echo '{
  "name": "self-invoice-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": { ... }
}' > package.json

git init && git add . && git commit -m "Backend for Render"
git push origin main
```

### 1.2 Tạo repo Frontend riêng:

```bash
mkdir ../self-invoice-frontend
cp -r packages/frontend/* ../self-invoice-frontend/
cd ../self-invoice-frontend

# Update next.config.js
echo 'const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-backend.onrender.com/api/:path*",
      },
    ];
  },
};
module.exports = nextConfig;' > next.config.js

git init && git add . && git commit -m "Frontend for Render"
git push origin main
```

## Bước 2: Deploy Backend

1. Truy cập https://render.com
2. "New" → "Web Service"
3. Connect GitHub repo `self-invoice-backend`
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18

## Bước 3: Add Database

1. "New" → "PostgreSQL"
2. Copy DATABASE_URL

## Bước 4: Environment Variables

Trong Web Service → Environment:

```
DATABASE_URL=postgresql://... (từ PostgreSQL)
NODE_ENV=production
```

## Bước 5: Deploy Frontend

1. "New" → "Static Site"
2. Connect GitHub repo `self-invoice-frontend`
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`

## ⚠️ Lưu ý:

- Backend sẽ sleep sau 15 phút không dùng
- Startup time ~30-60 giây từ sleep

## ✅ Done!

- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-frontend.onrender.com`

**Thời gian:** ~15 phút  
**Chi phí:** Hoàn toàn miễn phí
