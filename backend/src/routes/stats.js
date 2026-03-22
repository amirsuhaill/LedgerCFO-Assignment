const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const clientsCount = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
  
  const taskStats = db.prepare(`
    SELECT 
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
    FROM compliance_tasks
  `).get();

  res.json({
    total_clients: clientsCount,
    tasks: {
      total: taskStats.total_tasks || 0,
      pending: taskStats.pending_tasks || 0,
      in_progress: taskStats.in_progress_tasks || 0,
      completed: taskStats.completed_tasks || 0
    }
  });
});

module.exports = router;
