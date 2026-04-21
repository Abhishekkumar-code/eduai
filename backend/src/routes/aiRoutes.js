const express = require("express");
const router = express.Router();
const { askAI, getChatHistory } = require("../controllers/aiController");

// POST /api/ai/ask - post the data to the to get the 
router.post("/ask", askAI);

// GET /api/ai/history get the data those are all stor in db
router.get("/history", getChatHistory);

module.exports = router;
