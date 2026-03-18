const todoRepository = require('../repositories/todo.repository');

async function getAll(userId) {
  return todoRepository.findAllByUser(userId);
}

async function create(userId, title) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  return todoRepository.create(userId, title.trim());
}

async function update(id, userId, fields) {
  const allowed = {};

  if (fields.title !== undefined) {
    if (fields.title.trim() === '') throw new Error('Title cannot be empty');
    allowed.title = fields.title.trim();
  }

  if (fields.completed !== undefined) {
    allowed.completed = Boolean(fields.completed);
  }

  return todoRepository.update(id, userId, allowed);
}

async function remove(id, userId) {
  return todoRepository.remove(id, userId);
}

module.exports = { getAll, create, update, remove };
