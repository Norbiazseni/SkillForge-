import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Instructor } from '../../../models/instructor-model';


@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  private instructors: Instructor[] = [
    {
      id: 1,
      name: 'Alice Brown',
      email: 'alice@skillforge.com',
      expertise: 'Angular'
    },
    {
      id: 2,
      name: 'Bob Miller',
      email: 'bob@skillforge.com',
      expertise: 'Laravel'
    }
  ];

  private instructorsSubject =
    new BehaviorSubject<Instructor[]>(this.instructors);

  instructors$ = this.instructorsSubject.asObservable();

  getInstructors() {
    return this.instructors$;
  }

  addInstructor(instructor: Instructor) {
    this.instructors.push({
      ...instructor,
      id: Date.now()
    });
    this.instructorsSubject.next(this.instructors);
  }

  updateInstructor(updated: Instructor) {
    this.instructors = this.instructors.map(i =>
      i.id === updated.id ? updated : i
    );
    this.instructorsSubject.next(this.instructors);
  }

  deleteInstructor(id: number) {
    this.instructors = this.instructors.filter(i => i.id !== id);
    this.instructorsSubject.next(this.instructors);
  }

  getInstructorById(id: number) {
    return this.instructors.find(i => i.id === id);
  }
}
