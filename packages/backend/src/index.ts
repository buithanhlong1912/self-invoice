import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import productsRouter from "./routes/products";
import brandsRouter from "./routes/brands";
import invoicesRouter from "./routes/invoices";

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
const prisma = new PrismaClient();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/invoices", invoicesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Self Invoice API đang chạy",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Có lỗi xảy ra trên server",
      message: err.message,
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Không tìm thấy endpoint",
    path: req.originalUrl,
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Đang tắt server...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
