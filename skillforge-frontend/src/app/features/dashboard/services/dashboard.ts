import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CoursesService } from '../../courses/services/courses';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  totalCourses$!: Observable<number>;
  activeCourses$!: Observable<number>;
  completedCourses$!: Observable<number>;

  constructor(private coursesService: CoursesService) {
    this.totalCourses$ = this.coursesService.courses$
      .pipe(
        map(courses => courses.length)
      );

    // Active = published (backend státusz)
    this.activeCourses$ = this.coursesService.courses$
      .pipe(
        map(courses =>
          courses.filter(c => 
            c.status === 'published'
          ).length
        )
      );

    // Completed = archived (backend státusz)
    this.completedCourses$ = this.coursesService.courses$
      .pipe(
        map(courses =>
          courses.filter(c => 
            c.status === 'archived'
          ).length
        )
      );
  }
}
