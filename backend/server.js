const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const upload = multer({ dest: 'uploads/' });

// POST /api/reports - create a new report
app.post('/api/reports', upload.array('images'), async (req, res) => {
  try {
    const {
      type, severity, description, location,
      latitude, longitude, status, contact
    } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const dest = `reports/${Date.now()}_${file.originalname}`;
        const fileBuffer = fs.readFileSync(file.path);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(dest, fileBuffer, { contentType: file.mimetype });

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(dest);

        if (publicUrlData && publicUrlData.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl);
        }

        // Remove local file after upload
        fs.unlinkSync(file.path);
      }
    }

    // Insert report into Supabase table
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        type,
        severity,
        description,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status,
        contact,
        imageUrls,
        timestamp: new Date().toISOString()
      }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/reports - fetch all reports
app.get('/api/reports', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = supabase.from('reports').select('*');

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});