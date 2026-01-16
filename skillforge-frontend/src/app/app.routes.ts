import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CoursesList } from './features/courses/courses-list/courses-list';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail';
import { CourseFormComponent } from './features/courses/course-form/course-form';
import { StudentsList } from './features/students/students-list/students-list';
import { StudentForm } from './features/students/student-form/student-form';
import { InstructorsList } from './features/instructors/instructors-list/instructors-list';
import { InstructorForm } from './features/instructors/instructor-form/instructor-form';
import { Contact } from './features/contact/contact/contact';
import { About } from './features/about/about/about';

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
    { path: 'instructors', component: InstructorsList },
    { path: 'instructors/new', component: InstructorForm },
    { path: 'instructors/:id/edit', component: InstructorForm },
    { path: 'contact', component: Contact },
    { path: 'about', component: About },


];
