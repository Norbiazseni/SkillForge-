import { TestBed } from '@angular/core/testing';

import { Instructors } from './instructors';

describe('Instructors', () => {
  let service: Instructors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Instructors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
