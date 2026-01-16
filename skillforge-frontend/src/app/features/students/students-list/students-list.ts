import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../sevice/students';
import { Student } from '../../../models/students-model';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './students-list.html'
})
export class StudentsList implements OnInit {

  students: Student[] = [];

  constructor(private studentsService: StudentsService) {}

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((data: Student[]) => this.students = data);
  }

  delete(id: number) {
    this.studentsService.deleteStudent(id);
  }

}
