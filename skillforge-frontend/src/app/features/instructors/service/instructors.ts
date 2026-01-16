import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Instructor } from '../../../models/instructor-model';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private instructorsSubject = new BehaviorSubject<Instructor[]>([]);

  instructors$ = this.instructorsSubject.asObservable();

  constructor() {
    this.loadInstructorsFromAPI();
  }

  // Load instructors from backend API
  private loadInstructorsFromAPI(): void {
    this.http.get<{data: Instructor[]}>(`${this.apiUrl}/instructors`)
      .pipe(
        tap(response => console.log('✅ Instructors loaded from API:', response)),
        catchError(error => {
          console.error('❌ Error loading instructors:', error);
          return of({ data: [] });
        })
      )
      .subscribe(response => {
        if (response && Array.isArray(response.data)) {
          console.log('📊 Setting instructors:', response.data);
          this.instructorsSubject.next(response.data);
        }
      });
  }

  getInstructors() {
    return this.instructors$;
  }

  addInstructor(instructor: Instructor) {
    this.http.post<{data: Instructor}>(`${this.apiUrl}/instructors`, instructor)
      .pipe(
        tap(response => console.log('✅ Instructor created on server:', response.data)),
        catchError(error => {
          console.error('❌ Error creating instructor:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const instructors = this.instructorsSubject.value;
          this.instructorsSubject.next([...instructors, response.data]);
        }
      });
  }

  updateInstructor(updated: Instructor) {
    this.http.put<{data: Instructor}>(`${this.apiUrl}/instructors/${updated.id}`, updated)
      .pipe(
        tap(response => console.log('✅ Instructor updated on server:', response.data)),
        catchError(error => {
          console.error('❌ Error updating instructor:', error);
          throw error;
        })
      )
      .subscribe(response => {
        if (response && response.data) {
          const instructors = this.instructorsSubject.value.map(i =>
            i.id === updated.id ? response.data : i
          );
          this.instructorsSubject.next(instructors);
        }
      });
  }

  deleteInstructor(id: number) {
    this.http.delete(`${this.apiUrl}/instructors/${id}`)
      .pipe(
        tap(() => console.log('✅ Instructor deleted from server:', id)),
        catchError(error => {
          console.error('❌ Error deleting instructor:', error);
          throw error;
        })
      )
      .subscribe(() => {
        const instructors = this.instructorsSubject.value.filter(i => i.id !== id);
        this.instructorsSubject.next(instructors);
      });
  }

  getInstructorById(id: number) {
    return this.instructorsSubject.value.find(i => i.id === id);
  }
}
