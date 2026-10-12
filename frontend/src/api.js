/**
 * SWASIRA API Client
 * - Uses strictly relative paths like /api/... (relies on Vite proxy to http://localhost:5000)
 * - Safely handles non-JSON, empty, or HTML responses gracefully
 * - Never shows raw "Unexpected end of JSON input" errors
 */

function getAuthToken() {
  return localStorage.getItem('swasira_token') || '';
}

async function request(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { error: 'Received an unparseable response from the server.' };
      }
    } else {
      const text = await response.text();
      data = {
        error: text && text.length < 200 ? text : `Server returned status ${response.status} (${response.statusText})`
      };
    }

    if (!response.ok) {
      const errorMessage = (data && data.error) ? data.error : `Request failed with status ${response.status}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data || {};
  } catch (networkOrParsedError) {
    if (networkOrParsedError.status) {
      throw networkOrParsedError;
    }
    // Network drops, server offline, or connection refused
    const friendlyError = new Error(
      networkOrParsedError.message && !networkOrParsedError.message.includes('JSON')
        ? networkOrParsedError.message
        : 'Unable to connect to SWASIRA server. Please verify backend is running on port 5000.'
    );
    friendlyError.status = 0;
    throw friendlyError;
  }
}

export const api = {
  // Generic methods
  get: (url, options) => request(url, { method: 'GET', ...options }),
  post: (url, body, options) => request(url, { method: 'POST', body: JSON.stringify(body), ...options }),

  // Health
  checkHealth: () => request('/api/health'),

  // Auth
  signup: (userData) => request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getMe: () => request('/api/auth/me'),

  // Onboarding
  saveOnboarding: (data) => request('/api/onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Diet Plan
  getDietPlan: (userId) => request(`/api/diet-plan/${userId}`),
  swapMeal: (userId, mealSlot, currentDishId) => request(`/api/diet-plan/${userId}/swap`, {
    method: 'POST',
    body: JSON.stringify({ mealSlot, currentDishId }),
  }),
  markMealDone: (userId, mealSlot) => request(`/api/diet-plan/${userId}/action`, {
    method: 'POST',
    body: JSON.stringify({ mealSlot, action: 'done' }),
  }),

  // Streak
  getStreak: (userId) => request(`/api/streak/${userId}`),

  // Chatbot / Conversational Intake
  initChat: (payload) => request('/api/chat/init', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  sendChatMessage: (payload) => request('/api/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

export default api;
