const express = require('express');
const router = express.Router();
const db = require('../db');

const VALID_CATEGORIES = ['Tax', 'Filing', 'Audit', 'Payroll', 'Legal'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

// GET /api/tasks
router.get('/', (req, res) => {
  const { status, category } = req.query;
  let query = 'SELECT * FROM compliance_tasks WHERE 1=1';
  const params = [];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY due_date ASC';

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

// GET /api/tasks/:id
router.get('/:id', (req, res, next) => {
  const task = db.prepare('SELECT * FROM compliance_tasks WHERE id = ?').get(req.params.id);
  if (!task) return next({ status: 404, message: 'Task not found' });
  res.json(task);
});

// POST /api/tasks
router.post('/', (req, res, next) => {
  const { client_id, title, description, category, due_date, status = 'Pending', priority = 'Medium' } = req.body;

  if (!client_id) return next({ status: 400, message: 'client_id is required' });
  if (!title?.trim()) return next({ status: 400, message: 'title is required' });
  if (!category || !VALID_CATEGORIES.includes(category))
    return next({ status: 400, message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  if (!due_date) return next({ status: 400, message: 'due_date is required' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date))
    return next({ status: 400, message: 'due_date must be in YYYY-MM-DD format' });
  if (!VALID_STATUSES.includes(status))
    return next({ status: 400, message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  if (!VALID_PRIORITIES.includes(priority))
    return next({ status: 400, message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });

  const client = db.prepare('SELECT id FROM clients WHERE id = ?').get(client_id);
  if (!client) return next({ status: 404, message: 'Client not found' });

  const result = db
    .prepare(
      `INSERT INTO compliance_tasks (client_id, title, description, category, due_date, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(client_id, title.trim(), description?.trim() || '', category, due_date, status, priority);

  const task = db.prepare('SELECT * FROM compliance_tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PATCH /api/tasks/:id
router.patch('/:id', (req, res, next) => {
  const task = db.prepare('SELECT * FROM compliance_tasks WHERE id = ?').get(req.params.id);
  if (!task) return next({ status: 404, message: 'Task not found' });

  const { title, description, category, due_date, status, priority } = req.body;

  if (category !== undefined && !VALID_CATEGORIES.includes(category))
    return next({ status: 400, message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  if (status !== undefined && !VALID_STATUSES.includes(status))
    return next({ status: 400, message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority))
    return next({ status: 400, message: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  if (due_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(due_date))
    return next({ status: 400, message: 'due_date must be in YYYY-MM-DD format' });

  const updated = {
    title: title !== undefined ? title.trim() : task.title,
    description: description !== undefined ? description.trim() : task.description,
    category: category !== undefined ? category : task.category,
    due_date: due_date !== undefined ? due_date : task.due_date,
    status: status !== undefined ? status : task.status,
    priority: priority !== undefined ? priority : task.priority,
  };

  db.prepare(
    `UPDATE compliance_tasks SET title=?, description=?, category=?, due_date=?, status=?, priority=? WHERE id=?`
  ).run(updated.title, updated.description, updated.category, updated.due_date, updated.status, updated.priority, req.params.id);

  const result = db.prepare('SELECT * FROM compliance_tasks WHERE id = ?').get(req.params.id);
  res.json(result);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res, next) => {
  const task = db.prepare('SELECT * FROM compliance_tasks WHERE id = ?').get(req.params.id);
  if (!task) return next({ status: 404, message: 'Task not found' });

  db.prepare('DELETE FROM compliance_tasks WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
