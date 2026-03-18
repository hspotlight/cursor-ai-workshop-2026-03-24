const { db } = require('../db/supabase');

async function findByEmail(email) {
  const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function create(userId, email) {
  await db.collection('users').doc(userId).set({
    email,
    createdAt: new Date(),
  });

  return { id: userId, email };
}

async function getById(userId) {
  const doc = await db.collection('users').doc(userId).get();

  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

module.exports = { findByEmail, create, getById };
