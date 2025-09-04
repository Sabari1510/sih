const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let reports = [];

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET reports
app.get("/api/reports", (req, res) => {
  res.json(reports);
});

// POST report (supports multiple images + description + geotag)
app.post("/api/reports", upload.array("images", 6), (req, res) => {
  const { latitude, longitude, description } = req.body;
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const imageUrls = files.map((f) => `/uploads/${f.filename}`);

  const newReport = {
    id: reports.length + 1,
    imageUrls,
    description: description || "",
    latitude: latitude !== undefined ? parseFloat(latitude) : null,
    longitude: longitude !== undefined ? parseFloat(longitude) : null,
    timestamp: new Date(),
  };

  reports.push(newReport);
  res.json({ message: "Report added successfully", report: newReport });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
