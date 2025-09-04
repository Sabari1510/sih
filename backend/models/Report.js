const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  description: String,
  latitude: Number,
  longitude: Number,
  photo: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);
