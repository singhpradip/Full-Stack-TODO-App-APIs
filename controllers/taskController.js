const Task = require("../models/taskSchema");
const { successResponse, sendError } = require("../utils/responseUtils");
//validate data using JOI -- for now i mannually validated,,

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.body.user._id;

  if (!title || !status || !userId) {
    return sendError(res, "Invalid Inputs", 404);
  }

  try {
    const newTask = new Task({
      title,
      description,
      status,
      userId,
    });
    await newTask.save();
    return successResponse(res, "Task created successfully", newTask);
  } catch (error) {
    console.log({ error: error.message });
    return sendError(res, "Error creating task ", 500);
  }
};

const getTasks = async (req, res) => {
  const userId = req.body.user._id;
   if (!userId) {
     return sendError(res, "Invalid Inputs", 404);
   }

  try {
    const tasks = await Task.find({ userId });
    return successResponse(res, "Tasks fetched successfully", tasks);
  } catch (error) {
    console.log({ error: error.message });
    return sendError(res, "Error fetching tasks ", 500);
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;
  const userId = req.body.user._id;

  if (!taskId || !userId || !title || !status) {
    return sendError(res, "Invalid Inputs", 404);
  }

  // console.log("updateTask", taskId);
  try {
    const task = await Task.findOne({ _id: taskId, userId });
    // console.log(task);

    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();
    return successResponse(res, "Tasks updated successfully", task);
  } catch (error) {
    console.log({ error: error.message });
    return sendError(res, "Error updating tasks ", 500);
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.body.user._id;
  // console.log("updateTask", taskId);
  if (!taskId || !userId) {
    return sendError(res, "Invalid Inputs", 404);
  }
  try {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    await Task.deleteOne({ _id: taskId, userId });
    return successResponse(res, "Tasks deleted successfully");
  } catch (error) {
    console.log({ error: error.message });
    return sendError(res, "Error updating tasks ", 500);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
