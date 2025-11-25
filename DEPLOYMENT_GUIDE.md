# LinkedIn Clone - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Google Cloud Console project for OAuth

## Backend Deployment

### 1. Environment Variables
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Deploy to Render/Railway/Heroku

#### For Render:
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables from .env
7. Deploy

#### For Railway:
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Add environment variables
5. Deploy automatically

### 3. Update Google OAuth
Add your deployed backend URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-backend-domain.com`
- Authorized redirect URIs: Add if needed

## Frontend Deployment

### 1. Environment Variables
Create `.env.production` file:
```env
VITE_API_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Build
```bash
npm run build
```

### 3. Deploy to Vercel/Netlify

#### For Vercel:
```bash
npm install -g vercel
vercel --prod
```
Or connect GitHub repo on Vercel dashboard

#### For Netlify:
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### 4. Update Google OAuth
Add your deployed frontend URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-frontend-domain.com`

## Post-Deployment

1. Test Google OAuth login
2. Test file uploads
3. Test all API endpoints
4. Update CORS settings if needed
5. Monitor logs for errors

## Important Notes

- Ensure MongoDB Atlas IP whitelist includes your hosting provider's IPs (or use 0.0.0.0/0 for allow all)
- Keep `.env` files secure and never commit them
- Update both frontend and backend URLs in respective .env files
- Test thoroughly before production use
