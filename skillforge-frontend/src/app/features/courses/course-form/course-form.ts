import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoursesService } from '../services/courses';
import { Course } from '../../../models/courses-model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.html'
})
export class CourseFormComponent implements OnInit {

  course: Partial<Course> = {
    title: '',
    description: '',
    status: 'planned'
  };

  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const course = this.coursesService.getCourseById(+idParam);
      if (course) {
        this.course = { ...course };
        this.isEdit = true;
      }
    }
  }

  submit(): void {
    if (this.isEdit) {
      this.coursesService.updateCourse(this.course as Course);
    } else {
      this.coursesService.addCourse(this.course as Course);
    }

    this.router.navigate(['/courses']);
  }
}
