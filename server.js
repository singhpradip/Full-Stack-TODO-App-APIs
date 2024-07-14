require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage });

app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
console.log(process.env.CLIENT_URL);
app.use(bodyParser.json());
app.use(express.json());

connectDB();

app.use("/api/auth", upload.single("profilePicture"), authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Todo App Backend Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
