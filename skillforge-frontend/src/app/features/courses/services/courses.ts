import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../../../models/courses-model';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebsocketService } from '../../../core/websocket';



@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private websocketService: WebsocketService) {
    // Subscribe to WebSocket course created events
    this.websocketService.courseCreated$
      .subscribe((event) => {
        console.log('📥 WebSocket event received:', event);
        this.handleRemoteCourseCreate(event.course);
      });
  }

  private handleRemoteCourseCreate(course: Course): void {
    const courses = this.coursesSubject.value;

    const exists = courses.some(c => c.id === course.id);
    if (!exists) {
      console.log('✅ Adding course from WebSocket:', course.title);
      this.coursesSubject.next([...courses, course]);
    } else {
      console.log('⚠️ Course already exists:', course.title);
    }
  }

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

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  courses$ = this.coursesSubject.asObservable();

  filteredCourses$ = combineLatest([
    this.coursesSubject.asObservable(),
    this.searchTerm$
  ]).pipe(
    map(([courses, searchTerm]) => {
      const trimmedTerm = searchTerm.trim().toLowerCase();
      if (!trimmedTerm) {
        return courses;
      }
      return courses.filter(course =>
        course.title.toLowerCase().includes(trimmedTerm)
      );
    })
  );


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

    // Emit WebSocket event for other clients
    this.websocketService.emitCourseCreated({
      course: newCourse,
      instructorName: 'Current User' // You can pass actual instructor name here
    });
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

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

}
