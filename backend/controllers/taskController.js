// // const Task = require("../models/Task");

// // exports.getTasks = async (req, res) => {
// //   // We specifically need the ID from the req.user object
// //   const tasks = await Task.find({ userId: req.user.id });
// //   res.json(tasks);
// // };

// // exports.createTask = async (req, res) => {
// //   const task = await Task.create({
// //     ...req.body,
// //     userId: req.user.id // Use .id here too
// //   });
// //   res.json(task);
// // };
// // exports.updateTask = async (req, res) => {
// //   const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //   res.json(task);
// // };

// // exports.deleteTask = async (req, res) => {
// //   await Task.findByIdAndDelete(req.params.id);
// //   res.json("Deleted");
// // };
// const Task = require("../models/Task");

// // Get Tasks
// exports.getTasks = async (req, res) => {
//   try {
//     // Agar auth middleware sahi hai, toh req.user ID string (ObjectId) hogi
//     const tasks = await Task.find({ userId: req.user }); 
    
//     // Yahan bhi .id lagne se koi dikkat nahi hai kyunki Mongoose cast karta hai
//     // Lekin cleanliness ke liye req.user.id use kiya hai.
    
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ msg: "Error fetching tasks" });
//   }
// };

// // Create Task
// exports.createTask = async (req, res) => {
//   console.log("User ID in Task Controller:", req.user);
//   try {
//     const task = await Task.create({
//       title: req.body.title,
//       description: req.body.description,
//       dueDate: req.body.dueDate,
//       status: req.body.status,
//       priority: req.body.priority,
//       userId: req.user.id // <--- Auth middleware se ID aa rahi hai
//     });
//     res.json(task);
//   } catch (error) {
//     console.error("Error creating task:", error);
//     res.status(500).json({ msg: "Server error creating task" });
//   }
// };


// // Update Task
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ msg: "Error updating task" });
//   }
// };

// // Delete Task
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) return res.status(404).json({ msg: "Task not found" });
//     res.json({ msg: "Task deleted" });
//   } catch (error) {
//     res.status(500).json({ msg: "Error deleting task" });
//   }
// };
 

const Task = require("../models/Task");

// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    // FIX: Use req.user._id instead of req.user
    const tasks = await Task.find({ userId: req.user._id }); 
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  // FIX: Log the ID correctly to verify
  console.log("User ID in Task Controller:", req.user._id);
  
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status,
      priority: req.body.priority,
      // FIX: Use req.user._id instead of req.user.id
      userId: req.user._id 
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ msg: "Server error creating task" });
  }
};


// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: "Error updating task" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting task" });
  }
};