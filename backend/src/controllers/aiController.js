const axios = require("axios");
const { ChatHistory } = require("../model/schema");

const askAI = async (req, res) => {
  try {
    const { question, classNumber } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question is required" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not found in .env" });
    }

    const prompt = `You are a helpful education assistant for Indian school students of Class ${classNumber || 5}. 
    Answer the following question in simple, easy-to-understand language suitable for a student.
    Question: ${question}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const answer = response.data.candidates[0].content.parts[0].text;

    await ChatHistory.create({
      question,
      answer,
      source: "online",
      class: classNumber || 5,
    });

    res.status(200).json({
      success: true,
      source: "online",
      question,
      answer,
    });
  } catch (error) {
    console.error("AI Controller Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "AI API failed. Try offline mode.",
      error: error.response?.data || error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

module.exports = { askAI, getChatHistory };