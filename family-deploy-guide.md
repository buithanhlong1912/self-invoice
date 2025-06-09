# 🏠 Deploy Self-Invoice cho Gia đình - MIỄN PHÍ

> **Dành cho**: App quản lý hóa đơn gia đình, thay thế viết tay
> **Chi phí**: Hoàn toàn miễn phí
> **Thời gian**: ~10 phút

## 🎯 **Tại sao chọn Render cho family business:**

✅ **$0/tháng** - Không tốn tiền  
✅ **1GB Database** - Đủ cho hàng nghìn hóa đơn  
✅ **Auto SSL** - Bảo mật miễn phí  
✅ **Sleep 15 phút** - OK cho gia đình (khởi động 30s)

## 🚀 **Các bước deploy:**

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "Ready for family deployment"
git push origin main
```

### Bước 2: Deploy Backend trên Render

1. **Truy cập** https://render.com
2. **Đăng ký/Đăng nhập** với GitHub
3. **New +** → **Web Service**
4. **Connect repository** `self-invoice`
5. **Cài đặt:**
   - **Name**: `self-invoice-backend`
   - **Root Directory**: `packages/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Bước 3: Thêm Database

1. **New +** → **PostgreSQL**
2. **Name**: `self-invoice-db`
3. **Instance Type**: `Free`
4. **Copy DATABASE_URL** từ Info tab

### Bước 4: Cài đặt Environment Variables

Trong Backend Web Service → **Environment**:

```
DATABASE_URL=postgresql://... (paste từ database)
NODE_ENV=production
FRONTEND_URL=https://your-frontend-name.onrender.com
```

### Bước 5: Database Migration

Sau khi backend deploy xong:

1. Vào **Shell tab** của backend service
2. Chạy:

```bash
npx prisma db push
npx prisma db seed
```

### Bước 6: Deploy Frontend

1. **New +** → **Static Site**
2. **Connect repository** `self-invoice`
3. **Cài đặt:**

   - **Name**: `self-invoice-frontend`
   - **Root Directory**: `packages/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

4. **Environment Variables:**

```
NEXT_PUBLIC_API_URL=https://self-invoice-backend.onrender.com/api
NODE_ENV=production
```

## ✅ **Hoàn thành!**

- **Frontend**: `https://self-invoice-frontend.onrender.com`
- **Backend**: `https://self-invoice-backend.onrender.com`

## 📱 **Hướng dẫn sử dụng cho Bố Mẹ:**

### **Lần đầu sử dụng:**

- Truy cập link frontend
- Đợi 30-60 giây nếu app đang "ngủ"
- Bắt đầu thêm sản phẩm và tạo hóa đơn

### **Sử dụng hàng ngày:**

- Bookmark link để truy cập nhanh
- App có thể "ngủ" sau 15 phút không dùng
- Chỉ cần refresh nếu loading chậm

### **Lưu trữ dữ liệu:**

- Tất cả dữ liệu được lưu tự động
- Có thể tải PDF hóa đơn về máy
- Database backup tự động bởi Render

## 🔧 **Maintenance:**

### **Free plan limitations:**

- Sleep sau 15 phút không dùng
- 750 giờ/tháng (đủ cho gia đình)
- 1GB database storage

### **Nếu cần upgrade sau này:**

- $7/tháng cho "always on"
- $15/tháng cho database lớn hơn

## 📞 **Support:**

Nếu có vấn đề, liên hệ: **[Your contact info]**

---

**💡 Tips cho Bố Mẹ:**

- Bookmark trang web để truy cập nhanh
- Sử dụng Chrome/Safari để trải nghiệm tốt nhất
- Có thể dùng trên điện thoại/tablet
