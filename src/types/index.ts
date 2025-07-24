export interface ClassLevel {
  id: string;
  title: string;
  description: string;
  level: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced';
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