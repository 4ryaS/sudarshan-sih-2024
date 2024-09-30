const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const app = express();
const port = 3000;

const cors = require('cors');

app.use(cors);

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Utility function for regex pattern matching
const extractDetails = (text) => {
  const lines = text.trim().split('\n');
  const name = lines[2]?.trim() || "Name not found";

  const dobPattern = /DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/;
  const genderPattern = /(Male|Female)/i;
  const aadharPattern = /(\d{4}\s\d{4}\s\d{4})/;

  const dobMatch = dobPattern.exec(text);
  const genderMatch = genderPattern.exec(text);
  const aadharMatch = aadharPattern.exec(text);

  return {
    name,
    dob: dobMatch ? dobMatch[1] : "DOB not found",
    gender: genderMatch ? genderMatch[1] : "Gender not found",
    aadhar: aadharMatch ? aadharMatch[1] : "Aadhaar not found"
  };
};

// POST endpoint to handle image upload and OCR processing
app.post('/process-image', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;

  Tesseract.recognize(
    imagePath,
    'eng+guj',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    const details = extractDetails(text);
    res.json(details);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
