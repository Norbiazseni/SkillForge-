import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CoursesList } from './features/courses/courses-list/courses-list';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail';
import { CourseForm } from './features/courses/course-form/course-form';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'dashboard', component: Dashboard },
    { path: 'courses', component: CoursesList },
    { path: 'courses/new', component: CourseForm },
    { path: 'courses/:id', component: CourseDetailComponent },

];
