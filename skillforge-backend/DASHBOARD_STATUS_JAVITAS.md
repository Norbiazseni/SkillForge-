# 🔧 SkillForge - Dashboard Active/Completed Courses Javítás

## ❌ Probléma

A **Dashboard**-on az **Active Courses** és **Completed Courses** értéke **0** volt, pedig voltak kurzusok az adatbázisban.

```
Total Courses: 11      ✅ JÓ
Active Courses: 0      ❌ ROSSZ (kellene: 11)
Completed Courses: 0   ❌ ROSSZ
```

---

## 🔍 Probléma Oka

### **Frontend ≠ Backend státuszok**

#### Backend státuszok (Laravel):
```php
// database/migrations/create_courses_table.php
enum('status', ['draft', 'published', 'archived'])
```

#### Frontend várt státuszok (Angular):
```typescript
// dashboard.service.ts
c.status === 'active'      // ❌ Nem létezik a backend-en!
c.status === 'completed'   // ❌ Nem létezik a backend-en!
```

#### Backend valódi adatok:
```json
{
  "id": 12,
  "title": "abyad",
  "status": "published"    // Backend 'published'-et küld
}
```

---

## ✅ Megoldás

### 1. **Course Model Interface Bővítése**

`src/app/models/courses-model.ts`:

```typescript
export interface Course {
  id: number;
  title: string;
  description: string;
  // ✅ 'archived' hozzáadva
  status: 'planned' | 'active' | 'completed' | 'published' | 'draft' | 'archived';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructor_id?: number;
  instructor?: any;
  created_at?: string;
  updated_at?: string;
}
```

### 2. **Dashboard Service Javítás**

`src/app/features/dashboard/services/dashboard.ts`:

```typescript
constructor(private coursesService: CoursesService) {
  this.totalCourses$ = this.coursesService.courses$
    .pipe(
      map(courses => courses.length)
    );

  // ✅ Active = published (backend státusz)
  this.activeCourses$ = this.coursesService.courses$
    .pipe(
      map(courses =>
        courses.filter(c => 
          c.status === 'active' || c.status === 'published'
        ).length
      )
    );

  // ✅ Completed = archived (backend státusz)
  this.completedCourses$ = this.coursesService.courses$
    .pipe(
      map(courses =>
        courses.filter(c => 
          c.status === 'completed' || c.status === 'archived'
        ).length
      )
    );
}
```

### 3. **Dashboard HTML Frissítés** (opcionális)

`src/app/features/dashboard/dashboard.html`:

```html
<div class="card">
  <h3>Active Courses</h3>
  <p>{{ activeCourses$ | async }}</p>
  <small>(Published courses)</small>  <!-- Info szöveg -->
</div>

<div class="card">
  <h3>Completed Courses</h3>
  <p>{{ completedCourses$ | async }}</p>
  <small>(Archived courses)</small>   <!-- Info szöveg -->
</div>
```

---

## 📊 Státusz Mapping

| Frontend elnevezés | Backend státuszok        | Magyarázat                |
|--------------------|--------------------------|---------------------------|
| **Active**         | `published` vagy `active`| Aktív, futó kurzusok      |
| **Completed**      | `archived` vagy `completed` | Lezárt, archivált kurzusok |
| **Draft**          | `draft`                  | Vázlat, még nem publikus  |

---

## 🧪 Tesztelés

### 1. Backend adatok ellenőrzése

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/courses" | 
  Select-Object -ExpandProperty data | 
  Group-Object status | 
  Select-Object Name, Count
```

**Eredmény:**
```
Name      Count
----      -----
published    11
draft         0
archived      0
```

### 2. Frontend Dashboard

Frissítsd a böngészőt (Ctrl + F5):

```
Total Courses: 11      ✅
Active Courses: 11     ✅ (published kurzusok)
Completed Courses: 0   ✅ (nincs archived)
```

---

## 🎯 További Lehetőségek

### Opció 1: Backend és Frontend szinkronizálás

**Backend státuszok egységesítése:**

```php
// Migration módosítás
enum('status', ['draft', 'active', 'completed'])

// Vagy:
enum('status', ['draft', 'published', 'archived'])
```

### Opció 2: Frontend státusz mapping service

```typescript
export class StatusMappingService {
  mapToFrontend(backendStatus: string): string {
    const mapping: Record<string, string> = {
      'published': 'active',
      'archived': 'completed',
      'draft': 'draft'
    };
    return mapping[backendStatus] || backendStatus;
  }
}
```

---

## 📝 Módosított Fájlok

### Frontend:
1. ✅ `src/app/models/courses-model.ts`
2. ✅ `src/app/features/dashboard/services/dashboard.ts`
3. ✅ `src/app/features/dashboard/dashboard.html`

---

## 🎉 Eredmény

Most a Dashboard **helyesen számolja** az Active és Completed kurzusokat!

**Státusz egyeztetés:**
- ✅ Frontend 'active' = Backend 'published'
- ✅ Frontend 'completed' = Backend 'archived'
- ✅ Mindkét státusz ellenőrzésre kerül

---

## 💡 Tanulság

**Mindig ellenőrizd a Backend-Frontend státusz egyeztetést!**

1. ✅ Backend migration/model dokumentáció
2. ✅ Frontend interface definíció
3. ✅ API response ellenőrzés
4. ✅ TypeScript union type-ok pontosítása

---

**Dátum:** 2026-01-16  
**Javítás:** Dashboard státusz mapping + Course model interface
