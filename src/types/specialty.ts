import { Discipline } from './discipline';
import { Course } from './course';

export interface Specialty {
  id: number;
  name: string;
  discipline_id: number;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
  discipline?: Discipline;
  courses?: Course[];
}
