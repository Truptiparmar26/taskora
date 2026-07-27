const Task = require("../models/Task");

// Helper to reliably extract user ID from authenticated request
const getUserId = (req) => {
  if (!req.user) return null;
  return req.user._id || req.user.id || (typeof req.user === "string" ? req.user : null);
};

// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ msg: "Authentication session required. Please sign in again." });
    }
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }); 
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ msg: "Error fetching tasks from server." });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ msg: "Your session has expired or is invalid. Please log out and log in again." });
    }

    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ msg: "Target Title is required and cannot be empty." });
    }

    const descVal = (req.body.description || req.body.desc || "").toString();
    const dateVal = req.body.dueDate || req.body.date || "";
    const priorityVal = req.body.priority || "Medium";
    const statusVal = req.body.status || "pending";

    const taskData = {
      userId,
      title: req.body.title.trim(),
      description: descVal,
      desc: descVal,
      dueDate: dateVal,
      date: dateVal,
      priority: priorityVal,
      status: statusVal
    };

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task in MongoDB:", error);
    const detailedMsg = error.errors ? Object.values(error.errors).map(e => e.message).join(", ") : error.message;
    res.status(500).json({ msg: `Database Error: ${detailedMsg || "Unable to save task."}` });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ msg: "Your session has expired. Please log in again." });
    }

    const updateData = { ...req.body };
    if (updateData.description !== undefined) updateData.desc = updateData.description;
    if (updateData.desc !== undefined) updateData.description = updateData.desc;
    if (updateData.dueDate !== undefined) updateData.date = updateData.dueDate;
    if (updateData.date !== undefined) updateData.dueDate = updateData.date;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId }, 
      updateData, 
      { new: true, runValidators: false }
    );
    if (!task) {
      return res.status(404).json({ msg: "Task record not found or unauthorized." });
    }
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    const detailedMsg = error.errors ? Object.values(error.errors).map(e => e.message).join(", ") : error.message;
    res.status(500).json({ msg: `Database Error: ${detailedMsg || "Unable to modify task."}` });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ msg: "Your session has expired. Please log in again." });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
    if (!task) {
      return res.status(404).json({ msg: "Task record not found or unauthorized." });
    }
    res.json({ msg: "Task permanently purged." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ msg: "Error terminating task." });
  }
};