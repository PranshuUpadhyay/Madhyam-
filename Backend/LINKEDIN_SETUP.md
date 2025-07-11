# LinkedIn Authentication Setup Guide

## 1. Create LinkedIn App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required details:
   - App name: "Madhyam"
   - LinkedIn Page: Your organization's LinkedIn page
   - App Logo: Upload your app logo
4. Click "Create app"

## 2. Configure OAuth 2.0 Settings

1. In your LinkedIn app dashboard, go to "Auth" tab
2. Add OAuth 2.0 Redirect URLs:
   - For development: `http://localhost:3000/auth/linkedin/success`
   - For production: `https://your-production-domain.com/auth/linkedin/success`
3. Save the changes

## 3. Get Your Credentials

1. Go to "Auth" tab in your LinkedIn app
2. Copy your **Client ID** and **Client Secret**
3. Add these to your environment variables

## 4. Environment Variables

Add these to your `.env` file:

```env
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Other required variables
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=your-database-url
NODE_ENV=development
PORT=5000
```

## 5. Update Frontend Configuration

In your frontend, update the callback URLs in:
- `Backend/controllers/authController.js` - Update the `REDIRECT_URI` for production
- `m_frontend/src/pages/Login.jsx` - Ensure the LinkedIn button works correctly

## 6. Test the Integration

1. Start your backend server
2. Start your frontend application
3. Go to the login page
4. Click "Sign in with LinkedIn"
5. Complete the OAuth flow
6. Verify that the user is created/logged in successfully

## 7. Production Deployment

For production:
1. Update the `REDIRECT_URI` in `authController.js` to your production domain
2. Ensure your LinkedIn app has the production redirect URL configured
3. Set `NODE_ENV=production` in your environment variables
4. Use HTTPS for all URLs

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the redirect URL in LinkedIn app matches exactly
- **"Client ID not found"**: Verify your LinkedIn Client ID is correct
- **"Invalid client secret"**: Verify your LinkedIn Client Secret is correct
- **CORS errors**: Ensure your backend CORS configuration allows your frontend domain 