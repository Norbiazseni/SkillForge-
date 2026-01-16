import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InstructorsService } from '../service/instructors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-instructor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructor-form.html'
})
export class InstructorForm {

  isEdit = false;
  instructorId?: number;

  form!: any;

  constructor(
    private fb: FormBuilder,
    private instructorsService: InstructorsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      expertise: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.instructorId = +id;
      const instructor = this.instructorsService.getInstructorById(+id);
      if (instructor) {
        this.form.patchValue(instructor);
      }
    }
  }

  submit() {
    if (this.form.invalid) return;

    const instructor = {
      id: this.instructorId ?? Date.now(),
      ...this.form.value!
    };

    this.isEdit
      ? this.instructorsService.updateInstructor(instructor)
      : this.instructorsService.addInstructor(instructor);

    this.router.navigate(['/instructors']);
  }
}
