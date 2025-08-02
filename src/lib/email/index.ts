import { emailService as emailServiceInstance } from './email.service';
import { emailTemplates, sendEmail } from './email.utils';

// Export the singleton instance and other utilities
export { emailServiceInstance as emailService, emailTemplates, sendEmail };
export * from './email.service';
export * from './email.utils';
