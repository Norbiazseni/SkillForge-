import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorForm } from './instructor-form';

describe('InstructorForm', () => {
  let component: InstructorForm;
  let fixture: ComponentFixture<InstructorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
