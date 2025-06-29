export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  is_active: boolean | number;
  role?: string;
  groups?: any[];
  created_groups?: any[];
  passed_exams?: any[];
  courses?: any[];
  created_at: string;
  updated_at: string;
}
