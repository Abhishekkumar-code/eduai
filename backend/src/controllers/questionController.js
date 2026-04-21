const { Question } = require("../model/schema");

// Save question in db 
const createQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question is required" });
    }

    const newQuestion = await Question.create({ question });

    res.status(201).json({
      success: true,
      message: "Question saved successfully",
      newQuestion,
    });
  } catch (error) {
    console.error("Question Controller Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all questions in db in question cluter in db bhai log
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};
// deltee question form db
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question" });
  }
};

module.exports = { createQuestion, getAllQuestions, deleteQuestion };
