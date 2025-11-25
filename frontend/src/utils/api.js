import {API_BASE_URL} from './constants.js';

/**
 * Get authorization headers with token
 * @param {string} token - JWT token
 * @returns {Object} - Headers object
 */
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/user/profile')
 * @param {Object} options - Fetch options
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Response data
 */
export const apiRequest = async (endpoint, options = {}, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

/**
 * Google OAuth login
 * @param {string} credential - Google credential token
 * @returns {Promise<Object>} - User data and JWT token
 */
export const googleLogin = async (credential) => {
  return apiRequest('/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });
};

/**
 * Traditional email/password login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - JWT token
 */
export const emailLogin = async (email, password) => {
  return apiRequest('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Success response
 */
export const register = async (userData) => {
  return apiRequest('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

/**
 * Get user profile data
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (token) => {
  return apiRequest('/get_user_and_profile', {
    method: 'GET',
  }, token);
};
