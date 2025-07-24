export interface ClassLevel {
  id: string;
  title: string;
  description: string;
  level: 'Free Plan' | 'Premium' | 'Pro+';
  price: string;
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
  passwordHash: string;
  createdAt: string;
}
