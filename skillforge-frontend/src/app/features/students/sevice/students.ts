import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Student } from '../../../models/students-model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private studentsSubject = new BehaviorSubject<Student[]>([]);

  students$ = this.studentsSubject.asObservable();

  constructor() {
    this.loadStudentsFromAPI();
  }

  // Load students from backend API
  private loadStudentsFromAPI(): void {
    this.http.get<{data: Student[]}>(`${this.apiUrl}/students`)
      .pipe(
        tap(response => console.log('✅ Students loaded from API:', response)),
        catchError(error => {
          console.error('❌ Error loading students:', error);
          return of({ data: [] });
        })
      )
      .subscribe(response => {
        if (response && Array.isArray(response.data)) {
          console.log('📊 Setting students:', response.data);
          this.studentsSubject.next(response.data);
        }
      });
  }

  getStudents() {
    return this.students$;
  }

  addStudent(student: Student) {
    this.http.post<{data: Student}>(`${this.apiUrl}/students`, student)
      .pipe(
        tap(response => console.log('✅ Student created on server:', response.data)),
        catchError(error => {
          console.error('❌ Error creating student:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const students = this.studentsSubject.value;
          this.studentsSubject.next([...students, response.data]);
        }
      });
  }

  updateStudent(updated: Student) {
    this.http.put<{data: Student}>(`${this.apiUrl}/students/${updated.id}`, updated)
      .pipe(
        tap(response => console.log('✅ Student updated on server:', response.data)),
        catchError(error => {
          console.error('❌ Error updating student:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const students = this.studentsSubject.value.map(s =>
            s.id === updated.id ? response.data : s
          );
          this.studentsSubject.next(students);
        }
      });
  }

  deleteStudent(id: number) {
    this.http.delete(`${this.apiUrl}/students/${id}`)
      .pipe(
        tap(() => console.log('✅ Student deleted from server:', id)),
        catchError(error => {
          console.error('❌ Error deleting student:', error);
          throw error;
        })
      )
      .subscribe(() => {
        const students = this.studentsSubject.value.filter(s => s.id !== id);
        this.studentsSubject.next(students);
      });
  }

  getStudentById(id: number) {
    return this.studentsSubject.value.find(s => s.id === id);
  }
}
