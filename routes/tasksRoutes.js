const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(verifyAccessToken);

router.post("/create-task", createTask);
router.get("/get-tasks", getTasks);
router.put("/update-task/:taskId", updateTask);
router.delete("/delete-task/:taskId", deleteTask);

module.exports = router;
