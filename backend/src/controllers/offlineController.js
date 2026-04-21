const fs = require("fs");
const path = require("path");
const { ChatHistory } = require("../model/schema");


const loadClassData = (classNumber) => {
const filePath = path.join(__dirname, `../data/class${classNumber}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  }
  return null;
};


const cleanText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?.,!;:'"-]/g, "")   
    .replace(/\s+/g, " ")          
};


const STOP_WORDS = new Set([
  "the", "are", "was", "were", "who", "how", "why", "when", "where",
  "which", "does", "did", "has", "have", "had", "can", "could", "would",
  "should", "will", "this", "that", "these", "those", "and", "but", "for",
  "with", "from", "into", "give", "tell", "also", "very", "just", "about"
]);


const findBestMatch = (question, classData) => {
  const cleaned = cleanText(question);


  const allWords = cleaned.split(" ").filter((w) => w.length > 1);

  const keywords = allWords.filter((w) => !STOP_WORDS.has(w));


  const searchWords = keywords.length > 0 ? keywords : allWords;

  let bestMatch = null;
  let highestScore = 0;

  for (const subject in classData.subjects) {
    const questions = classData.subjects[subject];

    for (const item of questions) {
      const qCleaned = cleanText(item.question);
      const aCleaned = cleanText(item.answer);
      const tCleaned = cleanText(item.topic);
      let score = 0;

      if (qCleaned === cleaned) {
        score += 100;
      }

     
      if (qCleaned.includes(cleaned) || cleaned.includes(qCleaned)) {
        score += 40;
      }

      searchWords.forEach((word) => {
        if (qCleaned.includes(word)) score += 3;   
        if (tCleaned.includes(word)) score += 2;   
        if (aCleaned.includes(word)) score += 0.5; 
      });

      
      for (let i = 0; i < searchWords.length - 1; i++) {
        const phrase = searchWords[i] + " " + searchWords[i + 1];
        if (qCleaned.includes(phrase)) score += 5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { ...item, subject };
      }
    }
  }

  return highestScore >= 1.5 ? bestMatch : null;
};

const askOffline = async (req, res) => {
  try {
    const { question, classNumber } = req.body;


    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid question.",
      });
    }

    const classNum = parseInt(classNumber) || 10;
    const classData = loadClassData(classNum);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: `No offline data found for Class ${classNum}. Please check your data files.`,
      });
    }

   
    if (!classData.subjects || typeof classData.subjects !== "object") {
      return res.status(500).json({
        success: false,
        message: "Offline data format is incorrect. Please check your JSON structure.",
      });
    }

    const match = findBestMatch(question, classData);

  
    if (!match) {
      return res.status(200).json({
        success: false,
        source: "offline",
        message: "No matching answer found in offline data. Please connect to internet for AI answer.",
      });
    }

    try {
      await ChatHistory.create({
        question,
        answer: match.answer,
        source: "offline",
        class: classNum,
      });
    } catch (dbErr) {
      console.warn("DB save failed (non-critical):", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      source: "offline",
      question,
      answer: match.answer,
      topic: match.topic || "",
      subject: match.subject || "",
      class: classNum,
    });

  } catch (error) {
    console.error("Offline Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
};


const getAvailableClasses = (req, res) => {
  try {
    const dataDir = path.join(__dirname, "../data");
    const files = fs.readdirSync(dataDir);
    const classes = files
      .filter((f) => f.startsWith("class") && f.endsWith(".json"))
      .map((f) => parseInt(f.replace("class", "").replace(".json", "")))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    return res.status(200).json({ success: true, availableClasses: classes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load available classes.",
      error: error.message,
    });
  }
};

module.exports = { askOffline, getAvailableClasses };