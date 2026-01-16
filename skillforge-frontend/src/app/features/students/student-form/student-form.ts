import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../courses/services/courses';
import { StudentsService } from '../sevice/students';
import { Course } from '../../../models/courses-model';
import { Student } from '../../../models/students-model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.html'
})
export class StudentForm {

  isEdit = false;
  studentId?: number;
  courses: Course[] = [];

  form!: any;

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courses: [[] as number[]]
    });

    this.courses = this.coursesService.getCourses();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.studentId = +id;
      const student = this.studentsService.getStudentById(+id);
      if (student) {
        this.form.patchValue(student);
      }
    }
  }

  toggleCourse(courseId: number) {
    const selected = this.form.value.courses as number[];
    this.form.patchValue({
      courses: selected.includes(courseId)
        ? selected.filter(id => id !== courseId)
        : [...selected, courseId]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const student: Student = {
      id: this.studentId ?? Date.now(),
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      courses: this.form.value.courses || []
    };

    this.isEdit
      ? this.studentsService.updateStudent(student)
      : this.studentsService.addStudent(student);

    this.router.navigate(['/students']);
  }
}
