import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../../../models/students-model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      courses: [1, 2]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      courses: [1]
    }
  ];

  private studentsSubject =
    new BehaviorSubject<Student[]>(this.students);

  students$ = this.studentsSubject.asObservable();

  getStudents() {
    return this.students$;
  }

  addStudent(student: Student) {
    this.students.push({
      ...student,
      id: Date.now()
    });

    this.studentsSubject.next(this.students);
  }

  updateStudent(updated: Student) {
    this.students = this.students.map(s =>
      s.id === updated.id ? updated : s
    );

    this.studentsSubject.next(this.students);
  }

  deleteStudent(id: number) {
    this.students = this.students.filter(s => s.id !== id);
    this.studentsSubject.next(this.students);
  }

  getStudentById(id: number) {
    return this.students.find(s => s.id === id);
  }


}
