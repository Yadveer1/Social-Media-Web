# LinkedIn Clone - Frontend Development Guide

## Project Overview
You are tasked with building a comprehensive frontend for a LinkedIn-like social media application using **Next.js 14+**, **Redux Toolkit** for state management, and  **Tailwind CSS** for styling.

## Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Redux Toolkit
- **UI Components**:Tailwind CSS (only tailwind)
- **HTTP Client**: Axios or Fetch API
- **Form Handling**: React Hook Form + Zod validation
- **Language**: JavaScript/JSX

## Code Structure Requirements

### Directory Structure
```
src/
├── app/
│   ├── layout.js
│   ├── page.jsx (Home/Feed page)
│   ├── login/
│   │   └── page.jsx
│   ├── register/
│   │   └── page.jsx
│   ├── profile/
│   │   ├── page.jsx (My Profile)
│   │   └── [id]/
│   │       └── page.jsx (Other User Profile)
│   ├── connections/
│   │   └── page.jsx
│   ├── network/
│   │   └── page.jsx (Browse all users)
│   └── providers.js
├── components/
│   ├── auth/
│   │   ├── login-form.jsx
│   │   ├── register-form.jsx
│   │   └── protected-route.jsx
│   ├── posts/
│   │   ├── post-card.jsx
│   │   ├── post-feed.jsx
│   │   ├── create-post-form.jsx
│   │   ├── comment-section.jsx
│   │   └── comment-item.jsx
│   ├── profile/
│   │   ├── profile-header.jsx
│   │   ├── profile-editor.jsx
│   │   ├── work-experience-section.jsx
│   │   └── education-section.jsx
│   ├── network/
│   │   ├── user-card.jsx
│   │   ├── connection-request-card.jsx
│   │   └── search-users.jsx
│   ├── layout/
│   │   ├── navbar.jsx
│   │   ├── sidebar.jsx
│   │   └── footer.jsx
│   └── ui/
├── lib/
│   ├── api/
│   │   ├── axios-instance.js
│   │   ├── auth.api.js
│   │   ├── posts.api.js
│   │   ├── profile.api.js
│   │   └── connections.api.js
│   ├── utils.js
│   └── validators.js (Zod schemas)
├── config/
│   └── redux/
│       ├── store.js
│       ├── slices/
│       │   ├── authSlice.js
│       │   ├── postsSlice.js
│       │   ├── profileSlice.js
│       │   └── connectionsSlice.js
│       └── middleware/
│           └── apiMiddleware.js
└── hooks/
    ├── useAuth.js
    ├── usePosts.js
    └── useConnections.js
```

---

## Authentication System

### Token Management
- **Storage**: Store authentication token in `localStorage` with key `authToken`
- **Header Format**: `Authorization: Bearer <token>`
- **Protected Routes**: All endpoints marked as "Protected" require this header

### Login Flow
1. User submits email + password
2. Receive token from `/login`
3. Store token in localStorage
4. Set token in Redux state
5. Redirect to home/feed page

---

## API Documentation

**Base URL**: `http://localhost:5000` (configurable via environment variable)

### Response Structure
All API responses follow this pattern:
```javascript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": {...} // Optional, depends on endpoint
}

// Error Response
{
  "success": false,
  "message": "Error description"
}
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**Endpoint**: `POST /register`  
**Authentication**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Responses**:
```json
// Missing fields (400)
{
  "success": false,
  "message": "All fields are required"
}

// Email already exists (409)
{
  "success": false,
  "message": "Email already exists"
}

// Server error (500)
{
  "success": false,
  "message": "Internal server error"
}
```

**Validation Requirements**:
- All fields are required
- Email must be valid format
- Password minimum 6 characters
- Username must be unique

---

### 1.2 Login
**Endpoint**: `POST /login`  
**Authentication**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Error Responses**:
```json
// Missing credentials (400)
{
  "success": false,
  "message": "Email and password are required"
}

// Invalid credentials (401)
{
  "success": false,
  "message": "Invalid email or password"
}

// User not found (404)
{
  "success": false,
  "message": "User not found"
}
```

**Post-Login Actions**:
1. Store token in localStorage
2. Update Redux auth state
3. Fetch user profile immediately
4. Redirect to home page

---

## 2. User Profile Endpoints

### 2.1 Get User Profile
**Endpoint**: `GET /get_user_and_profile`  
**Authentication**: Protected (Bearer Token Required)  
**Content-Type**: `application/json`

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "profile_id_123",
    "userId": {
      "_id": "user_id_456",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "profilePicture": "profile_pic.jpg"
    },
    "bio": "Software Engineer passionate about building great products",
    "currentPosition": "Senior Developer at Tech Corp",
    "pastWork": [
      {
        "company": "Previous Company",
        "position": "Junior Developer",
        "years": "2018-2020"
      }
    ],
    "education": [
      {
        "school": "University of Technology",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-11-20T14:25:00.000Z"
  }
}
```

**Error Responses**:
```json
// Unauthorized (401)
{
  "success": false,
  "message": "Authorization token required"
}

// User not found (404)
{
  "success": false,
  "message": "User not found"
}
```

---

### 2.2 Update User Data
**Endpoint**: `POST /user_update`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "John Updated Doe",
  "username": "johndoe_updated",
  "email": "newemail@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

**Error Responses**:
```json
// Username/Email already taken (409)
{
  "success": false,
  "message": "Username or email already taken"
}
```

---

### 2.3 Update Profile Data
**Endpoint**: `POST /update_profile_data`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "bio": "Updated bio text",
  "currentPosition": "Lead Developer at New Corp",
  "pastWork": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "years": "2020-2024"
    },
    {
      "company": "Startup Inc",
      "position": "Full Stack Developer",
      "years": "2018-2020"
    }
  ],
  "education": [
    {
      "school": "MIT",
      "degree": "Master of Science",
      "fieldOfStudy": "Computer Science"
    }
  ]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

**Error Responses**:
```json
// Profile not found (404)
{
  "success": false,
  "message": "Profile not found"
}
```

---

### 2.4 Upload Profile Picture
**Endpoint**: `POST /upload_profile_picture`  
**Authentication**: Protected  
**Content-Type**: `multipart/form-data`

**Request Body** (FormData):
```javascript
const formData = new FormData();
formData.append('profile_picture', fileObject);
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully"
}
```

**Implementation Notes**:
- Use `<input type="file" accept="image/*" />`
- Preview image before upload
- Maximum file size: 5MB (implement client-side validation)
- Accepted formats: JPG, PNG, WEBP

---

### 2.5 Get All Users
**Endpoint**: `GET /user/get_all_users`  
**Authentication**: Public  
**Query Parameters**:
- `page` (number, default: 1)
- `pageSize` (number, default: 50)
- `keyword` (string, optional) - Search by name, username, position, bio

**Example Request**:
```
GET /user/get_all_users?page=1&pageSize=20&keyword=developer
```

**Success Response** (200):
```json
{
  "success": true,
  "profiles": {
    "metadata": {
      "totalCount": 150,
      "page": 1,
      "pageSize": 20,
      "lastPage": 8,
      "keyword": "developer"
    },
    "data": [
      {
        "_id": "profile_id_1",
        "bio": "Full Stack Developer",
        "currentPosition": "Senior Developer",
        "pastWork": [...],
        "skills": [],
        "education": [...],
        "userId": {
          "name": "Jane Smith",
          "email": "jane@example.com",
          "username": "janesmith",
          "profilePicture": "jane.jpg"
        }
      },
      // ... more profiles
    ]
  }
}
```

**UI Implementation**:
- Implement search bar with debounced input
- Display pagination controls
- Show loading skeleton while fetching
- Display user cards in grid layout

---

### 2.6 Download Resume
**Endpoint**: `GET /user/download_resume?id=<user_id>`  
**Authentication**: Public  
**Query Parameters**:
- `id` (string, required) - User ID

**Success Response** (200):
```json
{
  "success": true,
  "data": "a1b2c3d4e5f6.pdf"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Profile not found"
}
```

**Implementation**:
```javascript
// Download file from server
const downloadResume = async (userId) => {
  const response = await fetch(`/user/download_resume?id=${userId}`);
  const { data } = await response.json();
  
  // Open PDF in new tab
  window.open(`${BASE_URL}/${data}`, '_blank');
};
```

---

## 3. Posts Endpoints

### 3.1 Create Post
**Endpoint**: `POST /create_post`  
**Authentication**: Protected  
**Content-Type**: `multipart/form-data`

**Request Body** (FormData):
```javascript
const formData = new FormData();
formData.append('body', 'This is my post content');
formData.append('media', fileObject); // Optional - image or video
```

**Success Response** (200):
```json
{
  "status": true,
  "message": "Post created successfully"
}
```

**Implementation Notes**:
- `body` is required
- `media` is optional (can be image or video)
- Supported media types: JPG, PNG, MP4, etc.
- File type is auto-detected from mimetype

**Post-Creation Actions**:
1. Clear form
2. Refresh posts feed
3. Show success toast notification

---

### 3.2 Get All Posts
**Endpoint**: `GET /get_all_posts`  
**Authentication**: Public  
**Content-Type**: `application/json`

**Success Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "_id": "post_id_1",
      "userId": {
        "_id": "user_id_1",
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "profilePicture": "john.jpg"
      },
      "body": "Just finished building an amazing feature!",
      "likes": 42,
      "media": "post_image.jpg",
      "fileType": "jpg",
      "active": true,
      "createdAt": "2024-11-24T10:30:00.000Z",
      "updatedAt": "2024-11-24T10:30:00.000Z"
    },
    // ... more posts (sorted by createdAt descending)
  ]
}
```

**Error Response** (404):
```json
{
  "status": false,
  "message": "No posts found"
}
```

**UI Requirements**:
- Display posts in reverse chronological order
- Show user profile picture, name, and post time
- Render media if present (image/video)
- Show like count
- Include comment and like buttons

---

### 3.3 Get My Posts
**Endpoint**: `POST /get_my_posts`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**: Empty `{}`

**Success Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "_id": "post_id_1",
      "userId": {
        "_id": "user_id_1",
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "profilePicture": "john.jpg"
      },
      "body": "My personal post",
      "likes": 15,
      "media": "",
      "fileType": "",
      "createdAt": "2024-11-20T08:15:00.000Z"
    }
  ]
}
```

**Error Response** (404):
```json
{
  "status": false,
  "message": "Post not found"
}
```

---

### 3.4 Delete Post
**Endpoint**: `DELETE /delete_post`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "post_id": "post_id_123"
}
```

**Success Response** (200):
```json
{
  "status": true,
  "message": "Post deleted"
}
```

**Error Responses**:
```json
// Post not found (404)
{
  "status": false,
  "message": "Post not found"
}

// Unauthorized (401)
{
  "status": false,
  "message": "Unauthorized"
}
```

**Business Logic**:
- Only post owner can delete their own posts
- Show confirmation dialog before deletion
- Remove post from UI immediately after successful deletion

---

### 3.5 Like/Unlike Post
**Endpoint**: `POST /like_post`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "post_id": "post_id_123",
  "msg": "like"  // or "unlike"
}
```

**Success Response** (200):
```json
{
  "status": true,
  "message": "Post liked successfully"
}
// or
{
  "status": true,
  "message": "Post unliked successfully"
}
```

**Error Responses**:
```json
// Post not found (404)
{
  "status": false,
  "message": "Post not found"
}

// Invalid msg value (400)
{
  "status": false,
  "message": "Invalid msg value. Use 'like' or 'unlike'"
}
```

**UI Implementation**:
- Toggle like button (filled/outlined heart icon)
- Optimistic UI update (update immediately, rollback on error)
- Update like count in real-time

---

## 4. Comments Endpoints

### 4.1 Comment on Post
**Endpoint**: `POST /comment_post`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "post_id": "post_id_123",
  "comment": "Great post! Really insightful."
}
```

**Success Response** (200):
```json
{
  "status": true,
  "message": "Comment added successfully"
}
```

**Error Response** (404):
```json
{
  "status": false,
  "message": "Post not found"
}
```

---

### 4.2 Get Comments by Post
**Endpoint**: `POST /get_comments`  
**Authentication**: Public  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "post_id": "post_id_123"
}
```

**Success Response** (200):
```json
{
  "status": true,
  "data": [
    {
      "_id": "comment_id_1",
      "postId": "post_id_123",
      "userId": {
        "_id": "user_id_2",
        "name": "Jane Smith",
        "username": "janesmith",
        "email": "jane@example.com",
        "profilePicture": "jane.jpg"
      },
      "body": "Amazing work!",
      "createdAt": "2024-11-24T11:00:00.000Z",
      "updatedAt": "2024-11-24T11:00:00.000Z"
    },
    // ... more comments
  ]
}
```

**Error Response** (404):
```json
{
  "status": false,
  "message": "No comments found"
}
```

**UI Implementation**:
- Display comments below each post
- Show commenter's profile picture and name
- Display timestamp
- Show delete button only for comment owner

---

### 4.3 Delete Comment
**Endpoint**: `DELETE /delete_comment`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "comment_id": "comment_id_123"
}
```

**Success Response** (200):
```json
{
  "status": true,
  "message": "Comment deleted successfully"
}
```

**Error Responses**:
```json
// Comment not found (404)
{
  "status": false,
  "message": "Comment not found"
}

// Unauthorized (401)
{
  "status": false,
  "message": "Unauthorized - You can only delete your own comments"
}
```

---

## 5. Connections Endpoints

### 5.1 Send Connection Request
**Endpoint**: `POST /user/send_connection_request`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "connectionId": "user_id_to_connect"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Connection request sent successfully"
}
```

**Error Responses**:
```json
// User not found (404)
{
  "success": false,
  "message": "User not found"
}

// Request already exists (400)
{
  "success": false,
  "message": "Connection request already sent"
}
```

**UI Notes**:
- Change button from "Connect" to "Request Sent" (disabled)
- Show in pending connections list

---

### 5.2 Get Connection Requests (Received)
**Endpoint**: `GET /user/get_connection_requests`  
**Authentication**: Protected

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "request_id_1",
      "userId": "sender_user_id",
      "connectionId": {
        "_id": "user_id_1",
        "name": "Alice Johnson",
        "username": "alicej",
        "email": "alice@example.com",
        "profilePicture": "alice.jpg"
      },
      "status": null,
      "createdAt": "2024-11-23T14:30:00.000Z"
    }
  ]
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "No connection requests found"
}
```

**Status Values**:
- `null` - Pending
- `true` - Accepted
- `false` - Rejected

---

### 5.3 Get My Connections (Sent Requests)
**Endpoint**: `GET /user/myConnection`  
**Authentication**: Protected

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "request_id_1",
      "userId": "my_user_id",
      "connectionId": {
        "_id": "user_id_2",
        "name": "Bob Williams",
        "username": "bobw",
        "email": "bob@example.com",
        "profilePicture": "bob.jpg"
      },
      "status": true,
      "createdAt": "2024-11-20T09:00:00.000Z"
    }
  ]
}
```

---

### 5.4 Accept/Reject Connection Request
**Endpoint**: `POST /user/accept_connection_request`  
**Authentication**: Protected  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "requestId": "request_id_123",
  "accept_type": "accept"  // or "reject"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Connection request updated successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Connection request not found"
}
```

**UI Implementation**:
- Show "Accept" and "Reject" buttons for pending requests
- Remove from pending list after action
- Move to connections list if accepted

---

## Redux State Management

### State Structure

```javascript
// store.js
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  
  posts: {
    allPosts: [],
    myPosts: [],
    currentPost: null,
    loading: false,
    error: null
  },
  
  profile: {
    myProfile: null,
    viewingProfile: null,
    allUsers: [],
    usersMetadata: {
      totalCount: 0,
      page: 1,
      pageSize: 20,
      lastPage: 1
    },
    loading: false,
    error: null
  },
  
  connections: {
    receivedRequests: [],
    sentRequests: [],
    acceptedConnections: [],
    loading: false,
    error: null
  },
  
  comments: {
    commentsByPost: {}, // { postId: [comments] }
    loading: false,
    error: null
  }
}
```

### Key Actions to Implement

**authSlice.js**:
- `login(credentials)` - Async thunk
- `register(userData)` - Async thunk
- `logout()` - Clear state and localStorage
- `fetchUserProfile()` - Async thunk
- `updateUserProfile(data)` - Async thunk
- `uploadProfilePicture(file)` - Async thunk

**postsSlice.js**:
- `fetchAllPosts()` - Async thunk
- `fetchMyPosts()` - Async thunk
- `createPost(postData)` - Async thunk
- `deletePost(postId)` - Async thunk
- `likePost({ postId, action })` - Async thunk
- `updatePostLikes({ postId, increment })` - Optimistic update

**profileSlice.js**:
- `fetchAllUsers({ page, pageSize, keyword })` - Async thunk
- `fetchUserById(userId)` - Async thunk
- `updateProfileData(data)` - Async thunk
- `downloadResume(userId)` - Async thunk

**connectionsSlice.js**:
- `sendConnectionRequest(userId)` - Async thunk
- `fetchReceivedRequests()` - Async thunk
- `fetchSentRequests()` - Async thunk
- `acceptConnectionRequest({ requestId, action })` - Async thunk

**commentsSlice.js**:
- `fetchCommentsByPost(postId)` - Async thunk
- `addComment({ postId, comment })` - Async thunk
- `deleteComment(commentId)` - Async thunk

---

## Shadcn UI Components Guidelines
- **Card** - For post cards, user cards, profile sections
- **Button** - All buttons (primary, secondary, outline, ghost variants)
- **Input** - All text inputs
- **Textarea** - For post content, comments, bio
- **Avatar** - User profile pictures
- **Dialog** - Modals (delete confirmations, image previews)
- **Form** - All forms with react-hook-form integration
- **Separator** - Dividers between sections
- **Badge** - Status indicators, tags
- **Skeleton** - Loading states
- **Toast** - Success/error notifications
- **Dropdown Menu** - User menu, post actions menu
- **Tabs** - Profile sections (About, Posts, Connections)
- **Sheet** - Mobile navigation drawer

### Tailwind for:
- Spacing adjustments (margins, padding)
- Grid/Flex layouts
- Responsive design utilities
- Hover/focus states

---

## Form Validation with Zod

### Example Schemas

```javascript
// lib/validators.js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const postSchema = z.object({
  body: z.string().min(1, 'Post content is required'),
  media: z.any().optional(),
});

export const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  currentPosition: z.string(),
  pastWork: z.array(z.object({
    company: z.string(),
    position: z.string(),
    years: z.string(),
  })),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
  })),
});
```

---

## Error Handling

### Implement Global Error Handler

```javascript
// lib/api/axios-instance.js
import axios from 'axios';
import { toast } from 'sonner'; // or your toast library

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Unauthorized. Please login again.');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 404:
          toast.error(data.message || 'Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## Routing & Navigation

### Pages to Implement

1. **`/`** - Home/Feed Page
   - Display all posts
   - Create post form at top
   - Sidebar with user info and quick links

2. **`/login`** - Login Page
   - Login form
   - Link to register page
   - Redirect to home if already authenticated

3. **`/register`** - Registration Page
   - Registration form
   - Link to login page

4. **`/profile`** - My Profile Page
   - View/edit own profile
   - Display my posts
   - Work experience and education sections

5. **`/profile/[id]`** - Other User Profile
   - View other user's profile
   - Display their posts
   - Send connection request button

6. **`/network`** - Browse Users
   - Search and filter users
   - Pagination
   - Send connection requests

7. **`/connections`** - My Connections
   - Tabs: Received Requests, Sent Requests, My Connections
   - Accept/reject functionality

---

## Protected Routes Implementation

```javascript
// components/auth/protected-route.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
```

---

## Media Handling

### Image Display
```javascript
// All uploaded media is accessible at: BASE_URL/{filename}
const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${userData.profilePicture}`;

<img src={imageUrl} alt="Profile" />
```

### File Upload Component
```javascript
// Example for profile picture upload
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('profile_picture', file);

  try {
    await dispatch(uploadProfilePicture(formData)).unwrap();
    toast.success('Profile picture updated!');
  } catch (error) {
    toast.error('Failed to upload image');
  }
};
```

---

## Key Features to Implement

### 1. Post Feed
- [ ] Display all posts in reverse chronological order
- [ ] Each post shows author info, content, media, likes, timestamp
- [ ] Like/unlike functionality with optimistic updates
- [ ] Comment section (expandable)
- [ ] Delete button (only for post owner)
- [ ] Infinite scroll or pagination
- [ ] Create post form at top of feed

### 2. User Profile
- [ ] Profile header with picture, name, current position
- [ ] Edit profile button (own profile only)
- [ ] Bio section
- [ ] Work experience list (editable)
- [ ] Education list (editable)
- [ ] User's posts tab
- [ ] Download resume button
- [ ] Connection status/button

### 3. Network/Users Page
- [ ] Search bar with debounced search
- [ ] User cards in grid layout
- [ ] Pagination controls
- [ ] Connect button with state management
- [ ] Filter options (optional)

### 4. Connections
- [ ] Three tabs: Received, Sent, Connected
- [ ] Accept/Reject buttons for received requests
- [ ] Status indicators for sent requests
- [ ] List of accepted connections

### 5. Authentication
- [ ] Login form with validation
- [ ] Register form with validation
- [ ] Logout functionality
- [ ] Protected route wrapper
- [ ] Persist auth state on refresh

---

## Best Practices

### Code Organization
1. **One component per file**
2. **Co-locate related files** (component + styles + tests)
3. **Use barrel exports** for cleaner imports
4. **Separate business logic** from UI components

### Performance
1. **Use React.memo()** for expensive components
2. **Implement lazy loading** for images
3. **Debounce search inputs** (300ms recommended)
4. **Use optimistic updates** for like/unlike
5. **Implement skeleton loaders** for better UX

### Accessibility
1. **Use semantic HTML** elements
2. **Add proper ARIA labels** to interactive elements
3. **Ensure keyboard navigation** works throughout
4. **Maintain proper contrast ratios**

### State Management
1. **Keep API calls in async thunks**
2. **Normalize nested data** when needed
3. **Use selectors** for derived state
4. **Implement proper loading states**
5. **Handle errors gracefully**

---

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Testing Checklist

### Before Deployment
- [ ] All forms validate correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Images load correctly from backend
- [ ] File uploads work (profile picture, post media)
- [ ] Error messages display properly
- [ ] Success toasts appear after actions
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Like/unlike updates immediately
- [ ] Comments can be added and deleted
- [ ] Connection requests flow works end-to-end
- [ ] Logout clears all state and redirects
- [ ] Resume download opens PDF in new tab

---

## Final Notes

1. **API Response Consistency**: Note that some endpoints use `success` while others use `status` as the boolean indicator. Handle both in your code.

2. **File Paths**: All uploaded files (profile pictures, post media, PDFs) are served statically from the `uploads/` directory and accessible directly via `BASE_URL/{filename}`.

3. **Authentication Flow**: Always fetch user profile immediately after login to populate the Redux state with complete user information.

4. **Optimistic Updates**: Implement for likes to provide instant feedback. Rollback if the API call fails.

5. **Mobile Responsiveness**: Use Tailwind's responsive utilities and Do not create a seperate css file for styling

6. **Code Quality**: Use ESLint and Prettier for consistent code formatting. Follow the existing project structure strictly.

---

## Start Development

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Begin with authentication (login/register)
5. Implement Redux store and slices
6. Build core components (Post, User Card, etc.)
7. Implement pages one by one
8. Test all functionality thoroughly

**Good luck building an amazing LinkedIn clone! 🚀**
