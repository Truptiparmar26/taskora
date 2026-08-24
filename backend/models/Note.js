// const mongoose = require("mongoose");

// const noteSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// });

// module.exports = mongoose.model("Note", noteSchema);

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // CHANGED from 'user'
  title: { type: String, default: "Untitled" },
  content: { type: String, required: true },
  category: { type: String, default: "Work" },
  tagColor: { type: String, default: "#6366f1" },
  tags: [{ type: String }],
  color: { type: String, default: "#ffffff" },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);