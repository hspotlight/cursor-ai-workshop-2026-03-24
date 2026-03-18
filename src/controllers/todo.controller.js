const todoService = require('../services/todo.service');

async function getAll(req, res) {
  try {
    const todos = await todoService.getAll(req.userId);
    res.json({ todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { title } = req.body;
    const todo = await todoService.create(req.userId, title);
    res.status(201).json({ todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const todo = await todoService.update(req.params.id, req.userId, req.body);
    res.json({ todo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await todoService.remove(req.params.id, req.userId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getAll, create, update, remove };
