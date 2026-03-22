const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients ORDER BY company_name').all();
  res.json(clients);
});

router.get('/:id', (req, res, next) => {
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return next({ status: 404, message: 'Client not found' });
  res.json(client);
});

router.post('/', (req, res, next) => {
  const { company_name, country, entity_type } = req.body;
  if (!company_name?.trim() || !country?.trim() || !entity_type?.trim()) {
    return next({ status: 400, message: 'All fields are required' });
  }

  const result = db
    .prepare('INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)')
    .run(company_name.trim(), country.trim(), entity_type.trim());

  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(client);
});

router.get('/:id/tasks', (req, res, next) => {
  const { status, category } = req.query;
  let query = 'SELECT * FROM compliance_tasks WHERE client_id = ?';
  const params = [req.params.id];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY due_date ASC';

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

module.exports = router;
