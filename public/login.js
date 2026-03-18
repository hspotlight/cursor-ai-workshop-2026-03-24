// Redirect to app if already logged in
if (getToken()) {
  window.location.href = '/index.html';
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const errorMsg = document.getElementById('error-msg');

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
}

function clearError() {
  errorMsg.textContent = '';
  errorMsg.style.display = 'none';
}

// Toggle between login and register forms
showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'flex';
  clearError();
});

showLoginBtn.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'flex';
  clearError();
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const email = loginForm.querySelector('[name="email"]').value;
  const password = loginForm.querySelector('[name="password"]').value;

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    localStorage.setItem('userEmail', data.user.email);
    window.location.href = '/index.html';
  } catch (err) {
    showError(err.message);
  }
});

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const email = registerForm.querySelector('[name="email"]').value;
  const password = registerForm.querySelector('[name="password"]').value;

  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Auto-login after registration
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    localStorage.setItem('userEmail', data.user.email);
    window.location.href = '/index.html';
  } catch (err) {
    showError(err.message);
  }
});
