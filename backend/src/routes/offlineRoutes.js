const express = require("express");
const router = express.Router();
const { askOffline, getAvailableClasses } = require("../controllers/offlineController");

// POST /api/offline/ask - offline answer deega json format se
router.post("/ask", askOffline);

// GET /api/offline/classes - form 5th to 10 th class
router.get("/classes", getAvailableClasses);

module.exports = router;
