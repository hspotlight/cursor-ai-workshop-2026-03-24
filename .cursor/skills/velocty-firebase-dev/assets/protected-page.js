// Stub: align with public/app.js — wait for auth, redirect if logged out, then mount UI.

function setupPage() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    // TODO: mount page UI for user.uid
  });
}

if (typeof auth !== 'undefined' && auth) {
  setupPage();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = setInterval(() => {
      if (typeof auth !== 'undefined' && auth) {
        clearInterval(checkAuth);
        setupPage();
      }
    }, 100);
  });
}
