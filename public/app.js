// Redirect to login if not authenticated
if (!getToken()) {
  window.location.href = '/login.html';
}

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const userEmailEl = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const errorMsg = document.getElementById('error-msg');

// Show logged-in user's email
userEmailEl.textContent = localStorage.getItem('userEmail') || '';

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
  setTimeout(() => (errorMsg.style.display = 'none'), 3000);
}

// Logout
logoutBtn.addEventListener('click', () => {
  removeToken();
  window.location.href = '/login.html';
});

// Load all todos from the server
async function loadTodos() {
  try {
    const data = await apiFetch('/todos');
    renderTodos(data.todos);
  } catch (err) {
    showError(err.message);
  }
}

// Render the todo list to the DOM
function renderTodos(todos) {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<p class="empty">No todos yet. Add one above!</p>';
    return;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');
    item.dataset.id = todo.id;

    item.innerHTML = `
      <input type="checkbox" class="todo-check" ${todo.completed ? 'checked' : ''} />
      <span class="todo-title">${escapeHtml(todo.title)}</span>
      <button class="delete-btn" title="Delete">✕</button>
    `;

    // Toggle completed
    item.querySelector('.todo-check').addEventListener('change', () => {
      toggleTodo(todo.id, !todo.completed);
    });

    // Delete
    item.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    todoList.appendChild(item);
  });
}

// Add a new todo
async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;

  try {
    const data = await apiFetch('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });

    todoInput.value = '';
    // Prepend new todo to the list without reloading
    renderTodos([data.todo, ...getCurrentTodos()]);
  } catch (err) {
    showError(err.message);
  }
}

// Toggle a todo's completed state
async function toggleTodo(id, completed) {
  try {
    await apiFetch(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
    loadTodos();
  } catch (err) {
    showError(err.message);
    loadTodos(); // revert UI on failure
  }
}

// Delete a todo
async function deleteTodo(id) {
  try {
    await apiFetch(`/todos/${id}`, { method: 'DELETE' });
    document.querySelector(`[data-id="${id}"]`).remove();
  } catch (err) {
    showError(err.message);
  }
}

// Helpers
function getCurrentTodos() {
  return Array.from(todoList.querySelectorAll('.todo-item')).map((el) => ({
    id: el.dataset.id,
    title: el.querySelector('.todo-title').textContent,
    completed: el.classList.contains('completed'),
  }));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Events
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Initial load
loadTodos();
