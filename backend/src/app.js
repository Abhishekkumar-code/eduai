const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes hai ye
const aiRoutes = require("./routes/aiRoutes");
const offlineRoutes = require("./routes/offlineRoutes");
const deepfakeRoutes = require("./routes/deepfakeRoutes");
const questionRoutes = require("./routes/questionRoutes");

app.use("/api/ai", aiRoutes);
app.use("/api/offline", offlineRoutes);
app.use("/api/deepfake", deepfakeRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running!" });
});

module.exports = app;
