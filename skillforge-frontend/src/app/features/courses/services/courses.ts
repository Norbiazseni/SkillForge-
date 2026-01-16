import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../../../models/courses-model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private coursesSubject = new BehaviorSubject<Course[]>([
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
  ]);

  courses$ = this.coursesSubject.asObservable();

  // 🔹 LISTA
  getCourses(): Course[] {
    return this.coursesSubject.value;
  }

  // 🔹 EGY KURZUS
  getCourseById(id: number): Course | undefined {
    return this.coursesSubject.value.find(c => c.id === id);
  }

  // 🔹 CREATE
  addCourse(course: Course): void {
    const courses = this.coursesSubject.value;

    const newCourse: Course = {
      ...course,
      id: courses.length
        ? Math.max(...courses.map(c => c.id)) + 1
        : 1
    };

    this.coursesSubject.next([...courses, newCourse]);
  }

  // 🔹 UPDATE
  updateCourse(updated: Course): void {
    const updatedCourses = this.coursesSubject.value.map(course =>
      course.id === updated.id ? updated : course
    );

    this.coursesSubject.next(updatedCourses);
  }

  // 🔹 DELETE
  deleteCourse(id: number): void {
    const filtered = this.coursesSubject.value.filter(c => c.id !== id);
    this.coursesSubject.next(filtered);
  }
}
