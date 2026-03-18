require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authController = require('../src/controllers/auth.controller');
const todoController = require('../src/controllers/todo.controller');
const authMiddleware = require('../src/middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files (used locally — Vercel serves public/ from its CDN)
app.use(express.static(path.join(__dirname, '../public')));

// Auth routes — no login required
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Todo routes — login required
app.get('/api/todos', authMiddleware, todoController.getAll);
app.post('/api/todos', authMiddleware, todoController.create);
app.patch('/api/todos/:id', authMiddleware, todoController.update);
app.delete('/api/todos/:id', authMiddleware, todoController.remove);

// Start server for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Velocty running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
