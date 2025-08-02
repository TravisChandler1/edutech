import nodemailer from 'nodemailer';
import path from 'path';
import { create } from 'express-handlebars';
import { promises as fs } from 'fs';

interface EmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: any[];
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private hbs: any;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Initialize Nodemailer transporter with Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password if 2FA is enabled
      },
      tls: {
        rejectUnauthorized: false, // Only for development
      },
    });

    // Initialize Handlebars
    this.hbs = create({
      extname: '.hbs',
      partialsDir: path.join(__dirname, 'templates/partials'),
      defaultLayout: false,
    });
    
    // Verify connection configuration
    this.verifyConnection();
  }
  
  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (error) {
      console.error('Error verifying email server connection:', error);
      if (this.isProduction) {
        throw new Error('Failed to connect to email server');
      } else {
        console.warn('⚠️ Email server connection failed, but continuing in development mode');
      }
    }
  }

  async sendEmail({
    to,
    subject,
    template,
    context = {},
    cc,
    bcc,
    replyTo,
    attachments = [],
  }: EmailOptions) {
    try {
      if (!this.isProduction) {
        console.log('📧 Email sending is disabled in development mode');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Context:', JSON.stringify(context, null, 2));
        return { messageId: 'test-message-id' };
      }

      // Add common context variables
      const templateContext = {
        ...context,
        currentYear: new Date().getFullYear(),
        subject,
        appName: 'Yoruba Learning Hub',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        contactEmail: process.env.CONTACT_EMAIL || 'support@yorubalearninghub.com',
      };

      // Render the email template
      let html = '';
      try {
        const templatePath = path.join(__dirname, 'templates', `${template}.hbs`);
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        html = await this.hbs.render(
          path.join(__dirname, 'templates/base.hbs'),
          {
            ...templateContext,
            template: templateContent,
          }
        );
      } catch (templateError) {
        console.error('Error rendering email template:', templateError);
        // Fallback to simple HTML if template rendering fails
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>${subject}</h2>
            <div>${JSON.stringify(templateContext, null, 2)}</div>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This email was sent from ${templateContext.appName}.
            </p>
          </div>
        `;
      }

      // Send email
      const mailOptions = {
        from: `"Yoruba Learning Hub" <${process.env.GMAIL_USER}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: html,
        cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
        bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
        replyTo: replyTo || process.env.REPLY_TO_EMAIL,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      if (this.isProduction) {
        // In production, you might want to log this to a service like Sentry
        console.error('Email sending failed:', error);
      }
      throw error;
    }
  }

  // Specific email methods
  async sendTeacherApprovalEmail(
    email: string,
    name: string,
    approved: boolean,
    reason?: string
  ) {
    return this.sendEmail({
      to: email,
      subject: `Your Teacher Application ${approved ? 'Approved' : 'Update'}`,
      template: 'teacher-approval',
      context: {
        name,
        approved,
        reason,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teacher`,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
      },
    });
  }

  // Add more specific email methods here
  // async sendStudentWelcomeEmail(...) { ... }
  // async sendPaymentConfirmation(...) { ... }
  // async sendLiveSessionReminder(...) { ... }
  // etc.
}

export const emailService = new EmailService();
