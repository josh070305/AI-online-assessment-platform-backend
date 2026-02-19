import express from "express";

const app = express();

app.use(express.json());

// ✅ root route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running 🚀" });
});

// ✅ health route
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// ✅ 404 handler (keep last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

export default app;
