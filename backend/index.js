const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, 'shopping.db');
const db = new Database(DB_FILE);

// create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity TEXT,
    category TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

const app = express();
app.use(cors());
app.use(express.json());

// helpers
const rowToItem = (r) => r && ({
  id: r.id,
  name: r.name,
  quantity: r.quantity,
  category: r.category,
  completed: !!r.completed,
  created_at: r.created_at
});

// GET /api/items
app.get('/api/items', (req, res) => {
  const rows = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
  res.json(rows.map(rowToItem));
});

// POST /api/items
app.post('/api/items', (req, res) => {
  const { name, quantity, category } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });

  const id = uuidv4();
  db.prepare('INSERT INTO items (id, name, quantity, category) VALUES (?, ?, ?, ?)')
    .run(id, name.trim(), quantity || '', category || '');
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  res.status(201).json(rowToItem(item));
});

// PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, completed } = req.body;
  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE items
    SET name = COALESCE(?, name),
        quantity = COALESCE(?, quantity),
        category = COALESCE(?, category),
        completed = COALESCE(?, completed)
    WHERE id = ?
  `).run(name, quantity, category, completed ? 1 : 0, id);

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  res.json(rowToItem(item));
});

// DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// toggle complete endpoint (optional)
app.post('/api/items/:id/toggle', (req, res) => {
  const { id } = req.params;
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const newVal = item.completed ? 0 : 1;
  db.prepare('UPDATE items SET completed = ? WHERE id = ?').run(newVal, id);
  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  res.json(rowToItem(updated));
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
