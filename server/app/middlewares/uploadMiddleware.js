const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in uploads folder
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    ); // Remove special characters
    cb(null, Date.now() + "-" + sanitizedFilename);
  },
});

// File filter: Only allow images, PDFs, and Word docs
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

  if (!allowedMIMETypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only images, PDFs, and Word documents are allowed."
      ),
      false
    );
  }
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("File extension not allowed."), false);
  }

  cb(null, true);
};

// Multer instance with limits and error handling
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

module.exports = upload;
