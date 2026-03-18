const { db } = require('../db/supabase');

async function findAllByUser(userId) {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function create(userId, title) {
  const docRef = await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .add({
      title,
      completed: false,
      createdAt: new Date(),
    });

  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
}

async function update(id, userId, fields) {
  const docRef = db.collection('users').doc(userId).collection('todos').doc(id);

  // Check ownership — user can only update their own todos
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Todo not found');
  }

  await docRef.update(fields);
  const updated = await docRef.get();
  return { id: updated.id, ...updated.data() };
}

async function remove(id, userId) {
  const docRef = db.collection('users').doc(userId).collection('todos').doc(id);

  // Check ownership — user can only delete their own todos
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Todo not found');
  }

  await docRef.delete();
}

module.exports = { findAllByUser, create, update, remove };
