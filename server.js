const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/tasks", require("./routes/tasks"));

// Define a basic route
app.get("/", (req, res) => {
  res.send("Todo App Backend Server is running.");
});

// Start server
const PORT = process.env.PORT || 3956;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
