// Mock Firebase for testing
global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(function() {
      return {
        doc: jest.fn(function() {
          return {
            collection: jest.fn(function() {
              return {
                add: jest.fn(),
                get: jest.fn(),
                orderBy: jest.fn(function() {
                  return this;
                }),
                doc: jest.fn(function() {
                  return {
                    update: jest.fn(),
                    delete: jest.fn(),
                    get: jest.fn(),
                  };
                }),
              };
            }),
            set: jest.fn(),
            get: jest.fn(),
          };
        }),
      };
    }),
  })),
};

// Suppress console errors in tests
global.console.error = jest.fn();
