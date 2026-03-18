const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create user in Firebase Auth and store in Firestore
    const user = await authService.register(email, password);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  // Login is handled entirely by Firebase SDK on the frontend.
  // The frontend sends the ID token in the Authorization header.
  // This endpoint is kept for API compatibility but is not used.
  res.status(400).json({ error: 'Use Firebase Auth on the frontend to login' });
}

module.exports = { register, login };
