const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  deleteQuestion,
} = require("../controllers/questionController");

// POST /api/questions - Save question in db 
router.post("/", createQuestion);

// GET /api/questions - Get all questions formm db
router.get("/", getAllQuestions);

// DELETE /api/questions/:id - Delete question from mongo
router.delete("/:id", deleteQuestion);

module.exports = router;
