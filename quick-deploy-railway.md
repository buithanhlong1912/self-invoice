# ⚡ Deploy Railway - 5 phút

## Bước 1: Push code lên GitHub (nếu chưa có)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Bước 2: Railway Setup

1. Truy cập https://railway.app
2. "Login with GitHub"
3. "New Project" → "Deploy from GitHub repo"
4. Chọn repository `self-invoice`

## Bước 3: Add PostgreSQL Database

1. Trong Railway dashboard: "New" → "Database" → "PostgreSQL"
2. Copy DATABASE_URL từ Variables tab

## Bước 4: Environment Variables

Trong project Settings → Variables:

```
DATABASE_URL=postgresql://... (từ PostgreSQL service)
FRONTEND_URL=https://self-invoice-production.up.railway.app
NODE_ENV=production
```

## Bước 5: Database Migration

Sau khi deploy xong, chạy:

```bash
# Với DATABASE_URL từ Railway
cd packages/backend
npx prisma db push
npx prisma db seed
```

## ✅ Done!

App sẽ chạy tại: `https://your-app.up.railway.app`

**Thời gian:** ~5 phút  
**Chi phí:** $5/tháng sau khi hết credit
