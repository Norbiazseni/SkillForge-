import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../models/courses-model';
import { CoursesService } from '../services/courses';



@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './courses-list.html',
  styleUrls: ['./courses-list.css']
})
export class CoursesList {

  constructor(private coursesService: CoursesService) {}

  courses: Course[] = [];

  ngOnInit() {
    this.courses = this.coursesService.getCourses();
  }


}