import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../sevice/students';
import { Student } from '../../../models/students-model';
import { RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './students-list.html'
})
export class StudentsList implements OnInit {

  students$!: Observable<Student[]>;

  private searchTerm$ = new BehaviorSubject<string>('');
  private sortBy$ = new BehaviorSubject<'name' | 'email'>('name');

  filteredStudents$!: Observable<Student[]>;

  constructor(private studentsService: StudentsService) {
    this.students$ = this.studentsService.getStudents();

    this.filteredStudents$ = combineLatest([
      this.students$,
      this.searchTerm$.pipe(debounceTime(300)),
      this.sortBy$
    ]).pipe(
      map(([students, search, sort]) => {

        let result = students.filter((s: Student) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        );

        result = result.sort((a: Student, b: Student) =>
          a[sort].localeCompare(b[sort])
        );

        return result;
      })
    );
  }

  ngOnInit() {}

  setSearch(value: string) {
    this.searchTerm$.next(value);
  }

  setSort(value: 'name' | 'email') {
    this.sortBy$.next(value);
  }

  delete(id: number) {
    this.studentsService.deleteStudent(id);
  }
}