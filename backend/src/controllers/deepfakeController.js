const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { DeepfakeResult } = require("../model/schema");

const checkDeepfake = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const SIGHTENGINE_API_USER = process.env.SIGHTENGINE_API_USER;
    const SIGHTENGINE_API_SECRET = process.env.SIGHTENGINE_API_SECRET;

    const formData = new FormData();
    formData.append("media", fs.createReadStream(req.file.path));
    formData.append("models", "deepfake");
    formData.append("api_user", SIGHTENGINE_API_USER);
    formData.append("api_secret", SIGHTENGINE_API_SECRET);

    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      formData,
      { headers: formData.getHeaders() }
    );

    const result = response.data;
    const deepfakeScore = result?.type?.deepfake || 0;
    const isAIGenerated = deepfakeScore > 0.5;

    //data sav in db
    const savedResult = await DeepfakeResult.create({
      imageName: req.file.originalname,
      isAIGenerated,
      confidence: deepfakeScore,
      details: result,
    });

    // delete file afeter processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      imageName: req.file.originalname,
      isAIGenerated,
      confidence: (deepfakeScore * 100).toFixed(2) + "%",
      verdict: isAIGenerated
        ? "⚠️ This image appears to be AI Generated / Deepfake"
        : "✅ This image appears to be Real",
      savedResult,
    });
  } catch (error) {
    console.error("Deepfake Controller Error:", error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Deepfake detection failed",
      error: error.message,
    });
  }
};

//all deep fake history 
const getDeepfakeHistory = async (req, res) => {
  try {
    const history = await DeepfakeResult.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: "Error fetching deepfake history" });
  }
};

module.exports = { checkDeepfake, getDeepfakeHistory };
