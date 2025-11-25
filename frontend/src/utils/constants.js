// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Google OAuth
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

// Local Storage Keys
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE = 1;

// File upload settings
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Connection status
export const CONNECTION_STATUS = {
  PENDING: null,
  ACCEPTED: true,
  REJECTED: false
};

// Post file types
export const FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video'
};
