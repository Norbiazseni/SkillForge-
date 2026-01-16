# 🔗 Frontend-Backend Összekötés - Útmutató a Frontend Csapatnak

## 📋 Helyzet

**Backend repo:** https://github.com/Norbiazseni/SkillForge- (backend branch)  
**Frontend repo:** (A ti GitHub repótok)

**Backend URL (fejlesztés):** http://127.0.0.1:8000  
**API Base URL:** http://127.0.0.1:8000/api

---

## 🎯 Mit kell csinálni a Frontend oldalon?

### 1️⃣ Backend Clone és Indítás (Lokális fejlesztéshez)

Minden frontend fejlesztőnek le kell klónozni a backendet is lokálisan:

```bash
# Backend klónozása
git clone https://github.com/Norbiazseni/SkillForge-.git skillforge-backend
cd skillforge-backend
git checkout backend

# Laravel telepítése
composer install

# .env fájl beállítása
copy .env.example .env
php artisan key:generate

# Adatbázis setup (SQLite vagy MySQL)
# SQLite (egyszerűbb):
touch database/database.sqlite
# Vagy MySQL (lásd .env fájl)

# Migrációk futtatása
php artisan migrate --seed

# Backend indítása
php artisan serve
```

**Backend elérhető:** http://127.0.0.1:8000

---

### 2️⃣ Angular Frontend Beállítás

#### A) Environment fájl beállítása

**Fájl:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  backendUrl: 'http://127.0.0.1:8000',
};
```

**Fájl:** `src/environments/environment.prod.ts` (éles verzió)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api',
  backendUrl: 'https://your-backend-domain.com',
};
```

---

#### B) HTTP Interceptor (opcionális, de ajánlott)

**Fájl:** `src/app/interceptors/api.interceptor.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ha relatív URL, hozzáadjuk az API base URL-t
    if (!request.url.startsWith('http')) {
      request = request.clone({
        url: `${environment.apiUrl}${request.url}`,
        setHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
    }
    
    return next.handle(request);
  }
}
```

**Regisztrálás:** `app.config.ts` vagy `app.module.ts`

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true,
  },
]
```

---

#### C) API Service létrehozása

**Fájl:** `src/app/services/courses.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor_id: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  /**
   * Összes kurzus lekérése szűrőkkel
   */
  getCourses(params?: {
    search?: string;
    status?: string;
    difficulty?: string;
    instructor_id?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Observable<PaginatedResponse<Course>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<Course>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Egy kurzus lekérése ID alapján
   */
  getCourse(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Új kurzus létrehozása
   */
  createCourse(course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(this.apiUrl, course);
  }

  /**
   * Kurzus frissítése
   */
  updateCourse(id: number, course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/${id}`, course);
  }

  /**
   * Kurzus törlése
   */
  deleteCourse(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
```

---

#### D) Students Service

**Fájl:** `src/app/services/students.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  courses_count?: number;
  courses?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(params?: { search?: string; per_page?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getStudent(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: { name: string; email: string }) {
    return this.http.post<any>(this.apiUrl, student);
  }

  updateStudent(id: number, student: { name?: string; email?: string }) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

---

#### E) Component példa

**Fájl:** `src/app/components/courses-list/courses-list.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CoursesService, Course } from '../../services/courses.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error: string | null = null;
  
  // Szűrők
  searchTerm = '';
  selectedStatus = '';
  selectedDifficulty = '';
  currentPage = 1;
  perPage = 10;
  total = 0;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.error = null;

    this.coursesService.getCourses({
      search: this.searchTerm,
      status: this.selectedStatus,
      difficulty: this.selectedDifficulty,
      page: this.currentPage,
      per_page: this.perPage,
      sort_by: 'created_at',
      sort_order: 'desc'
    }).subscribe({
      next: (response) => {
        this.courses = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a kurzusok betöltése közben';
        this.loading = false;
        console.error('API Error:', err);
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadCourses();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadCourses();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCourses();
  }

  deleteCourse(id: number) {
    if (confirm('Biztosan törölni szeretnéd ezt a kurzust?')) {
      this.coursesService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses(); // Lista frissítése
          alert('Kurzus sikeresen törölve!');
        },
        error: (err) => {
          alert('Hiba: ' + (err.error?.message || 'Nem sikerült törölni'));
        }
      });
    }
  }
}
```

**Template:** `courses-list.component.html`

```html
<div class="courses-container">
  <h1>Kurzusok ({{ total }})</h1>
  
  <!-- Keresés és szűrők -->
  <div class="filters">
    <input 
      type="text" 
      [(ngModel)]="searchTerm" 
      (keyup.enter)="onSearch()"
      placeholder="Keresés..."
    >
    
    <select [(ngModel)]="selectedStatus" (change)="onFilterChange()">
      <option value="">Összes státusz</option>
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
    
    <select [(ngModel)]="selectedDifficulty" (change)="onFilterChange()">
      <option value="">Összes nehézség</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
    
    <button (click)="onSearch()">Keresés</button>
  </div>

  <!-- Loading -->
  <div *ngIf="loading" class="loading">Betöltés...</div>

  <!-- Error -->
  <div *ngIf="error" class="error">{{ error }}</div>

  <!-- Kurzusok listája -->
  <div *ngIf="!loading && !error" class="courses-grid">
    <div *ngFor="let course of courses" class="course-card">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <div class="badges">
        <span class="badge badge-status">{{ course.status }}</span>
        <span class="badge badge-difficulty">{{ course.difficulty }}</span>
      </div>
      <div class="actions">
        <button [routerLink]="['/courses', course.id]">Megtekintés</button>
        <button (click)="deleteCourse(course.id)">Törlés</button>
      </div>
    </div>
  </div>

  <!-- Üres állapot -->
  <div *ngIf="!loading && courses.length === 0" class="empty-state">
    Nincs megjeleníthető kurzus
  </div>
</div>
```

---

### 3️⃣ API Endpoints (Amit használhattok)

#### **Courses API:**

```typescript
// GET - Lista szűréssel
GET /api/courses?search=web&status=published&difficulty=beginner&per_page=10&page=1

// GET - Egy kurzus
GET /api/courses/1

// POST - Új kurzus
POST /api/courses
Body: {
  "title": "Angular Kurzus",
  "description": "Angular alapok",
  "status": "published",
  "difficulty": "beginner",
  "instructor_id": 1
}

// PUT - Kurzus frissítése
PUT /api/courses/1
Body: {
  "title": "Frissített cím"
}

// DELETE - Kurzus törlése
DELETE /api/courses/1
```

#### **Students API:**

```typescript
// GET - Hallgatók listája
GET /api/students?search=john&per_page=20

// GET - Egy hallgató
GET /api/students/1

// POST - Új hallgató
POST /api/students
Body: {
  "name": "John Doe",
  "email": "john@example.com"
}

// PUT - Hallgató frissítése
PUT /api/students/1
Body: {
  "name": "Jane Doe"
}

// DELETE - Hallgató törlése
DELETE /api/students/1
```

#### **Contact API:**

```typescript
// GET - Kapcsolati üzenetek
GET /api/contact?per_page=50

// POST - Új üzenet
POST /api/contact
Body: {
  "name": "Nagy Péter",
  "email": "peter@example.com",
  "message": "Érdeklődnék a kurzusokról"
}
```

---

### 4️⃣ Tesztelés

#### A) Backend kapcsolat ellenőrzése

```bash
# 1. Backend indítása (backend fejlesztő gépe vagy lokálisan mindenki)
cd skillforge-backend
php artisan serve

# 2. Teszt böngészőben
http://127.0.0.1:8000/api/courses
```

Láthatónak kell lennie egy JSON válasznak a kurzusokkal.

#### B) Frontend-Backend teszt

```bash
# Frontend indítása
cd skillforge-frontend
ng serve

# Megnyitás
http://localhost:4200
```

**Developer Tools Console-ban teszteld:**

```javascript
fetch('http://127.0.0.1:8000/api/courses')
  .then(r => r.json())
  .then(data => console.log(data));
```

Ha látod a kurzusokat → **Működik!** ✅

---

## 🔧 Troubleshooting

### Probléma 1: CORS hiba

```
Access to fetch at 'http://127.0.0.1:8000/api/courses' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Megoldás (Backend oldalon):**

```bash
cd skillforge-backend
php artisan config:clear
php artisan cache:clear
```

Ellenőrizd `config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
],
```

---

### Probléma 2: 404 Not Found

**Ellenőrzés:**

```bash
cd skillforge-backend
php artisan route:list | findstr api
```

---

### Probléma 3: Connection Refused

**Ellenőrizd:**
- Backend fut-e: `php artisan serve`
- Helyes port: `8000`
- Helyes URL: `http://127.0.0.1:8000` (NE `localhost`)

---

## 📦 Git Workflow

### Backend fejlesztő (Te):

```bash
cd skillforge-backend
git add .
git commit -m "CORS config frissítés frontend-hez"
git push origin backend
```

### Frontend fejlesztők:

```bash
cd skillforge-frontend
git add .
git commit -m "API service és környezeti változók beállítása"
git push origin main
```

**Mindenkinek lokálisan kell futtatnia mindkét szervert fejlesztés közben!**

---

## ✅ Checklist - Működik az összekapcsolás?

**Backend:**
- [ ] `php artisan serve` fut
- [ ] http://127.0.0.1:8000/api/courses JSON-t ad vissza
- [ ] CORS config tartalmazza `http://localhost:4200`

**Frontend:**
- [ ] `environment.ts` beállítva API URL-lel
- [ ] Service osztályok elkészültek
- [ ] `ng serve` fut
- [ ] Developer Tools Network tab-ban látszik az API hívás

**Kapcsolat:**
- [ ] Nincs CORS hiba
- [ ] Kurzusok megjelennek a frontend-en
- [ ] CRUD műveletek működnek

---

## 🎯 Összefoglalás

1. **Backend fejlesztő (Te):**
   - ✅ CORS beállítva (`config/cors.php`)
   - ✅ API dokumentáció megírva
   - ✅ Backend GitHub-ra feltöltve

2. **Frontend fejlesztők:**
   - [ ] Backend klónozása lokálisan
   - [ ] `environment.ts` beállítása
   - [ ] Service osztályok létrehozása
   - [ ] API hívások implementálása

3. **Mindenki:**
   - Lokálisan futtatja mindkét szervert fejlesztés közben
   - Backend: `php artisan serve` (port 8000)
   - Frontend: `ng serve` (port 4200)

**Deployment:** Később éles szerverre kerül mindkettő, akkor frissítitek az URL-eket.

---

## 📚 További dokumentációk

A backend repo-ban találhatóak:
- `API_DOCUMENTATION.md` - Teljes API leírás
- `POSTMAN_IMPORT.md` - Postman collection
- `SkillForge_API.postman_collection.json` - Importálható Postman fájl

**Minden megvan az összekapcsoláshoz!** 🚀
