import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CoursesList } from './features/courses/courses-list/courses-list';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail';
import { CourseFormComponent } from './features/courses/course-form/course-form';
import { StudentsList } from './features/students/students-list/students-list';
import { StudentForm } from './features/students/student-form/student-form';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'dashboard', component: Dashboard },
    { path: 'courses', component: CoursesList },
    { path: 'courses/:id/edit', component: CourseFormComponent },
    { path: 'courses/new', component: CourseFormComponent },
    { path: 'courses/:id', component: CourseDetailComponent },
    { path: 'students', component: StudentsList },
    { path: 'students/new', component: StudentForm },
    { path: 'students/:id/edit', component: StudentForm },


];
