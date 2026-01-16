import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorsService } from '../service/instructors';
import { Instructor } from '../../../models/instructor-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructors-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './instructors-list.html'
})
export class InstructorsList implements OnInit {

  instructors: Instructor[] = [];

  constructor(private instructorsService: InstructorsService) {}

  ngOnInit() {
    this.instructorsService.getInstructors()
      .subscribe(data => this.instructors = data);
  }

  delete(id: number) {
    this.instructorsService.deleteInstructor(id);
  }
}
