import { emailService } from './email.service';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: string;
  context?: Record<string, any>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: any[];
}

export const sendEmail = async (params: SendEmailParams) => {
  try {
    return await emailService.sendEmail({
      to: params.to,
      subject: params.subject,
      template: params.template,
      context: {
        ...params.context,
        appName: process.env.NEXT_PUBLIC_SITE_NAME || 'Yoruba Learning Hub',
        supportEmail: process.env.CONTACT_EMAIL || 'support@yorubalearninghub.com',
        currentYear: new Date().getFullYear(),
      },
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
      attachments: params.attachments || [],
    });
  } catch (error) {
    console.error('Error in sendEmail utility:', error);
    throw error;
  }
};

// Common email templates
export const emailTemplates = {
  // Teacher approval emails
  teacherApproval: (email: string, name: string, approved: boolean, reason?: string) => {
    const status = approved ? 'approved' : 'not approved';
    return sendEmail({
      to: email,
      subject: `Your Teacher Application - ${status}`,
      template: 'teacher-approval',
      context: {
        name,
        approved,
        reason: reason || 'No reason provided.',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teacher`,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
      },
    });
  },

  // Student registration
  studentWelcome: (email: string, name: string) => {
    return sendEmail({
      to: email,
      subject: 'Welcome to Yoruba Learning Hub!',
      template: 'welcome',
      context: {
        name,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  },

  // Password reset
  passwordReset: (email: string, name: string, resetToken: string) => {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    return sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        name,
        resetUrl,
      },
    });
  },

  // Course enrollment confirmation
  courseEnrollment: (email: string, studentName: string, course: any) => {
    return sendEmail({
      to: email,
      subject: `Enrollment Confirmed: ${course.name}`,
      template: 'course-enrollment-confirmation',
      context: {
        studentName,
        courseName: course.name,
        instructorName: course.instructorName,
        startDate: new Date(course.startDate).toLocaleDateString(),
        schedule: course.schedule,
        courseLink: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  },

  // Payment receipt
  paymentReceipt: (email: string, name: string, payment: any) => {
    return sendEmail({
      to: email,
      subject: `Payment Receipt - ${payment.transactionId}`,
      template: 'payment-receipt',
      context: {
        name,
        transactionId: payment.transactionId,
        paymentDate: new Date(payment.date).toLocaleString(),
        amount: payment.amount,
        paymentMethod: payment.method,
        items: payment.items || [],
        subtotal: payment.subtotal,
        tax: payment.tax || '₦0.00',
        total: payment.total,
        receiptUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/receipts/${payment.transactionId}`,
        billingEmail: process.env.BILLING_EMAIL || 'billing@yorubalearninghub.com',
      },
    });
  },

  // Class reminder
  classReminder: (email: string, studentName: string, classInfo: any) => {
    return sendEmail({
      to: email,
      subject: `⏰ Reminder: ${classInfo.title} Starts Soon!`,
      template: 'class-reminder',
      context: {
        studentName,
        className: classInfo.title,
        classDateTime: new Date(classInfo.startTime).toLocaleString(),
        duration: classInfo.duration || 60,
        instructorName: classInfo.instructorName || 'Your Instructor',
        meetingLink: classInfo.meetingUrl,
        materials: classInfo.materials,
        notificationSettingsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications`,
      },
    });
  },

  // Teacher approval notification (admin to teacher)
  teacherApprovalNotification: (email: string, name: string, approved: boolean, feedback?: string) => {
    return sendEmail({
      to: email,
      subject: `Teacher Application ${approved ? 'Approved' : 'Requires Additional Information'}`,
      template: 'teacher-approval',
      context: {
        name,
        approved,
        reason: feedback || (approved ? 'Your application meets our requirements.' : 'Please review the feedback provided.'),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teacher`,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
      },
    });
  },

  // Generic notification
  sendNotification: (email: string, subject: string, message: string, actionUrl?: string, actionText?: string) => {
    return sendEmail({
      to: email,
      subject,
      template: 'generic-notification',
      context: {
        subject,
        message,
        actionUrl,
        actionText,
      },
    });
  },

  // Live session reminder
  sessionReminder: (email: string, name: string, session: any) => {
    return sendEmail({
      to: email,
      subject: `Reminder: ${session.title} starts soon!`,
      template: 'session-reminder',
      context: {
        name,
        session: {
          ...session,
          startTime: new Date(session.startTime).toLocaleString(),
          joinUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sessions/${session.id}/join`,
        },
      },
    });
  },

  // Payment confirmation
  paymentConfirmation: (email: string, name: string, paymentDetails: any) => {
    return sendEmail({
      to: email,
      subject: 'Payment Confirmation',
      template: 'payment-confirmation',
      context: {
        name,
        amount: paymentDetails.amount,
        plan: paymentDetails.planName,
        transactionId: paymentDetails.transactionId,
        date: new Date().toLocaleDateString(),
        receiptUrl: paymentDetails.receiptUrl,
      },
    });
  },
};
