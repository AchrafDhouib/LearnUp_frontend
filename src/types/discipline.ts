import { Specialty } from './specialty';

export interface Discipline {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
  specialities?: Specialty[];
}