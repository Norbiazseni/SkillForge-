import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetailComponent {

  courseId!: string;

  constructor(private route: ActivatedRoute) {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
  }
}
