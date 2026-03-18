const { auth } = require('../db/supabase');
const userRepository = require('../repositories/user.repository');

async function register(email, password) {
  try {
    // Create user in Firebase Auth (handles password hashing)
    const firebaseUser = await auth.createUser({
      email,
      password,
    });

    // Store user info in Firestore
    await userRepository.create(firebaseUser.uid, email);

    return { id: firebaseUser.uid, email };
  } catch (err) {
    // Firebase throws specific errors like "auth/email-already-exists"
    if (err.code === 'auth/email-already-exists') {
      throw new Error('Email already registered');
    }
    if (err.code === 'auth/invalid-password') {
      throw new Error('Password must be at least 6 characters');
    }
    throw err;
  }
}

async function login(email, password) {
  // Note: This is a backend placeholder. Real login happens on frontend using Firebase SDK.
  // The frontend sends an ID token that we verify in middleware.
  // This endpoint could be optional or used for testing.
  throw new Error('Use Firebase Auth on the frontend to login');
}

module.exports = { register, login };
