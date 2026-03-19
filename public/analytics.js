// Firebase Analytics - Centralized Event Tracking
let analytics;

// Initialize Analytics (called after Firebase SDK loads)
function initializeAnalytics() {
  try {
    analytics = firebase.analytics();

    // Set app version as user property for all events
    analytics.setUserProperties({
      app_version: APP_VERSION,
      app_build: APP_BUILD,
    });

    console.log('✅ Firebase Analytics initialized');
    console.log(`📦 App Version: ${APP_VERSION} (${APP_BUILD})`);

    // Track page view
    logPageView();
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Analytics:', err);
  }
}

// Wait for Firebase to be initialized
if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
  initializeAnalytics();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const checkAnalytics = setInterval(() => {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
        clearInterval(checkAnalytics);
        initializeAnalytics();
      }
    }, 100);
  });
}

// ===== Event Tracking Functions =====

// Page View Event
function logPageView() {
  if (!analytics) return;

  const page = window.location.pathname;
  analytics.logEvent('page_view', {
    page_title: document.title,
    page_path: page,
    timestamp: new Date().toISOString(),
  });

  console.log('📄 Page view:', page);
}

// Authentication Events
function logRegister(email) {
  if (!analytics) return;

  analytics.logEvent('sign_up', {
    method: 'email',
    email: email,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Sign up event:', email);
}

function logLogin(email) {
  if (!analytics) return;

  analytics.logEvent('login', {
    method: 'email',
    email: email,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Login event:', email);
}

function logLogout() {
  if (!analytics) return;

  analytics.logEvent('logout', {
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Logout event');
}

// Todo Events
function logAddTodo(title) {
  if (!analytics) return;

  analytics.logEvent('add_todo', {
    title_length: title.length,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Add todo event:', title);
}

function logCompleteTodo(title) {
  if (!analytics) return;

  analytics.logEvent('complete_todo', {
    title: title,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Complete todo event:', title);
}

function logUncompleteTodo(title) {
  if (!analytics) return;

  analytics.logEvent('uncomplete_todo', {
    title: title,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Uncomplete todo event:', title);
}

function logDeleteTodo(title) {
  if (!analytics) return;

  analytics.logEvent('delete_todo', {
    title: title,
    timestamp: new Date().toISOString(),
  });

  console.log('✓ Delete todo event:', title);
}

// UI Interaction Events
function logButtonClick(buttonName) {
  if (!analytics) return;

  analytics.logEvent('button_click', {
    button_name: buttonName,
    timestamp: new Date().toISOString(),
  });

  console.log('🔘 Button click:', buttonName);
}

function logFormToggle(formType) {
  if (!analytics) return;

  analytics.logEvent('form_toggle', {
    form_type: formType, // 'login' or 'register'
    timestamp: new Date().toISOString(),
  });

  console.log('📋 Form toggle:', formType);
}

// Error Events
function logError(errorCode, errorMessage) {
  if (!analytics) return;

  analytics.logEvent('error', {
    error_code: errorCode,
    error_message: errorMessage,
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  console.error('❌ Error event:', errorCode, errorMessage);
}

// Session Duration (tracks how long user is on the app)
let sessionStartTime = Date.now();

function logSessionEnd() {
  if (!analytics) return;

  const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000); // in seconds

  analytics.logEvent('session_end', {
    session_duration: sessionDuration,
    timestamp: new Date().toISOString(),
  });

  console.log('⏱️ Session ended. Duration:', sessionDuration, 'seconds');
}

// Track session end on page unload
window.addEventListener('beforeunload', logSessionEnd);
