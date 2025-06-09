import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Đang tạo dữ liệu mẫu...");

  // Tạo brands mẫu
  const apple = await prisma.brand.upsert({
    where: { name: "Apple" },
    update: {},
    create: {
      name: "Apple",
      description: "Thương hiệu công nghệ hàng đầu thế giới",
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { name: "Samsung" },
    update: {},
    create: {
      name: "Samsung",
      description: "Thương hiệu điện tử Hàn Quốc",
    },
  });

  const xiaomi = await prisma.brand.upsert({
    where: { name: "Xiaomi" },
    update: {},
    create: {
      name: "Xiaomi",
      description: "Thương hiệu công nghệ Trung Quốc",
    },
  });

  // Tạo products mẫu
  const products = [
    {
      name: "iPhone 15 Pro",
      description: "Điện thoại thông minh cao cấp từ Apple",
      price: 29990000,
      cost: 25000000,
      stock: 10,
      sku: "IP15PRO",
      brandId: apple.id,
    },
    {
      name: "Samsung Galaxy S24",
      description: "Flagship Android mới nhất từ Samsung",
      price: 22990000,
      cost: 19000000,
      stock: 15,
      sku: "SGS24",
      brandId: samsung.id,
    },
    {
      name: "Xiaomi 14",
      description: "Smartphone tầm trung cao cấp",
      price: 12990000,
      cost: 10000000,
      stock: 20,
      sku: "XM14",
      brandId: xiaomi.id,
    },
    {
      name: "AirPods Pro",
      description: "Tai nghe không dây chống ồn",
      price: 6990000,
      cost: 5500000,
      stock: 25,
      sku: "APPRO",
      brandId: apple.id,
    },
    {
      name: "Samsung Galaxy Buds Pro",
      description: "Tai nghe không dây premium",
      price: 4990000,
      cost: 4000000,
      stock: 30,
      sku: "SGBPRO",
      brandId: samsung.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log("✅ Đã tạo dữ liệu mẫu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi tạo dữ liệu mẫu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
