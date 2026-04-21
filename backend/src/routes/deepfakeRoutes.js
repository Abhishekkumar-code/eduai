const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { checkDeepfake, getDeepfakeHistory } = require("../controllers/deepfakeController");

// multer for temporey storage of file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/deepfake/check - for cheeck agr image ai generated hai to 
router.post("/check", upload.single("image"), checkDeepfake);

// GET /api/deepfake/history - get history in db 
router.get("/history", getDeepfakeHistory);

module.exports = router;
