const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());

connectDB();

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/tasks", require("./routes/tasks"));

app.get("/", (req, res) => {
  res.send("Todo App Backend Server is running.");
});

const PORT = process.env.PORT || 3956;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
