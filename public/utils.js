// Shared helpers for Firebase auth and API calls

// Initialize Firebase (copy your Firebase config here)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-sender-id',
  appId: 'your-app-id',
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Get current user's ID token for API calls
async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

// Remove token (logout)
function removeToken() {
  return auth.signOut();
}

// Wrapper around fetch that automatically adds the Firebase ID token
async function apiFetch(path, options = {}) {
  const token = await getToken();

  const res = await fetch('/api' + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // 204 No Content has no body to parse
  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
