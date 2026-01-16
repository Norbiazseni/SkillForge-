import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Course } from '../models/courses-model';

export interface CourseCreatedEvent {
  course: Course;
  instructorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private courseCreatedSubject = new Subject<CourseCreatedEvent>();

  courseCreated$ = this.courseCreatedSubject.asObservable();

  emitCourseCreated(event: CourseCreatedEvent) {
    console.log('📡 WebSocket event emitted:', event);
    this.courseCreatedSubject.next(event);
  }
}
