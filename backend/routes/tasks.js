
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get all tasks for a user
router.get('/', auth, async (req, res, next) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC',
      [req.user.userId]
    );
    
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, due_date, priority, category, estimated_time } = req.body;

    // Convert ISO string to MySQL DATETIME format
    const formattedDueDate = due_date
    ? new Date(due_date).toISOString().slice(0, 19).replace('T', ' ')
    : null;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, due_date, priority, category, estimated_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, title, description || null, formattedDueDate, priority || 'medium', category || 'general', estimated_time || null, 'pending']
    );
    
    if (result.affectedRows > 0) {
      const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
      res.status(201).json({ task: newTask[0] });
    } else {
      res.status(500).json({ message: 'Failed to create task' });
    }
  } catch (error) {
    next(error);
  }
});

// Update a task
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { title, description, due_date, priority, category, estimated_time, status } = req.body;
    const taskId = req.params.id;

    // Convert due_date to proper format
    const formattedDueDate = due_date ? new Date(due_date).toISOString().slice(0, 19).replace('T', ' ') : null;
    
    // Check if the task belongs to the user
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, category = ?, estimated_time = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, formattedDueDate, priority, category, estimated_time, status, taskId]
    );
    
    if (result.affectedRows > 0) {
      const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      res.json({ task: updatedTask[0] });
    } else {
      res.status(500).json({ message: 'Failed to update task' });
    }
  } catch (error) {
    next(error);
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    
    // Check if the task belongs to the user
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  } catch (error) {
    next(error);
  }
});

// Get task categories for a user
router.get('/categories', auth, async (req, res, next) => {
  try {
    const [categories] = await db.query(
      'SELECT DISTINCT category FROM tasks WHERE user_id = ?',
      [req.user.userId]
    );
    
    res.json({ categories: categories.map(cat => cat.category) });
  } catch (error) {
    next(error);
  }
});

// Complete a task
router.patch('/:id/complete', auth, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    
    // Check if the task belongs to the user
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, req.user.userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    
    const [result] = await db.query(
      'UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', taskId]
    );
    
    if (result.affectedRows > 0) {
      // Award points for completing the task
      const points = tasks[0].priority === 'high' ? 20 : (tasks[0].priority === 'medium' ? 10 : 5);
      
      // Update user's points
      await db.query(
        'UPDATE users SET total_points = total_points + ? WHERE id = ?',
        [points, req.user.userId]
      );
      
      const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      res.json({ 
        task: updatedTask[0],
        pointsAwarded: points,
        message: `Task completed! You earned ${points} points.`
      });
    } else {
      res.status(500).json({ message: 'Failed to complete task' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
