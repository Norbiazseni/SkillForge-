import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CoursesService } from '../services/courses';
import { Course } from '../../../models/courses-model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css']
})
export class CourseForm {

  course: Partial<Course> = {
    title: '',
    description: '',
    status: 'planned'
  };

  constructor(
    private coursesService: CoursesService,
    private router: Router
  ) {}

  submit(): void {
    this.coursesService.addCourse(this.course as Course);
    this.router.navigate(['/courses']);
  }
}
