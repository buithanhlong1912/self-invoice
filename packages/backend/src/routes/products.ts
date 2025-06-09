import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products - Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

// GET /api/products/:id - Lấy sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin sản phẩm" });
  }
});

// POST /api/products - Tạo sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const { name, description, price, cost, stock, sku, barcode, brandId } =
      req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ error: "Tên sản phẩm và giá bán là bắt buộc" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        stock: stock ? parseInt(stock) : 0,
        sku,
        barcode,
        brandId: brandId || null,
      },
      include: {
        brand: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi tạo sản phẩm mới" });
  }
});

// PUT /api/products/:id - Cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, cost, stock, sku, barcode, brandId } =
      req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        cost: cost ? parseFloat(cost) : null,
        stock: stock ? parseInt(stock) : undefined,
        sku,
        barcode,
        brandId: brandId || null,
      },
      include: {
        brand: true,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
  }
});

// DELETE /api/products/:id - Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
  }
});

export default router;
