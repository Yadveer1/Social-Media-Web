/**
 * Form Validation Utilities
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  
  return { valid: true };
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (username.length < 3) {
    return {
      valid: false,
      message: 'Username must be at least 3 characters long'
    };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: 'Username can only contain letters, numbers, and underscores'
    };
  }
  
  return { valid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.trim() === '') {
    return {
      valid: false,
      message: `${fieldName} is required`
    };
  }
  
  return { valid: true };
};
