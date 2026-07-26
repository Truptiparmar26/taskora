
// const router = require("express").Router();
// const auth = require("../middleware/auth");
// const {
//   getNotes,
//   createNote,
//   deleteNote
// } = require("../controllers/noteController");

// router.get("/", auth, getNotes);
// router.post("/", auth, createNote);
// router.delete("/:id", auth, deleteNote);


// // routes/notes.js mein add karein
// router.put("/:id", auth, async (req, res) => {
//   const { title, content, color, tags, isPinned } = req.body;
//   // Update logic here...
//   const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content, color, tags, isPinned }, { new: true });
//   res.json(updatedNote);
// });

// module.exports = router;


const router = require('express').Router();
const { createNote, getNotes, deleteNote, updateNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth'); // <--- IMPORT IT

// ADD 'protect' as the second argument
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote); // <--- USE IT HERE

router.route('/:id')
  .delete(protect, deleteNote)
  .put(protect, updateNote);

module.exports = router;