const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  desc: { type: String, default: "" },
  date: { type: mongoose.Schema.Types.Mixed, default: "" }, 
  dueDate: { type: mongoose.Schema.Types.Mixed, default: "" },
  status: { type: String, default: "pending" },
  priority: { type: String, default: "Medium" },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model("Task", taskSchema);