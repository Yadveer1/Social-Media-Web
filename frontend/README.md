# Professional Network Application - Frontend

A modern, responsive professional networking platform built with React, Zustand, and shadcn/ui components.

## 🚀 Features

- **Authentication**
  - Email/Password registration and login
  - Google OAuth integration
  - JWT token-based authentication
  - Protected routes

- **User Profiles**
  - Customizable profiles with bio, work experience, and education
  - Profile picture upload
  - Resume download functionality

- **Posts & Feed**
  - Create posts with text and media (images/videos)
  - Like and unlike posts
  - Comment on posts
  - Delete own posts and comments
  - Real-time feed updates

- **Networking**
  - Search and discover users
  - Send connection requests
  - Accept or reject requests
  - View sent and received requests
  - Pagination support

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **Authentication**: Google OAuth + JWT
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (default: http://localhost:5000)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Update Google Client ID**
   
   In `src/main.jsx`, replace the clientId with your Google OAuth Client ID:
   ```javascript
   const clientId = "YOUR_GOOGLE_CLIENT_ID";
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── layout/                # Navbar, Layout
│   ├── auth/                  # ProtectedRoute
│   ├── profile/               # ProfileCard, EditProfileDialog
│   ├── posts/                 # PostCard, CreatePostDialog
│   ├── comments/              # CommentSection
│   └── connections/           # UserCard, ConnectionRequestCard
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── MyPosts.jsx
│   ├── Connections.jsx
│   └── UserSearch.jsx
├── stores/
│   ├── authStore.js           # Authentication state
│   ├── userStore.js           # User profile state
│   ├── postStore.js           # Posts state
│   ├── commentStore.js        # Comments state
│   ├── connectionStore.js     # Connections state
│   └── uiStore.js             # UI state (modals)
├── services/
│   └── api.js                 # Axios configuration
├── utils/
│   ├── constants.js           # App constants
│   ├── formatters.js          # Data formatting utilities
│   └── validators.js          # Form validation helpers
├── hooks/
│   └── useAuth.js             # Custom auth hook
└── lib/
    └── utils.js               # shadcn utility functions
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User logs in with email/password or Google OAuth
2. Backend returns JWT token and user data
3. Token is stored in localStorage and Zustand store
4. Token is automatically included in all API requests via Axios interceptor
5. On 401 error, user is automatically logged out and redirected to login

## 📡 API Integration

The app integrates with 21 backend endpoints:

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /auth/google` - Google OAuth login

### User Profile
- `GET /get_user_and_profile` - Get current user profile
- `POST /user_update` - Update user information
- `POST /update_profile_data` - Update profile data
- `POST /upload_profile_picture` - Upload profile picture
- `GET /user/get_all_users` - Search/get all users
- `GET /user/download_resume` - Download user resume

### Posts
- `POST /create_post` - Create new post
- `GET /get_all_posts` - Get all posts
- `POST /get_my_posts` - Get current user's posts
- `DELETE /delete_post` - Delete post
- `POST /like_post` - Like/unlike post

### Comments
- `POST /comment_post` - Add comment to post
- `POST /get_comments` - Get comments for post
- `DELETE /delete_comment` - Delete comment

### Connections
- `POST /user/send_connection_request` - Send connection request
- `GET /user/get_connection_requests` - Get sent requests
- `GET /user/myConnection` - Get received requests
- `POST /user/accept_connection_request` - Accept/reject request

## 🎨 UI Components

All UI components use shadcn/ui library:

- **Button** - All interactive buttons
- **Input** - Form inputs
- **Textarea** - Multi-line text inputs
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Avatar** - User profile pictures
- **Badge** - Status indicators
- **Tabs** - Tabbed content
- **Dropdown Menu** - User menu, post options
- **Skeleton** - Loading states
- **Sonner** - Toast notifications
- **Separator** - Visual dividers
- **ScrollArea** - Scrollable containers

## 🔄 State Management

Zustand stores manage global state:

- **authStore** - User authentication, login/logout
- **userStore** - User profile data and updates
- **postStore** - Posts feed, create, delete, like
- **commentStore** - Comments per post, add, delete
- **connectionStore** - User search, connection requests
- **uiStore** - Modal states, toast notifications

## 🎨 Styling Guidelines

- Use shadcn components for all UI elements
- Use Tailwind utility classes for spacing and layout
- Avoid custom CSS unless absolutely necessary
- Follow mobile-first responsive design
- Use consistent spacing (Tailwind spacing scale)

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Required |

## 🚧 Troubleshooting

### Common Issues

1. **API connection errors**
   - Ensure backend server is running on port 5000
   - Check CORS configuration on backend

2. **Google OAuth not working**
   - Verify Google Client ID is correct
   - Check OAuth consent screen configuration
   - Ensure domain is authorized in Google Console

3. **Images not loading**
   - Verify API_BASE_URL is correct
   - Check backend uploads directory permissions

4. **Token expiration**
   - Backend should handle token refresh
   - App auto-redirects to login on 401 errors

## 📝 Best Practices

1. **Always use Zustand stores** for data fetching and state management
2. **Show loading states** during async operations
3. **Display toast notifications** for user feedback
4. **Handle errors gracefully** with user-friendly messages
5. **Validate forms** before submission
6. **Use protected routes** for authenticated pages
7. **Optimize images** before upload
8. **Test on multiple screen sizes**

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] Post sharing
- [ ] Advanced search filters
- [ ] Profile recommendations
- [ ] Dark mode support
- [ ] Infinite scroll for feeds
- [ ] Image cropping for profile pictures
- [ ] Rich text editor for posts
- [ ] Hashtag support

## 📄 License

This project is part of a professional networking platform.

## 🤝 Contributing

1. Follow the existing code structure
2. Use shadcn components for UI
3. Maintain consistent naming conventions
4. Add proper error handling
5. Test on multiple browsers and devices

## 📧 Support

For issues or questions, please refer to the backend API documentation or create an issue in the repository.
