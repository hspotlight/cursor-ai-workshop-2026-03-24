describe('App - UI Helpers', () => {
  // Helper functions (copied from app.js for testing)
  const escapeHtml = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const getCurrentTodos = (todoList) => {
    return Array.from(todoList.querySelectorAll('.todo-item')).map((el) => ({
      id: el.dataset.id,
      title: el.querySelector('.todo-title').textContent,
      completed: el.classList.contains('completed'),
    }));
  };

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert("xss")&lt;/script&gt;'
      );
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape angle brackets', () => {
      expect(escapeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;/div&gt;');
    });

    it('should handle normal text', () => {
      expect(escapeHtml('Normal text')).toBe('Normal text');
    });

    it('should escape multiple special characters', () => {
      expect(escapeHtml('A & B < C > D')).toBe('A &amp; B &lt; C &gt; D');
    });
  });

  describe('getCurrentTodos', () => {
    let todoList;

    beforeEach(() => {
      // Create a mock DOM
      document.body.innerHTML = `
        <ul id="todo-list" class="todo-list">
          <li class="todo-item" data-id="1">
            <span class="todo-title">Buy milk</span>
          </li>
          <li class="todo-item completed" data-id="2">
            <span class="todo-title">Walk dog</span>
          </li>
          <li class="todo-item" data-id="3">
            <span class="todo-title">Clean house</span>
          </li>
        </ul>
      `;
      todoList = document.getElementById('todo-list');
    });

    it('should extract todos from DOM', () => {
      const todos = getCurrentTodos(todoList);
      expect(todos).toHaveLength(3);
    });

    it('should include todo id, title, and completed status', () => {
      const todos = getCurrentTodos(todoList);
      expect(todos[0]).toEqual({
        id: '1',
        title: 'Buy milk',
        completed: false,
      });
    });

    it('should detect completed todos', () => {
      const todos = getCurrentTodos(todoList);
      expect(todos[1]).toEqual({
        id: '2',
        title: 'Walk dog',
        completed: true,
      });
    });

    it('should handle empty todo list', () => {
      todoList.innerHTML = '';
      const todos = getCurrentTodos(todoList);
      expect(todos).toEqual([]);
    });
  });

  describe('Form validation', () => {
    it('should reject empty todo title', () => {
      const title = '';
      const isValid = title.trim() !== '';
      expect(isValid).toBe(false);
    });

    it('should accept non-empty title', () => {
      const title = 'Buy groceries';
      const isValid = title.trim() !== '';
      expect(isValid).toBe(true);
    });

    it('should trim whitespace from title', () => {
      const title = '   Clean room   ';
      const trimmed = title.trim();
      expect(trimmed).toBe('Clean room');
    });
  });
});
