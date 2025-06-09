import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/brands - Lấy danh sách thương hiệu
router.get("/", async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách thương hiệu" });
  }
});

// GET /api/brands/:id - Lấy thương hiệu theo ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id },
      include: {
        products: true,
      },
    });

    if (!brand) {
      return res.status(404).json({ error: "Không tìm thấy thương hiệu" });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin thương hiệu" });
  }
});

// POST /api/brands - Tạo thương hiệu mới
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tên thương hiệu là bắt buộc" });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo thương hiệu mới" });
  }
});

// PUT /api/brands/:id - Cập nhật thương hiệu
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const brand = await prisma.brand.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
      },
    });

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật thương hiệu" });
  }
});

// DELETE /api/brands/:id - Xóa thương hiệu
router.delete("/:id", async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Đã xóa thương hiệu thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa thương hiệu" });
  }
});

export default router;
