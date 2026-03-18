const { auth } = require('../db/supabase');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    req.userId = decodedToken.uid; // Firebase user ID
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
