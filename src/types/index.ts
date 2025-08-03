export interface ClassLevel {
  id: string;
  title: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  category: 'Group' | 'Individual';
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  synopsis: string;
  coverImage: string;
}

export interface Proverbs {
  id: string;
  yoruba: string;
  english: string;
}

// User account type for authentication and dashboard
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Optional for frontend use, required in backend
  role: 'teacher' | 'student' | 'admin';
  status?: 'active' | 'suspended' | 'banned' | 'pending_payment';
  plan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedPlan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedCategory?: 'Group' | 'Individual';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate?: string;
  lastLogin?: string;
  emailVerified?: boolean;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
  // Teacher approval system
  teacherApprovalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Admin ID who approved
  approvedAt?: string;
  rejectionReason?: string;
  [key: string]: any; // Allow additional properties for flexibility
}

// Teacher approval request for admin panel
export interface TeacherApprovalRequest {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  selectedPlan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedCategory?: 'Group' | 'Individual';
  bio?: string;
  qualifications?: string;
  experience?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Class scheduling for teachers
export interface GroupClass {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  scheduledDate: string;
  duration: number; // in minutes
  maxStudents: number;
  enrolledStudents: string[]; // user IDs
  createdAt: string;
}

// Dashboard customization based on plan
export interface DashboardConfig {
  plan: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  accessLevel: number;
  canScheduleClasses: boolean;
}

// Book Club Features
export interface BookClubSession {
  id: string;
  bookId: string;
  title: string;
  description: string;
  sessionType: 'group_chat' | 'live_discussion';
  scheduledDate: string;
  duration: number; // in minutes
  hostId: string;
  participants: string[]; // user IDs
  maxParticipants: number;
  createdAt: string;
}

// Live and Pre-recorded Classes
export interface LiveClass {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  scheduledDate: string;
  duration: number;
  maxStudents: number;
  enrolledStudents: string[];
  isLive: boolean;
  meetingLink: string; // Google Meet link
  meetingPassword?: string; // Google Meet password
  recordingUrl?: string;
  createdAt: string;
}

export interface PreRecordedClass {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl: string;
  duration: number;
  thumbnailUrl?: string;
  views: number;
  createdAt: string;
}

// Community Features
export interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string; // Added for display in admin panel
  members: string[];
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  category: 'General' | 'Study Group' | 'Cultural Discussion' | 'Practice Partners';
}

// Advanced Group Features (WhatsApp-like)
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  members: GroupMember[];
  invitedMembers: GroupInvite[];
  isPrivate: boolean;
  maxMembers: number;
  groupImage?: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  category: 'Study Group' | 'Book Club' | 'Language Practice' | 'Cultural Discussion';
}

export interface GroupMember {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'admin' | 'member';
  joinedAt: string;
  lastSeen?: string;
  isOnline: boolean;
}

export interface GroupInvite {
  id: string;
  groupId: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: string;
  respondedAt?: string;
  expiresAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  messageType: 'text' | 'file' | 'image' | 'event' | 'system';
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  replyTo?: string; // Message ID being replied to
  mentions?: string[]; // User IDs mentioned in message
  isEdited: boolean;
  editedAt?: string;
  sentAt: string;
  readBy: MessageRead[];
}

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  eventType: 'study_session' | 'discussion' | 'meeting' | 'social' | 'other';
  scheduledDate: string;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  attendees: EventAttendee[];
  maxAttendees?: number;
  reminders: EventReminder[];
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  userId: string;
  userName: string;
  status: 'going' | 'maybe' | 'not_going' | 'pending';
  respondedAt?: string;
}

export interface EventReminder {
  id: string;
  userId: string;
  eventId: string;
  reminderTime: string; // ISO string
  reminderType: '15min' | '1hour' | '1day' | 'custom';
  isSent: boolean;
}

export interface GroupFile {
  id: string;
  groupId: string;
  uploaderId: string;
  uploaderName: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  description?: string;
  category: 'document' | 'image' | 'video' | 'audio' | 'other';
  uploadedAt: string;
  downloadCount: number;
  isPublic: boolean; // Can non-members view this file
}

// Ebook Archive
export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  fileUrl: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Cultural' | 'Grammar' | 'Stories';
  language: 'Yoruba' | 'English' | 'Bilingual';
  pages: number;
  fileSize: string;
  createdAt: string;
}

export interface SavedBook {
  id: string;
  userId: string;
  ebookId: string;
  savedAt: string;
  readingProgress?: number; // percentage
  lastReadAt?: string;
}
