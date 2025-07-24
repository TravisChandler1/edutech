import nodemailer from 'nodemailer';

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  newsletterSubscription: (data: { name: string; email: string }) => ({
    subject: '📧 New Newsletter Subscription - Yoruba Ronu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #A6192E; margin-bottom: 20px;">🎉 New Newsletter Subscription!</h2>
          
          <div style="background-color: #F5E8C7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #020735; margin-top: 0;">Subscriber Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #020735;">A new user has subscribed to the Yoruba Ronu newsletter. Please add them to your mailing list and consider sending a welcome email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This notification was sent from ${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  bookClubRegistration: (data: { name: string; email: string; level: string; amount: string }) => ({
    subject: '📚 New Book Club Registration - Payment Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #A6192E; margin-bottom: 20px;">📚 New Book Club Registration!</h2>
          
          <div style="background-color: #F5E8C7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #020735; margin-top: 0;">Registration Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Yoruba Level:</strong> ${data.level}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${data.amount}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #856404; margin: 0;"><strong>⚠️ Action Required:</strong> Please follow up with payment confirmation and send meeting details to the participant.</p>
          </div>
          
          <p style="color: #020735;">A new user has registered for the Book Club. Please process their payment and send them the meeting information.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This notification was sent from ${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  classWaitlist: (data: { name: string; email: string; level: string }) => ({
    subject: '📝 New Class Waitlist Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #A6192E; margin-bottom: 20px;">📝 New Waitlist Registration!</h2>
          
          <div style="background-color: #F5E8C7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #020735; margin-top: 0;">Waitlist Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Class Level:</strong> ${data.level}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #020735;">A new user has joined the waitlist for ${data.level} classes. Please add them to your waitlist and notify them when spots become available.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This notification was sent from ${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  paymentReceived: (data: { name: string; email: string; service: string; amount: string; paymentMethod: string; transactionId?: string }) => ({
    subject: '💰 Payment Received - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #A6192E; margin-bottom: 20px;">💰 Payment Received!</h2>
          
          <div style="background-color: #D4EDDA; border: 1px solid #C3E6CB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0;">Payment Details:</h3>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${data.service}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${data.amount}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            ${data.transactionId ? `<p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #856404; margin: 0;"><strong>⚠️ Action Required:</strong> Please confirm the payment and provide access to the purchased service.</p>
          </div>
          
          <p style="color: #020735;">A payment has been received. Please verify the transaction and grant the customer access to their purchased service.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This notification was sent from ${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}
            </p>
          </div>
        </div>
      </div>
    `,
  }),
};

// Send email function
export const sendAdminNotification = async (
  type: keyof typeof emailTemplates,
  data: any
) => {
  try {
    const template = emailTemplates[type](data);
    
    const mailOptions = {
      from: `"${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to user
export const sendWelcomeEmail = async (name: string, email: string) => {
  try {
    const mailOptions = {
      from: `"${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Yoruba Ronu Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #A6192E; margin-bottom: 20px;">🎉 Ẹ kú àbọ̀! Welcome to Yoruba Ronu!</h2>
            
            <p style="color: #020735; font-size: 16px;">Dear ${name},</p>
            
            <p style="color: #020735;">Thank you for subscribing to our Yoruba Ronu newsletter! We're excited to have you join our community of Yoruba language and culture enthusiasts.</p>
            
            <div style="background-color: #F5E8C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #020735; margin-top: 0;">What to expect:</h3>
              <ul style="color: #020735; padding-left: 20px;">
                <li>Monthly updates on Yoruba culture and traditions</li>
                <li>Language learning tips and resources</li>
                <li>Community highlights and student success stories</li>
                <li>Upcoming events and class announcements</li>
                <li>Traditional Yoruba proverbs with explanations</li>
              </ul>
            </div>
            
            <p style="color: #020735;">While you're here, explore our website to learn more about our classes, book club, and cultural programs.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.WEBSITE_URL || 'http://localhost:3000'}" style="background-color: #F28C38; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Our Website</a>
            </div>
            
            <p style="color: #020735;">Ẹ ṣé púpọ̀! (Thank you very much!)</p>
            
            <p style="color: #020735;">
              Warm regards,<br>
              The Ẹwà Èdè Yorùbá Academy Team
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                You're receiving this email because you subscribed to our newsletter at ${process.env.WEBSITE_NAME || 'Ẹwà Èdè Yorùbá Academy'}.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};