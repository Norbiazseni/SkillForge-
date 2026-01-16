import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../service/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html'
})
export class Contact {
  private contactService = inject(ContactService);

  submitted = false;

  form!: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const contactData = this.form.value;
    console.log('Contact form data:', contactData);

    this.contactService.sendMessage(contactData).subscribe({
      next: (response) => {
        console.log('✅ Message sent successfully:', response);
        this.submitted = true;
        this.form.reset();
      },
      error: (error) => {
        console.error('❌ Failed to send message:', error);
      }
    });
  }
}
