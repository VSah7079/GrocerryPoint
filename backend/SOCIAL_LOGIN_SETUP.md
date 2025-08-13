# Social Login Setup Guide

This guide will help you set up Google and Facebook OAuth for the GrocerryPoint application.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/grocerypoint

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Session Secret
SESSION_SECRET=your-super-secret-session-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Environment
NODE_ENV=development
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Set the authorized redirect URIs:
   - For development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add Facebook Login product to your app
4. Go to Settings > Basic and copy the App ID and App Secret
5. Go to Facebook Login > Settings and add valid OAuth redirect URIs:
   - For development: `http://localhost:5000/api/auth/facebook/callback`
   - For production: `https://yourdomain.com/api/auth/facebook/callback`
6. Copy the App ID and App Secret to your `.env` file

## Features

### User Model Updates
- Added social login fields: `provider`, `socialId`, `profilePicture`
- Made password optional for social login users
- Added `isEmailVerified` field (automatically true for social users)

### Authentication Flow
1. User clicks "Continue with Google/Facebook"
2. Redirected to OAuth provider
3. After successful authentication, redirected back to `/auth/callback`
4. User data is saved/updated in database
5. JWT token is generated and user is logged in
6. Redirected to home page

### Database Storage
- User profile information is automatically saved
- Social login details are stored for future reference
- Email verification is automatically completed for social users

## Security Features
- JWT tokens for session management
- Secure session handling with express-session
- CORS configuration for frontend-backend communication
- Password hashing for regular users (not required for social users)

## Testing
1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to the login page
4. Click on Google or Facebook login buttons
5. Complete the OAuth flow
6. Verify user data is saved in the database

## Troubleshooting
- Ensure all environment variables are set correctly
- Check that redirect URIs match exactly in OAuth provider settings
- Verify CORS settings allow your frontend domain
- Check browser console for any JavaScript errors
- Review server logs for authentication errors 