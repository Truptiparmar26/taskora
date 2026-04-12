// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   title: String,
//   desc: String,
//   date: { type: Date }, 
//   status: { type: String, default: "pending" },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// });

// module.exports = mongoose.model("Task", taskSchema);



const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // CHANGED from 'user'
  title: { type: String, required: true },
  desc: { type: String },
   date: { type: Date }, 
  status: { type: String, enum: ["pending", "progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);