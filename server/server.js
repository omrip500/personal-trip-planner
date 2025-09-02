const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// ✅ CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/routes");

// ✅ API Routes
app.use("/api", authRoutes);
app.use("/api", tripRoutes);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// ✅ Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
