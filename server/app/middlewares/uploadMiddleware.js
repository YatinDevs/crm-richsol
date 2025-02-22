const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});

// File filter: Allow images, PDFs, and Word documents
const fileFilter = (req, file, cb) => {
  const allowedMIMETypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMIMETypes.includes(file.mimetype) ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and Word documents are allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
