// Firebase initialization is deferred until after SDK loads
let auth;
let db;

// Initialize Firebase (called after SDK is ready)
function initializeFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyC3MaMRJw1H1znHqm48U8di1_HT-pq2DuI',
    authDomain: 'velocty-ab097.firebaseapp.com',
    projectId: 'velocty-ab097',
    storageBucket: 'velocty-ab097.firebasestorage.app',
    messagingSenderId: '255881210755',
    appId: '1:255881210755:web:cbf8815b1ddc61aa7c24b6',
  };

  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore(firebase.app(), 'velocty'); // Use 'velocty' database, not (default)
}

// Wait for Firebase SDK to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

// ===== Auth Helpers =====
function logout() {
  return auth.signOut();
}

// ===== Firestore Todo Helpers =====
async function getTodos(userId) {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addTodo(userId, title) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  const docRef = await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .add({
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    });

  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
}

async function updateTodo(userId, todoId, updates) {
  await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .doc(todoId)
    .update(updates);

  const doc = await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .doc(todoId)
    .get();

  return { id: doc.id, ...doc.data() };
}

async function deleteTodo(userId, todoId) {
  await db
    .collection('users')
    .doc(userId)
    .collection('todos')
    .doc(todoId)
    .delete();
}
