# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending admin notifications and welcome emails.

## Prerequisites

1. A Gmail account for sending emails
2. Two-factor authentication enabled on your Gmail account

## Step 1: Enable Two-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2FA if not already enabled

## Step 2: Generate App Password

1. In your Google Account settings, go to "Security"
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app and "Other (Custom name)" as the device
4. Enter "Edutech Website" as the custom name
5. Click "Generate"
6. Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Update the following variables with your information:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-admin-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=your-admin-email@gmail.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Website Configuration
WEBSITE_URL=http://localhost:3000
WEBSITE_NAME=Ẹwà Èdè Yorùbá Academy
```

### Example Configuration:
```env
GMAIL_USER=admin@ewayoruba.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
ADMIN_EMAIL=admin@ewayoruba.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
WEBSITE_URL=https://ewayoruba.com
WEBSITE_NAME=Ẹwà Èdè Yorùbá Academy
```

## Step 4: Test the Configuration

1. Start your development server: `npm run dev`
2. Try subscribing to the newsletter on your website
3. Check your admin email for the notification
4. Check the subscriber's email for the welcome message

## Email Notifications

The system will send admin notifications for:

### 📧 Newsletter Subscriptions
- **Trigger**: When someone subscribes to the newsletter
- **Admin receives**: Subscriber details and timestamp
- **User receives**: Welcome email with subscription confirmation

### 📚 Book Club Registrations
- **Trigger**: When someone registers for the book club
- **Admin receives**: Registration details with payment amount (₦5,000)
- **Action required**: Follow up with payment confirmation

### 📝 Class Waitlist Registrations
- **Trigger**: When someone joins a class waitlist
- **Admin receives**: Waitlist details with selected class level
- **Action required**: Notify when spots become available

### 💰 Payment Notifications
- **Trigger**: When payment is received (via API call)
- **Admin receives**: Payment details with transaction information
- **Action required**: Confirm payment and grant access

## API Endpoints

The following API endpoints are available for sending notifications:

- `POST /api/newsletter` - Newsletter subscription
- `POST /api/book-club` - Book club registration
- `POST /api/waitlist` - Class waitlist registration
- `POST /api/payment` - Payment notification

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using the app password, not your regular Gmail password
   - Verify that 2FA is enabled on your account

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify the SMTP settings (host: smtp.gmail.com, port: 587)

3. **Emails not being received**
   - Check spam/junk folders
   - Verify the ADMIN_EMAIL is correct
   - Check the server logs for error messages

4. **"Authentication failed" error**
   - Regenerate the app password
   - Make sure there are no extra spaces in the .env.local file

### Testing Email Configuration

You can test the email configuration by running this in your browser console on any page:

```javascript
fetch('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: 'Test User', 
    email: 'test@example.com' 
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Security Notes

1. **Never commit your .env.local file** - It's already in .gitignore
2. **Use app passwords only** - Never use your main Gmail password
3. **Rotate app passwords regularly** - Generate new ones periodically
4. **Monitor email usage** - Keep track of email sending limits

## Gmail Sending Limits

- **Daily limit**: 500 emails per day for Gmail accounts
- **Rate limit**: 100 emails per hour
- **Recipient limit**: 500 recipients per email

For higher volumes, consider upgrading to Google Workspace or using a dedicated email service like SendGrid or Mailgun.

## Production Deployment

When deploying to production:

1. Update `WEBSITE_URL` to your production domain
2. Use environment variables in your hosting platform
3. Consider using a dedicated email service for higher reliability
4. Set up email monitoring and logging

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple email first
4. Contact support if problems persist