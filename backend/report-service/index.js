const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/aapda_setu")
  .then(() => console.log("Report Service - MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// Report Schema
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String
  },
  category: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  images: [String],
  reportedBy: { type: String, required: true },
  verificationData: {
    isVerified: Boolean,
    confidence: Number,
    reason: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);

// Routes
app.get("/", (req, res) => res.send("Report Service Running ✅"));

// Create new report
app.post("/create", async (req, res) => {
  try {
    const reportData = req.body;
    
    // Call AI service for verification
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/verify`, reportData);
      reportData.verificationData = aiResponse.data;
      reportData.status = aiResponse.data.is_verified ? 'verified' : 'pending';
    } catch (aiError) {
      console.log("AI service unavailable, proceeding without verification");
    }
    
    const report = new Report(reportData);
    await report.save();
    
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby reports
app.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }
    
    // Simple distance-based query (in production, use MongoDB geospatial queries)
    const reports = await Report.find({ status: 'verified' })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get report by ID
app.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Report Service running on port ${PORT}`);
});