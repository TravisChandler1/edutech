interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export const emailConfig: EmailConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_APP_PASSWORD || '', // Use App Password if 2FA is enabled
  },
  from: `"Yoruba Learning Hub" <${process.env.EMAIL_USER || 'noreply@yorubalearninghub.com'}>`,
};

// Email templates configuration
export const emailTemplates = {
  teacherApproval: (name: string, approved: boolean) => ({
    subject: `Your Teacher Account ${approved ? 'Approved' : 'Rejected'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Your teacher account has been ${approved ? 'approved' : 'rejected'} by the admin.</p>
        ${approved 
          ? '<p>You can now log in to your teacher dashboard and start creating sessions and managing your students.</p>'
          : '<p>If you believe this is a mistake, please contact support.</p>'
        }
        <p>Best regards,<br/>Yoruba Learning Hub Team</p>
      </div>
    `,
  }),
  studentRegistration: (name: string) => ({
    subject: 'Welcome to Yoruba Learning Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for registering with Yoruba Learning Hub. We're excited to have you on board.</p>
        <p>Start exploring our courses and resources to begin your Yoruba learning journey.</p>
        <p>Best regards,<br/>Yoruba Learning Hub Team</p>
      </div>
    `,
  }),
  // Add more email templates as needed
};
