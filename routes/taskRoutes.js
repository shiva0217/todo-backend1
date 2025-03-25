const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const authMiddleware = require('../middlewares/authentincation');
const router = express.Router();

// GET all tasks for a user (Requires authentication)
router.get('/tasks/user/:userId', authMiddleware, async (req, res) => {
  // console.log("Route hit: /tasks/user/:userId", req.params.userId);
  try {
    const { userId } = req.params;
    // console.log("Fetching tasks for user ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const tasks = await Task.find({ userId: userId.toString() });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new task (Requires authentication)
router.post('/tasks', authMiddleware, async (req, res) => {
  // console.log("Received Body:", req.body);
  try {
    const { text, userId } = req.body;


    if (!userId || !text) {
      return res.status(400).json({ error: "User ID and task text are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const newTask = new Task({
      text,
      completed: false,
      userId: userId.toString() // Ensures userId is treated as a string
    });

    await newTask.save();
    res.status(201).json(newTask);
    
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update task (toggle completion status or edit text)
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (text) task.text = text;
    if (typeof completed === 'boolean') task.completed = completed;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE task (Requires authentication)
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
