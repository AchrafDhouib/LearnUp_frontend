import { Specialty } from './specialty';
import { User } from './user';

export interface Lesson {
  id: number;
  cour_id: number;
  title: string;
  description: string;
  duration: number;
  url_video?: string;
  url_pdf?: string;
  cours?: Course;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  cours_url?: string;
  speciality_id: number;
  creator_id: number;
  description: string;
  image: string;
  price?: number;
  discount?: number;
  is_accepted?: 0 | 1 | null;
  created_at: string;
  updated_at: string;
  speciality?: Specialty;
  creator?: User;
  exam?: any;
  lessons?: Lesson[];
}
