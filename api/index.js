import express from "express";
import connectDatabase from "../src/config/db.js";

const app = express();

app.use(express.json());

// ✅ connect DB safely
await connectDatabase();

// ✅ ROOT ROUTE (FIXES "Route not found: /")
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀"
  });
});

// ✅ HEALTH CHECK (optional but useful)
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// ❌ KEEP THIS LAST (404 handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

export default app;
