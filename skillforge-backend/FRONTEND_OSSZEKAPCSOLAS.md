# 🔗 SkillForge Backend - Frontend Összekapcsolási Útmutató

## 📂 Projekt Struktúra Lehetőségek

### **1. Ajánlott Megoldás: Monorepo (Egy GitHub repo)**

```
SkillForge/
├── backend/          # Laravel backend
│   ├── app/
│   ├── config/
│   ├── routes/
│   └── ...
├── frontend/         # React/Next.js/Vue frontend
│   ├── src/
│   ├── public/
│   └── ...
└── README.md
```

**Előnyök:**
- ✅ Egy helyen van minden
- ✅ Könnyebb verziókezelés
- ✅ Egyszerűbb deployment

---

### **2. Másik Megoldás: Külön GitHub repók**

```
SkillForge-Backend (github.com/user/skillforge-backend)
SkillForge-Frontend (github.com/user/skillforge-frontend)
```

**Előnyök:**
- ✅ Szeparált kódbázis
- ✅ Külön deployment pipeline-ok
- ✅ Független fejlesztés

---

## 🚀 GYORS ÚTMUTATÓ: Backend-Frontend Összekapcsolás

### ✅ BACKEND OLDAL (Amit már megcsináltál):

#### 1. Laravel backend fut
```bash
cd c:\xampp\htdocs\skillforge-backend
php artisan serve
```
**Backend elérhető:** http://127.0.0.1:8000

#### 2. CORS beállítása (FONTOS!)

**Fájl:** `config/cors.php` (Ha nincs, hozd létre!)

```php
<?php

return [
    'paths' => ['api/*', 'broadcasting/auth'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => ['*'], // Fejlesztéshez
    // Élesben: ['https://your-frontend-domain.com']
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => false,
];
```

**Vagy egyszerűbben a `.env` fájlban:**
```env
# Backend URL
APP_URL=http://127.0.0.1:8000

# CORS - Frontend domain engedélyezése
FRONTEND_URL=http://localhost:3000
```

#### 3. API Endpointok (Már készen vannak!):
```
✅ GET    /api/courses
✅ POST   /api/courses
✅ GET    /api/courses/{id}
✅ PUT    /api/courses/{id}
✅ DELETE /api/courses/{id}

✅ GET    /api/students
✅ POST   /api/students
✅ GET    /api/students/{id}
✅ PUT    /api/students/{id}
✅ DELETE /api/students/{id}

✅ GET    /api/contact
✅ POST   /api/contact
```

---

### 🎨 FRONTEND OLDAL:

## Példa 1: React / Next.js Frontend

### 1️⃣ Projekt létrehozása

```bash
# Next.js projekt
npx create-next-app@latest skillforge-frontend
cd skillforge-frontend

# Vagy React + Vite
npm create vite@latest skillforge-frontend -- --template react-ts
cd skillforge-frontend
npm install
```

### 2️⃣ Környezeti változók

**Fájl:** `.env.local` (Next.js) vagy `.env` (Vite)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

### 3️⃣ API Client létrehozása

**Fájl:** `lib/api.ts` vagy `src/api/client.ts`

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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

// Fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Courses API
export const coursesAPI = {
  // Összes kurzus lekérése
  getAll: (params?: { status?: string; difficulty?: string; per_page?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI<{ data: Course[]; total: number }>(`/courses?${query}`);
  },

  // Egy kurzus lekérése
  getOne: (id: number) => 
    fetchAPI<{ data: Course }>(`/courses/${id}`),

  // Új kurzus létrehozása
  create: (data: Partial<Course>) =>
    fetchAPI<{ data: Course; message: string }>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Kurzus frissítése
  update: (id: number, data: Partial<Course>) =>
    fetchAPI<{ data: Course; message: string }>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Kurzus törlése
  delete: (id: number) =>
    fetchAPI<{ message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    }),
};
```

### 4️⃣ React Component példa

**Fájl:** `app/courses/page.tsx` (Next.js App Router)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { coursesAPI, Course } from '@/lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll({ per_page: 20 });
      setCourses(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>Hiba: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kurzusok ({courses.length})</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {course.difficulty}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5️⃣ Frontend indítása

```bash
npm run dev
```

**Frontend fut:** http://localhost:3000

---

## 📝 EGYSZERŰ HTML+JavaScript Teszt (Azonnali)

Ha csak gyorsan ki akarod próbálni:

**Fájl:** `public/test-frontend.html` (a backend mappádban!)

```html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>SkillForge API Teszt</title>
    <style>
        body { font-family: Arial; max-width: 1200px; margin: 50px auto; padding: 20px; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; 
                 margin: 10px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .course { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .course h3 { margin: 0 0 10px 0; color: #007bff; }
    </style>
</head>
<body>
    <h1>🚀 SkillForge - Frontend Teszt</h1>
    
    <button onclick="loadCourses()">📚 Kurzusok betöltése</button>
    <button onclick="createCourse()">➕ Teszt kurzus létrehozása</button>
    
    <h2>Kurzusok:</h2>
    <div id="courses"></div>

    <script>
        const API_URL = 'http://127.0.0.1:8000/api';

        async function loadCourses() {
            try {
                const response = await fetch(`${API_URL}/courses`);
                const data = await response.json();
                
                const coursesDiv = document.getElementById('courses');
                coursesDiv.innerHTML = data.data.map(course => `
                    <div class="course">
                        <h3>${course.title}</h3>
                        <p>${course.description}</p>
                        <span>📊 ${course.difficulty}</span> | 
                        <span>📌 ${course.status}</span>
                    </div>
                `).join('');
                
                console.log('Kurzusok:', data);
            } catch (error) {
                alert('Hiba: ' + error.message);
            }
        }

        async function createCourse() {
            const newCourse = {
                title: 'Frontend Teszt Kurzus',
                description: 'Tesztelés a frontendről',
                status: 'published',
                difficulty: 'beginner',
                instructor_id: 1
            };

            try {
                const response = await fetch(`${API_URL}/courses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCourse)
                });
                
                const data = await response.json();
                alert('✅ Kurzus létrehozva: ' + data.data.title);
                loadCourses(); // Lista frissítése
            } catch (error) {
                alert('Hiba: ' + error.message);
            }
        }

        // Automatikus betöltés
        loadCourses();
    </script>
</body>
</html>
```

**Használat:**
```bash
# Backend indítása
cd c:\xampp\htdocs\skillforge-backend
php artisan serve

# Böngészőben nyisd meg:
http://127.0.0.1:8000/test-frontend.html
```

---

## 🐛 TROUBLESHOOTING

### Probléma 1: CORS hiba
```
Access to fetch has been blocked by CORS policy
```

**Megoldás:**
```bash
# Backend mappában
php artisan config:clear
```

Ellenőrizd a `config/cors.php` fájlt (lásd fent).

### Probléma 2: 404 Not Found
```
GET http://127.0.0.1:8000/api/courses 404
```

**Ellenőrzés:**
```bash
php artisan route:list | findstr courses
```

### Probléma 3: Connection refused

**Ellenőrizd:**
- Backend fut-e: `php artisan serve`
- Helyes port: `8000`
- API URL helyes: `http://127.0.0.1:8000/api`

---

## ✅ CHECKLIST - Működik?

1. **Backend:**
   - [ ] `php artisan serve` fut
   - [ ] http://127.0.0.1:8000/api/courses megnyílik böngészőben
   - [ ] JSON válasz látszik

2. **Frontend:**
   - [ ] Projekt létrehozva és telepítve
   - [ ] `.env` fájl beállítva API URL-lel
   - [ ] `npm run dev` fut
   - [ ] Fetch hívások működnek

3. **Kapcsolat:**
   - [ ] CORS nincs hiba
   - [ ] Kurzusok megjelennek a frontend-en
   - [ ] POST/PUT/DELETE műveletek működnek

---

## 📦 Git Stratégia

### Ha monorepo-t szeretnél:

```bash
# Projekt gyökér létrehozása
mkdir SkillForge
cd SkillForge

# Backend mozgatása
mv c:\xampp\htdocs\skillforge-backend ./backend

# Frontend létrehozása
npx create-next-app@latest frontend

# Git init
git init
git add .
git commit -m "Initial commit: Backend + Frontend"
git branch -M main
git remote add origin https://github.com/Norbiazseni/SkillForge-.git
git push -u origin main
```

### Ha külön repók:

```bash
# Backend már fent van: SkillForge- repo, backend branch

# Új frontend repo
mkdir skillforge-frontend
cd skillforge-frontend
npx create-next-app@latest .
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/Norbiazseni/SkillForge-Frontend.git
git push -u origin main
```

---

## 🎯 ÖSSZEFOGLALÁS

1. **Backend már kész** ✅
   - REST API működik
   - 11 endpoint elérhető

2. **Frontend létrehozása**
   - Next.js/React projekt (`npx create-next-app`)
   - `.env.local` beállítása API URL-lel
   - API client írása (`lib/api.ts`)

3. **Összekapcsolás**
   - CORS beállítása (backend)
   - Fetch/Axios használata (frontend)
   - Tesztelés

4. **Git/GitHub**
   - Monorepo VAGY külön repók
   - Push mindkettő

**Kész! A backend-frontend összekapcsolás működik!** 🚀
