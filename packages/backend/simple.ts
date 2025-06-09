import express from "express";
import cors from "cors";

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Simple server is running" });
});

app.listen(port, () => {
  console.log(`🚀 Simple server running at http://localhost:${port}`);
});
