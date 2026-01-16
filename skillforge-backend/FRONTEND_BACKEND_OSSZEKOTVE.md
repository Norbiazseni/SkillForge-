# 🎯 SkillForge - Frontend-Backend Összekötési Útmutató

## ✅ Elkészült Változtatások

### 🔧 Backend Módosítások

#### 1. **InstructorController, Service, Repository létrehozva**
- `app/Http/Controllers/InstructorController.php`
- `app/Services/InstructorService.php`
- `app/Repositories/InstructorRepository.php`
- `app/Http/Requests/StoreInstructorRequest.php`
- `app/Http/Requests/UpdateInstructorRequest.php`

#### 2. **API Routes frissítve**
- `routes/api.php` - Hozzáadva az `/api/instructors` endpoint-ok

#### 3. **CORS konfiguráció** ✅ Már be volt állítva
- `config/cors.php` - Angular (port 4200) engedélyezve

---

### 🎨 Frontend Módosítások

#### 1. **Environment fájlok létrehozva**
- `src/environments/environment.ts` - API URL: `http://127.0.0.1:8000/api`
- `src/environments/environment.prod.ts` - Production API URL

#### 2. **HttpClient konfiguráció**
- `src/app/app.config.ts` - `provideHttpClient(withFetch())` hozzáadva

#### 3. **Services átírva valódi API hívásokra**
- ✅ `src/app/features/courses/services/courses.ts`
- ✅ `src/app/features/students/sevice/students.ts`
- ✅ `src/app/features/instructors/service/instructors.ts`
- ✅ `src/app/features/contact/service/contact.service.ts` (új)

#### 4. **Contact Component frissítve**
- `src/app/features/contact/contact/contact.ts` - API integráció

---

## 🚀 Indítási Lépések

### 1. **Backend Indítása**

```powershell
# Terminal 1: Backend
cd c:\xampp\htdocs\SkillForge-\skillforge-backend

# Ellenőrizd, hogy az adatbázis létezik
php artisan migrate --seed

# Indítsd el a szervert
php artisan serve
```

✅ **Backend fut:** http://127.0.0.1:8000

---

### 2. **Frontend Indítása**

```powershell
# Terminal 2: Frontend
cd c:\xampp\htdocs\SkillForge-\skillforge-frontend

# Telepítsd a csomagokat (ha még nem tetted)
npm install

# Indítsd el az Angular dev szervert
npm start
# vagy
ng serve
```

✅ **Frontend fut:** http://localhost:4200

---

## 🔌 API Endpoint-ok

### Courses
```
GET     /api/courses          - Lista
POST    /api/courses          - Létrehozás
GET     /api/courses/{id}     - Egy kurzus
PUT     /api/courses/{id}     - Módosítás
DELETE  /api/courses/{id}     - Törlés
```

### Students
```
GET     /api/students         - Lista
POST    /api/students         - Létrehozás
GET     /api/students/{id}    - Egy diák
PUT     /api/students/{id}    - Módosítás
DELETE  /api/students/{id}    - Törlés
```

### Instructors
```
GET     /api/instructors      - Lista
POST    /api/instructors      - Létrehozás
GET     /api/instructors/{id} - Egy oktató
PUT     /api/instructors/{id} - Módosítás
DELETE  /api/instructors/{id} - Törlés
```

### Contact
```
POST    /api/contact          - Üzenet küldés
GET     /api/contact          - Üzenetek (admin)
```

---

## 🧪 Tesztelés

### 1. **Backend Tesztelés (Postman vagy curl)**

```powershell
# Courses lista
curl http://127.0.0.1:8000/api/courses

# Új kurzus
curl -X POST http://127.0.0.1:8000/api/courses -H "Content-Type: application/json" -d '{\"title\": \"Test Course\", \"description\": \"Test\", \"status\": \"active\"}'
```

### 2. **Frontend Tesztelés**

1. Nyisd meg a böngészőt: http://localhost:4200
2. Nyisd meg a Developer Tools (F12) > Console
3. Nézd meg a konzol üzeneteket:
   - ✅ `Courses loaded from API: [...]`
   - ✅ `Students loaded from API: [...]`
   - ✅ `Instructors loaded from API: [...]`

4. Próbálj létrehozni új kurzust/diákot/oktatót
5. Ellenőrizd, hogy megjelenik-e a listában

---

## 🐛 Gyakori Hibák és Megoldások

### ❌ **CORS hiba** (Access-Control-Allow-Origin)

**Megoldás:**
1. Ellenőrizd a `config/cors.php` fájlt
2. Győződj meg róla, hogy `http://localhost:4200` benne van az `allowed_origins`-ban
3. Indítsd újra a Laravel szervert

---

### ❌ **404 Not Found** - `/api/instructors`

**Megoldás:**
```powershell
# Ellenőrizd a route-okat
cd c:\xampp\htdocs\SkillForge-\skillforge-backend
php artisan route:list --path=api
```

Ha nem látod az instructors route-okat, ellenőrizd hogy:
- `routes/api.php` tartalmazza az InstructorController-t
- A controller létezik: `app/Http/Controllers/InstructorController.php`

---

### ❌ **500 Internal Server Error**

**Megoldás:**
1. Nézd meg a Laravel logokat:
   ```powershell
   cd c:\xampp\htdocs\SkillForge-\skillforge-backend
   cat storage/logs/laravel.log
   ```

2. Gyakori okok:
   - Hiányzó tábla az adatbázisban → `php artisan migrate`
   - Hiányzó Service vagy Repository class
   - Nem megfelelő namespace

---

### ❌ **Frontend nem tölt be adatokat**

**Megoldás:**
1. Nyisd meg a böngésző Developer Tools > Network fület
2. Nézd meg a HTTP kéréseket
3. Ellenőrizd a Response-okat
4. Ha a backend nem fut: `php artisan serve`
5. Ha a CORS hiba: lásd fent

---

## 📊 Adatok Feltöltése (Seeding)

Ha üres az adatbázis, tölts fel tesztadatokat:

```powershell
cd c:\xampp\htdocs\SkillForge-\skillforge-backend

# Futtatsd a seeder-t
php artisan db:seed
```

---

## 🎉 Sikeres Összekötés Jelei

✅ A frontend betölti az adatokat a backend-ről  
✅ A konzolban látszanak a log üzenetek (✅ "loaded from API")  
✅ CRUD műveletek (Create, Read, Update, Delete) működnek  
✅ Nincs CORS hiba  
✅ Nincs 404 vagy 500 hiba  

---

## 📚 További Fejlesztési Lehetőségek

1. **Autentikáció** - Laravel Sanctum vagy JWT
2. **Validáció** - Frontend és backend oldalon
3. **Error Handling** - Felhasználóbarát hibaüzenetek
4. **Loading States** - Spinner/skeleton loader
5. **Pagination** - Frontend pagination komponens
6. **WebSocket** - Valós idejű kommunikáció (már van rá alap!)

---

## 🆘 Segítségkérés

Ha valami nem működik:
1. Ellenőrizd a konzol üzeneteket (Frontend & Backend)
2. Nézd meg a Network fület (F12)
3. Olvasd el a hibaüzeneteket
4. Ellenőrizd, hogy mindkét szerver fut-e

---

**Készítette:** GitHub Copilot  
**Dátum:** 2026-01-16  
**Projekt:** SkillForge - Oktatási Platform
