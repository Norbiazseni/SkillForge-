import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './services/dashboard';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  totalCourses$: Observable<number>;
  activeCourses$: Observable<number>;
  completedCourses$: Observable<number>;


  constructor(private dashboardService: DashboardService) {
    this.totalCourses$ = this.dashboardService.totalCourses$;
    this.activeCourses$ = this.dashboardService.activeCourses$;
    this.completedCourses$ = this.dashboardService.completedCourses$;
  }

  ngOnInit() {
    // Initialize if needed
  }
}
