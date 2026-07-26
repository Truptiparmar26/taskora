const Note = require("../models/Note");

// Get Notes
exports.getNotes = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user
    const notes = await Note.find({ userId: req.user._id });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ msg: "Error fetching notes" });
  }
};

// Create Note
exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      // FIX: Use req.user._id instead of req.user.id
      userId: req.user._id
    });
    res.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ msg: "Error creating note" });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json({ msg: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ msg: "Error deleting note" });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, color, tags, isPinned } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color, tags, isPinned },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ msg: "Note not found" });
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ msg: "Server error updating note" });
  }
};