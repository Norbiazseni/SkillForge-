# 🔗 Frontend Összekapcsolás - Gyors Útmutató

## ✅ Mit már megcsináltál (Backend):

- ✅ Laravel backend működik
- ✅ REST API 11 endpoint (Courses, Students, Contact)
- ✅ MySQL adatbázis
- ✅ GitHub-ra feltöltve (backend branch)

---

## 🎯 Mit kell most csinálnod (3 lehetőség):

### **1️⃣ LEGGYORSABB: Egyszerű HTML Teszt (5 perc)**

Már kész van! Kipróbálhatod azonnal:

```bash
# Backend indítása (ha még nem fut)
cd c:\xampp\htdocs\skillforge-backend
php artisan serve
```

Nyisd meg böngészőben:
```
http://127.0.0.1:8000/frontend-test.html
```

**Mit látsz:**
- ✅ Kapcsolat teszt
- ✅ Kurzusok listázása
- ✅ Hallgatók listázása
- ✅ Új kurzus létrehozása

---

### **2️⃣ AJÁNLOTT: React/Next.js Frontend (30 perc)**

#### Lépések:

**1. Frontend projekt létrehozása**
```bash
# Új mappában (NEM a backend mappában!)
npx create-next-app@latest skillforge-frontend
cd skillforge-frontend
```

**2. API URL beállítása**

Fájl: `.env.local`
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

**3. API Client létrehozása**

Fájl: `lib/api.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const coursesAPI = {
  getAll: () => fetch(`${API_URL}/courses`).then(r => r.json()),
  getOne: (id: number) => fetch(`${API_URL}/courses/${id}`).then(r => r.json()),
  create: (data: any) => fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
};
```

**4. Component készítése**

Fájl: `app/page.tsx`
```typescript
'use client';
import { useEffect, useState } from 'react';
import { coursesAPI } from '@/lib/api';

export default function Home() {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    coursesAPI.getAll().then(data => setCourses(data.data));
  }, []);
  
  return (
    <div>
      <h1>Kurzusok ({courses.length})</h1>
      {courses.map((course: any) => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}
```

**5. Indítás**
```bash
npm run dev
```

Megnyílik: http://localhost:3000

---

### **3️⃣ PROFI: Teljes Monorepo (1 óra)**

Ha mindent egy helyen akarsz:

```bash
# 1. Új főmappa
mkdir SkillForge
cd SkillForge

# 2. Backend mozgatása
move c:\xampp\htdocs\skillforge-backend backend

# 3. Frontend létrehozása
npx create-next-app@latest frontend

# 4. Git
git init
git add .
git commit -m "Monorepo: Backend + Frontend"
git remote add origin https://github.com/Norbiazseni/SkillForge-.git
git push -u origin main
```

---

## 🔧 CORS Beállítás (Fontos!)

A `config/cors.php` már kész! Ellenőrizd:

```php
'allowed_origins' => ['*'], // Fejlesztéshez OK
```

Élesben cseréld le:
```php
'allowed_origins' => ['https://your-frontend-domain.com'],
```

---

## ✅ Tesztelési Checklist

**Backend:**
- [ ] `php artisan serve` fut
- [ ] http://127.0.0.1:8000/api/courses működik böngészőben
- [ ] JSON adatok látszódnak

**Frontend:**
- [ ] Projekt létrehozva
- [ ] `.env.local` beállítva
- [ ] `npm run dev` fut
- [ ] http://localhost:3000 megnyílik

**Kapcsolat:**
- [ ] http://127.0.0.1:8000/frontend-test.html ✅ zöld
- [ ] Kurzusok listázódnak
- [ ] Új kurzus létrehozható

---

## 🐛 Ha valami nem működik:

### Probléma: CORS hiba
```
Access to fetch blocked by CORS policy
```

**Megoldás:**
```bash
php artisan config:clear
php artisan cache:clear
```

### Probléma: Connection refused
```
Failed to fetch
```

**Ellenőrizd:**
- Backend fut? (`php artisan serve`)
- Helyes URL? (`http://127.0.0.1:8000`)

### Probléma: 404 Not Found

**Ellenőrizd:**
```bash
php artisan route:list | findstr api
```

---

## 📚 Dokumentációk

- **Részletes útmutató:** `FRONTEND_OSSZEKAPCSOLAS.md`
- **WebSocket setup:** `WEBSOCKET_SETUP.md`
- **API dokumentáció:** `API_DOCUMENTATION.md`
- **Postman tesztek:** `SkillForge_API.postman_collection.json`

---

## 🎯 Következő Lépések

1. **Most:** Próbáld ki a `frontend-test.html` oldalt
2. **Később:** Készíts React/Next.js projektet
3. **Végül:** Deploy-old (Vercel/Netlify frontend + backend hosting)

---

## 💡 Tippek

- **Fejlesztéshez:** Használj `http://127.0.0.1:8000` (ne localhost)
- **Git:** Backend és frontend külön branch-eken vagy külön repo-kban
- **Deployment:** Frontend → Vercel, Backend → Laravel Forge/DigitalOcean
- **WebSocket:** Ha kell valós idejű frissítés → Laravel Reverb

---

## ✅ Összefoglalás

| Amit most csinálsz | Időigény | Nehézség |
|-------------------|----------|----------|
| HTML teszt kipróbálása | 2 perc | ⭐ Egyszerű |
| React projekt indítás | 30 perc | ⭐⭐ Közepes |
| Teljes monorepo | 1 óra | ⭐⭐⭐ Haladó |

**Start:** http://127.0.0.1:8000/frontend-test.html 🚀
