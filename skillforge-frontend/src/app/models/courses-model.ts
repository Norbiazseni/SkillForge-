export interface Course {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';  // Backend státuszok is
  difficulty?: 'beginner' | 'intermediate' | 'advanced';  // Backend mező
  instructor_id?: number;  // Backend mező
  instructor?: any;  // Backend mező (kapcsolt adatok)
  created_at?: string;
  updated_at?: string;
}
