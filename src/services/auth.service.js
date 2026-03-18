const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

async function register(email, password) {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new Error('Email already registered');

  // Never store plain text passwords — hash with bcrypt
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create(email, passwordHash);

  return { id: user.id, email: user.email };
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  // Sign a JWT — the frontend will send this on every request
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, user: { id: user.id, email: user.email } };
}

module.exports = { register, login };
