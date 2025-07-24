# User Authentication & Dashboard System

This system implements a complete user authentication and personalized dashboard for the Yoruba learning platform.

## Features

### 🔐 Authentication System
- **User Registration**: Secure account creation with password hashing
- **User Login**: JWT-based authentication with httpOnly cookies
- **Session Management**: Automatic session validation and refresh
- **Protected Routes**: Dashboard and enrollment flows require authentication

### 📊 Personalized Dashboard
- **User Profile**: Display user information and account details
- **Quick Actions**: Easy access to classes, book club, and newsletter
- **Enrollment Tracking**: View and manage class enrollments (future feature)
- **Account Management**: Profile updates and settings

### 🛡️ Security Features
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Secure authentication tokens with expiration
- **HttpOnly Cookies**: Prevent XSS attacks on authentication tokens
- **Input Validation**: Server-side validation for all user inputs

## Setup Instructions

### 1. Database Setup
Run the SQL script to create the required tables:
```sql
-- Execute the contents of database/create_users_table.sql in your Neon database
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: Your Neon database connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `GMAIL_USER` & `GMAIL_APP_PASSWORD`: For email notifications

### 3. Dependencies
The following packages have been installed:
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token management
- `@types/bcryptjs` & `@types/jsonwebtoken`: TypeScript types

## How It Works

### Registration Flow
1. User clicks "Join Book Club" or similar enrollment button
2. If not logged in, authentication modal appears
3. User can register with name, email, and password
4. Password is hashed and user is stored in database
5. User is automatically logged in after registration
6. User can proceed with enrollment/payment

### Login Flow
1. User enters email and password
2. Server validates credentials against database
3. JWT token is generated and set as httpOnly cookie
4. User is redirected to dashboard or original destination

### Protected Routes
- `/dashboard`: User dashboard (requires authentication)
- Enrollment flows: Require login before payment processing

### Dashboard Features
- **Profile Information**: Display user details
- **Quick Actions**: Navigate to classes, book club, newsletter
- **Future Enhancements**: Enrollment history, progress tracking, resource management

## API Endpoints

### Authentication
- `POST /api/auth/register`: Create new user account
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/logout`: Clear authentication
- `GET /api/auth/me`: Get current user info

### Usage Examples

#### Check if user is authenticated
```typescript
const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Please log in</div>;
```

#### Require authentication before action
```typescript
const handleEnrollment = () => {
  if (user) {
    // Proceed with enrollment
    setEnrollmentModal(true);
  } else {
    // Show login modal
    setAuthModal(true);
  }
};
```

## Components

### AuthProvider
Context provider that manages authentication state across the app.

### AuthModal
Modal component for login/registration with form validation.

### Dashboard
Protected route showing user profile and quick actions.

### Header Updates
Shows login button for guests, dashboard link and logout for authenticated users.

## Security Considerations

1. **Password Security**: Passwords are hashed with bcrypt (12 salt rounds)
2. **JWT Security**: Tokens expire in 7 days and are stored in httpOnly cookies
3. **Input Validation**: All inputs are validated on both client and server
4. **HTTPS Required**: Use HTTPS in production for secure cookie transmission

## Future Enhancements

1. **Email Verification**: Verify email addresses during registration
2. **Password Reset**: Allow users to reset forgotten passwords
3. **Two-Factor Authentication**: Add 2FA for enhanced security
4. **Social Login**: Integration with Google/Facebook login
5. **Enrollment Management**: Track and display user's class enrollments
6. **Progress Tracking**: Monitor learning progress and achievements
7. **Resource Library**: Personal collection of purchased materials

## Testing

To test the authentication system:

1. **Registration**: Try creating a new account
2. **Login**: Test login with valid/invalid credentials
3. **Protected Routes**: Access `/dashboard` without login (should redirect)
4. **Enrollment Flow**: Try enrolling in book club without login
5. **Session Persistence**: Refresh page and verify user stays logged in
6. **Logout**: Test logout functionality

## Troubleshooting

### Common Issues

1. **JWT_SECRET not set**: Ensure JWT_SECRET is in your .env file
2. **Database connection**: Verify DATABASE_URL is correct
3. **Cookie issues**: Ensure your app runs on HTTPS in production
4. **CORS errors**: Check your domain configuration

### Error Messages

- "User already exists": Email is already registered
- "Invalid email or password": Login credentials are incorrect
- "Authentication required": User needs to log in
- "Internal server error": Check server logs for details

This authentication system provides a solid foundation for user management and can be extended with additional features as your platform grows.