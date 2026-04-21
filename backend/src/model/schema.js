const mongoose = require("mongoose");

// question model
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// chat history model data store in db 
const chatHistorySchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    class: {
      type: Number,
      min: 5,
      max: 12,
    },
  },
  { timestamps: true }
);

// deepfake ka result 
const deepfakeSchema = new mongoose.Schema(
  {
    imageName: {
      type: String,
      required: true,
    },
    isAIGenerated: {
      type: Boolean,
      required: true,
    },
    confidence: {
      type: Number,
    },
    details: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
const DeepfakeResult = mongoose.model("DeepfakeResult", deepfakeSchema);

module.exports = { Question, ChatHistory, DeepfakeResult };
