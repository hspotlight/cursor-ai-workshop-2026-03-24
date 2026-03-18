// Wait for Firebase to be initialized
function setupApp() {
  // Check if user is authenticated
  let currentUser = null;

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = '/login.html';
    } else {
      currentUser = user;
      userEmailEl.textContent = user.email;
      loadTodos();
    }
  });

  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const todoList = document.getElementById('todo-list');
  const userEmailEl = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');
  const errorMsg = document.getElementById('error-msg');

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    setTimeout(() => (errorMsg.style.display = 'none'), 3000);
  }

  // Logout
  logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = '/login.html';
  });

  // Load all todos from Firestore
  async function loadTodos() {
    try {
      console.log('Loading todos for user:', currentUser.uid);
      const todos = await getTodos(currentUser.uid);
      console.log('✓ Loaded', todos.length, 'todos');
      renderTodos(todos);
    } catch (err) {
      console.error('❌ Error loading todos:', err.code, err.message);
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
        deleteTodoItem(todo.id);
      });

      todoList.appendChild(item);
    });
  }

  // Add a new todo
  async function addTodoItem() {
    const title = todoInput.value.trim();
    if (!title) return;

    try {
      console.log('Adding todo:', title, 'for user:', currentUser.uid);
      const todo = await addTodo(currentUser.uid, title);
      console.log('✓ Todo added with ID:', todo.id);
      todoInput.value = '';
      // Prepend new todo to the list
      renderTodos([todo, ...getCurrentTodos()]);
    } catch (err) {
      console.error('❌ Error adding todo:', err.code, err.message);
      console.error('Full error:', err);
      showError(err.message);
    }
  }

  // Toggle a todo's completed state
  async function toggleTodo(id, completed) {
    try {
      await updateTodo(currentUser.uid, id, { completed });
      loadTodos();
    } catch (err) {
      console.error('❌ Error updating todo:', err.code, err.message);
      showError(err.message);
      loadTodos(); // revert UI on failure
    }
  }

  // Delete a todo
  async function deleteTodoItem(id) {
    try {
      await deleteTodo(currentUser.uid, id);
      document.querySelector(`[data-id="${id}"]`).remove();
    } catch (err) {
      console.error('❌ Error deleting todo:', err.code, err.message);
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
  addBtn.addEventListener('click', addTodoItem);
  todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodoItem();
  });
}

// Wait for Firebase to initialize
if (typeof auth !== 'undefined' && auth) {
  setupApp();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = setInterval(() => {
      if (typeof auth !== 'undefined' && auth) {
        clearInterval(checkAuth);
        setupApp();
      }
    }, 100);
  });
}
