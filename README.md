# Yoruba Learning Hub

An interactive platform for learning the Yoruba language, featuring live classes, community features, and a comprehensive learning management system.

## Features

- 🎓 Interactive Yoruba language courses
- 👥 Live classes with certified teachers
- 📚 E-book library with progress tracking
- 💬 Community discussions and study groups
- 🎯 Personalized learning paths
- 📱 Responsive design for all devices

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- PostgreSQL database
- Gmail account (for email service)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yoruba-learning-hub.git
cd yoruba-learning-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the `.env.local` file with your configuration:
   - Set up database connection
   - Configure Gmail SMTP for email service
   - Add Paystack API keys for payments
   - Configure other services as needed

### 4. Set up the database

1. Create a new PostgreSQL database
2. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Email Service Setup

To enable email notifications (password resets, course updates, etc.), you'll need to configure the Gmail SMTP service:

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to your [Google Account Settings](https://myaccount.google.com/)
   - Navigate to "Security"
   - Under "Signing in to Google," select "2-Step Verification"
   - Follow the steps to enable it

2. **Create an App Password**:
   - Go to your [Google Account](https://myaccount.google.com/)
   - Select "Security"
   - Under "Signing in to Google," select "App Passwords"
   - Generate a new app password for your application

3. **Update Environment Variables**:
   ```env
   # In your .env.local file
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   
   # Email display settings
   EMAIL_FROM_NAME="Yoruba Learning Hub"
   CONTACT_EMAIL=your-email@yorubalearninghub.com
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm test` - Run tests

## Project Structure

```
/src
  /app               # Next.js app directory
  /components        # Reusable UI components
  /lib               # Utility functions and configurations
    /email           # Email templates and services
  /prisma            # Database schema and migrations
  /public            # Static files
  /styles            # Global styles
```

## Testing the Email Service

To test if the email service is working correctly, you can create a simple API route:

1. Create a test API route at `src/app/api/test-email/route.ts`
2. Use the following code:

```typescript
import { NextResponse } from 'next/server';
import { emailTemplates } from '@/lib/email';

export async function GET() {
  try {
    await emailTemplates.studentWelcome('test@example.com', 'Test User');
    return NextResponse.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
```

3. Access the endpoint at `/api/test-email` to trigger a test email.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@yorubalearninghub.com or open an issue on GitHub.
