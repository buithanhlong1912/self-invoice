import express from "express";
import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/invoices - Lấy danh sách hóa đơn
router.get("/", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách hóa đơn" });
  }
});

// GET /api/invoices/:id - Lấy hóa đơn theo ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin hóa đơn" });
  }
});

// POST /api/invoices - Tạo hóa đơn mới
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      taxAmount,
      discountAmount,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Hóa đơn phải có ít nhất một sản phẩm" });
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const invoiceItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Không tìm thấy sản phẩm với ID: ${item.productId}` });
      }

      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;

      invoiceItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
      });
    }

    const finalAmount = totalAmount + (taxAmount || 0) - (discountAmount || 0);

    // Tạo số hóa đơn unique
    const invoiceNumber = `HD-${Date.now()}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        totalAmount,
        taxAmount: taxAmount || 0,
        discountAmount: discountAmount || 0,
        finalAmount,
        notes,
        items: {
          create: invoiceItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi tạo hóa đơn mới" });
  }
});

// GET /api/invoices/:id/pdf - Xuất hóa đơn thành PDF
router.get("/:id/pdf", async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    }

    // Tạo HTML cho hóa đơn
    const invoiceHtml = generateInvoiceHtml(invoice);

    // Tạo PDF từ HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHtml);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="hoa-don-${invoice.invoiceNumber}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi xuất PDF hóa đơn" });
  }
});

// Function để tạo HTML template cho hóa đơn
function generateInvoiceHtml(invoice: any) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hóa đơn ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
        .invoice-header { text-align: center; margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
        .invoice-number { font-size: 16px; color: #666; margin-top: 5px; }
        .customer-info { margin-bottom: 30px; }
        .customer-info h3 { margin-bottom: 10px; color: #333; }
        .customer-info p { margin: 5px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f5f5f5; font-weight: bold; }
        .items-table .number { text-align: center; }
        .items-table .price { text-align: right; }
        .total-section { margin-top: 30px; }
        .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .total-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        .notes { margin-top: 30px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
        <div class="invoice-number">Số: ${invoice.invoiceNumber}</div>
        <div class="invoice-number">Ngày: ${new Date(
          invoice.createdAt
        ).toLocaleDateString("vi-VN")}</div>
      </div>
      
      <div class="customer-info">
        <h3>Thông tin khách hàng:</h3>
        <p><strong>Tên:</strong> ${invoice.customerName || "Khách lẻ"}</p>
        ${
          invoice.customerPhone
            ? `<p><strong>Điện thoại:</strong> ${invoice.customerPhone}</p>`
            : ""
        }
        ${
          invoice.customerEmail
            ? `<p><strong>Email:</strong> ${invoice.customerEmail}</p>`
            : ""
        }
        ${
          invoice.customerAddress
            ? `<p><strong>Địa chỉ:</strong> ${invoice.customerAddress}</p>`
            : ""
        }
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th class="number">STT</th>
            <th>Tên sản phẩm</th>
            <th class="number">Số lượng</th>
            <th class="price">Đơn giá</th>
            <th class="price">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item: any, index: number) => `
            <tr>
              <td class="number">${index + 1}</td>
              <td>${item.product.name}</td>
              <td class="number">${item.quantity}</td>
              <td class="price">${item.unitPrice.toLocaleString("vi-VN")} đ</td>
              <td class="price">${item.totalPrice.toLocaleString(
                "vi-VN"
              )} đ</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="total-section">
        <div class="total-row">
          <span>Tổng tiền hàng:</span>
          <span>${invoice.totalAmount.toLocaleString("vi-VN")} đ</span>
        </div>
        ${
          invoice.discountAmount > 0
            ? `
          <div class="total-row">
            <span>Giảm giá:</span>
            <span>-${invoice.discountAmount.toLocaleString("vi-VN")} đ</span>
          </div>
        `
            : ""
        }
        ${
          invoice.taxAmount > 0
            ? `
          <div class="total-row">
            <span>Thuế:</span>
            <span>${invoice.taxAmount.toLocaleString("vi-VN")} đ</span>
          </div>
        `
            : ""
        }
        <div class="total-row final">
          <span>Tổng thanh toán:</span>
          <span>${invoice.finalAmount.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>
      
      ${
        invoice.notes
          ? `
        <div class="notes">
          <h3>Ghi chú:</h3>
          <p>${invoice.notes}</p>
        </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>Cảm ơn quý khách đã mua hàng!</p>
      </div>
    </body>
    </html>
  `;
}

export default router;
