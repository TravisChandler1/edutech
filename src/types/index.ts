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
  status?: 'active' | 'suspended' | 'banned';
  plan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedPlan?: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
  selectedCategory?: 'Group' | 'Individual';
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
  members: string[]; // user IDs
  isApproved: boolean;
  approvedBy?: string; // admin user ID
  approvedAt?: string;
  createdAt: string;
  category: 'General' | 'Study Group' | 'Cultural Discussion' | 'Practice Partners';
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
