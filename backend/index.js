const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/oceanHazard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Report model
const Report = require("./models/Report");

// POST new report
app.post("/api/reports", upload.single("photo"), async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;
    const report = new Report({
      description,
      latitude,
      longitude,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all reports
app.get("/api/reports", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
