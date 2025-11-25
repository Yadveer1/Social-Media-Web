/**
 * API Response Handler Utilities
 * Handles different response formats from backend endpoints
 */

/**
 * Handle API success responses
 * Backend uses both 'success' and 'status' fields
 */
export const handleApiResponse = (response) => {
  // Check for success status (200-299)
  if (response.status >= 200 && response.status < 300) {
    // Backend uses different success flags
    if (response.data.success !== undefined) {
      return {
        success: response.data.success,
        data: response.data.data || response.data,
        message: response.data.message
      };
    }
    
    if (response.data.status !== undefined) {
      return {
        success: response.data.status,
        data: response.data.data || response.data,
        message: response.data.message
      };
    }
    
    // For login endpoint (returns only token)
    if (response.data.token) {
      return {
        success: true,
        data: response.data
      };
    }
  }
  
  return {
    success: false,
    message: response.data.message || 'An error occurred'
  };
};

/**
 * Handle API error responses
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      success: false,
      message: error.response.data.message || 'Server error',
      statusCode: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    };
  } else {
    // Error in request setup
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Get user initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Get profile picture URL
 * Handles both local uploads and external URLs (e.g., Google profile pictures)
 */
export const getProfilePictureUrl = (profilePicture, baseUrl = 'http://localhost:5000') => {
  if (!profilePicture) return undefined;
  
  // If it's already a full URL (starts with http:// or https://), return as-is
  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    return profilePicture;
  }
  
  // Otherwise, it's a local file, prepend the base URL
  return `${baseUrl}/${profilePicture}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate file type and size
 */
export const validateFile = (file, allowedTypes, maxSize) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Invalid file type. Please select a supported file.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size must be less than ${Math.floor(maxSize / 1024 / 1024)}MB`
    };
  }
  
  return { valid: true };
};
