// Wait for Firebase to be initialized
function setupAuth() {
  // Redirect to app if already logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.location.href = '/index.html';
    }
  });

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
      console.log('Signing in:', email);

      // Sign in with Firebase Auth
      const userCred = await auth.signInWithEmailAndPassword(email, password);
      console.log('✓ User signed in with UID:', userCred.user.uid);
      // Firebase handles redirect via onAuthStateChanged
    } catch (err) {
      console.error('❌ Login error:', err.code, err.message);
      console.error('Full error:', err);
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
      console.log('Starting registration for:', email);

      // Create user with Firebase Auth
      const userCred = await auth.createUserWithEmailAndPassword(email, password);
      console.log('✓ User created with UID:', userCred.user.uid);

      // Create user document in Firestore
      console.log('Writing user doc to Firestore...');
      await db.collection('users').doc(userCred.user.uid).set({
        email,
        createdAt: new Date(),
      });
      console.log('✓ User document written to Firestore');

      // Firebase handles redirect via onAuthStateChanged
    } catch (err) {
      console.error('❌ Registration error:', err.code, err.message);
      console.error('Full error:', err);
      showError(err.message);
    }
  });
}

// Wait for Firebase to initialize
if (typeof auth !== 'undefined' && auth) {
  setupAuth();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = setInterval(() => {
      if (typeof auth !== 'undefined' && auth) {
        clearInterval(checkAuth);
        setupAuth();
      }
    }, 100);
  });
}
