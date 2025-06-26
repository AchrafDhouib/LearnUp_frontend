
export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  is_active: boolean | number;
  role?: string[];
  created_at: string;
  updated_at: string;
}
