export interface Student {
  id: number;
  name: string;
  email: string;
  courses?: number[];  // Optional - frontend használatra
  courses_count?: number;  // Backend által visszaadott mező
  created_at?: string;
  updated_at?: string;
}
