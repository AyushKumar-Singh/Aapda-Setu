const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/aapda_setu")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => res.send("Aapda Setu API Gateway Running ✅"));

// Service proxies
app.use("/api/auth", (req, res) => res.send("Auth Service Connected"));
app.use("/api/report", (req, res) => res.send("Report Service Connected"));
app.use("/api/alert", (req, res) => res.send("Alert Service Connected"));
app.use("/api/ai", (req, res) => res.send("AI Service Connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});