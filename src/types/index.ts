export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isApproved: boolean;
  isAdmin: boolean;
}

export interface FacialMeasurements {
  id: string;
  userId: string;
  eyebrowStart: { x: number; y: number };
  eyebrowArch: { x: number; y: number };
  eyebrowEnd: { x: number; y: number };
  thickness: number;
  angle: number;
  facialWidth: number;
  eyeDistance: number;
  recommendations: string[];
  createdAt: Date;
}

export interface BrowStyle {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'natural' | 'defined' | 'dramatic';
}

export interface LearningProgress {
  userId: string;
  completedLessons: string[];
  currentModule: string;
  practiceHours: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}