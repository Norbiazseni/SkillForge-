import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Course } from '../../../models/courses-model';
import { CoursesService } from '../services/courses';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';





@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './courses-list.html',
  styleUrls: ['./courses-list.css']
})
export class CoursesList implements OnInit, OnDestroy {

  courses: Course[] = [];

  private search$ = new Subject<string>();
  private sub?: Subscription;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {

    this.sub = this.coursesService.filteredCourses$
      .subscribe(courses => {
        this.courses = courses;
      });

    this.search$
      .pipe(debounceTime(300))
      .subscribe(term => {
        this.coursesService.setSearchTerm(term);
      });
  }


  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearch(term: string): void {
    this.search$.next(term);
  }

  delete(id: number): void {
    if (confirm('Delete this course?')) {
      this.coursesService.deleteCourse(id);
    }
  }

}