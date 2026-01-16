import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Course } from '../../../models/courses-model';
import { combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { WebsocketService } from '../../../core/websocket';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor(private websocketService: WebsocketService) {
    // Subscribe to WebSocket course created events
    this.websocketService.courseCreated$
      .subscribe((event) => {
        console.log('📥 WebSocket event received:', event);
        this.handleRemoteCourseCreate(event.course);
      });
    
    // Load initial courses from API
    this.loadCoursesFromAPI();
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

  private coursesSubject = new BehaviorSubject<Course[]>([]);

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  courses$ = this.coursesSubject.asObservable();

  // Load courses from backend API
  private loadCoursesFromAPI(): void {
    this.http.get<{data: Course[]}>(`${this.apiUrl}/courses`)
      .pipe(
        tap(response => console.log('✅ Courses loaded from API:', response)),
        catchError(error => {
          console.error('❌ Error loading courses:', error);
          return of({ data: [] });
        })
      )
      .subscribe(response => {
        if (response && Array.isArray(response.data)) {
          console.log('📊 Setting courses:', response.data);
          this.coursesSubject.next(response.data);
        }
      });
  }

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
    const newCourse = {
      ...course
    };

    // Send to backend API
    this.http.post<{data: Course}>(`${this.apiUrl}/courses`, newCourse)
      .pipe(
        tap(response => console.log('✅ Course created on server:', response.data)),
        catchError(error => {
          console.error('❌ Error creating course:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const courses = this.coursesSubject.value;
          this.coursesSubject.next([...courses, response.data]);
        }
      });

    // Emit WebSocket event for other clients
    this.websocketService.emitCourseCreated({
      course: newCourse,
      instructorName: 'Current User'
    });
  }


  // 🔹 UPDATE
  updateCourse(updated: Course): void {
    this.http.put<{data: Course}>(`${this.apiUrl}/courses/${updated.id}`, updated)
      .pipe(
        tap(response => console.log('✅ Course updated on server:', response.data)),
        catchError(error => {
          console.error('❌ Error updating course:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const updatedCourses = this.coursesSubject.value.map(course =>
            course.id === updated.id ? response.data : course
          );
          this.coursesSubject.next(updatedCourses);
        }
      });
  }

  // 🔹 DELETE
  deleteCourse(id: number): void {
    this.http.delete(`${this.apiUrl}/courses/${id}`)
      .pipe(
        tap(() => console.log('✅ Course deleted from server:', id)),
        catchError(error => {
          console.error('❌ Error deleting course:', error);
          throw error;
        })
      )
      .subscribe(() => {
        const filtered = this.coursesSubject.value.filter(c => c.id !== id);
        this.coursesSubject.next(filtered);
      });
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

}
