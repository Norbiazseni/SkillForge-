import { Injectable } from '@angular/core';
import { Course } from '../../../models/courses-model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private courses: Course[] = [
    {
      id: 1,
      title: 'Angular Basics',
      description: 'Introduction to Angular',
      status: 'active'
    },
    {
      id: 2,
      title: 'Laravel API',
      description: 'Building REST APIs',
      status: 'planned'
    },
    {
      id: 3,
      title: 'RxJS Deep Dive',
      description: 'Reactive programming',
      status: 'completed'
    }
  ];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id: number): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  addCourse(course: Course): void {
  const newId =
    this.courses.length > 0
      ? Math.max(...this.courses.map(c => c.id)) + 1
      : 1;

  this.courses.push({
    ...course,
    id: newId
  });
}

}
