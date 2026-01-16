# SkillForge Backend - Gyors Útmutató

## ✅ Telepítés sikeresen kész!

### Telepített komponensek:
- ✅ Laravel Framework
- ✅ Composer függőségek (`composer install`)
- ✅ Adatbázis migrációk
- ✅ Seed adatok (példa kurzusok, hallgatók, oktatók)
- ✅ API végpontok
- ✅ WebSocket esemény (CourseCreated)

---

## 🚀 Szerver indítása

### Opció 1: Laravel Development Server (AJÁNLOTT)
```bash
php artisan serve --host=127.0.0.1 --port=8000
```
**URL:** http://127.0.0.1:8000/api

### Opció 2: XAMPP Apache
1. Indítsd el az XAMPP Control Panel-t
2. Start Apache
3. Start MySQL
**URL:** http://localhost/skillforge-backend/public/api

---

## 📊 Adatbázis

### Migráció és Seed futtatása:
```bash
php artisan migrate:fresh --seed
```

### Adatbázis ellenőrzése:
- MySQL (XAMPP): http://localhost/phpmyadmin
- Adatbázis neve: `skillforge`
- Host: `127.0.0.1:3306`
- User: `root`
- Password: (üres)

---

## 🧪 API Tesztelés

### 1. Postman használata
1. Importáld: `SkillForge_API.postman_collection.json`
2. Importáld: `SkillForge_Development.postman_environment.json`
3. Válaszd ki a "SkillForge Development" environmentet
4. Küldj egy GET request-et az "Get All Courses" végpontra

### 2. PowerShell script
```powershell
./test-api.ps1
```

### 3. Curl parancs
```bash
curl http://127.0.0.1:8000/api/courses -H "Accept: application/json"
```

### 4. Böngésző
Nyisd meg: http://127.0.0.1:8000/api/courses

---

## 📋 Elérhető API végpontok

### Courses (Kurzusok)
- `GET    /api/courses` - Lista (search, filter, pagination)
- `POST   /api/courses` - Új kurzus létrehozása
- `GET    /api/courses/{id}` - Egy kurzus megtekintése
- `PUT    /api/courses/{id}` - Kurzus szerkesztése
- `DELETE /api/courses/{id}` - Kurzus törlése

### Students (Hallgatók)
- `GET    /api/students` - Lista
- `POST   /api/students` - Új hallgató
- `GET    /api/students/{id}` - Egy hallgató
- `PUT    /api/students/{id}` - Hallgató szerkesztése
- `DELETE /api/students/{id}` - Hallgató törlése

### Contact Messages (Kapcsolat)
- `GET    /api/contact` - Üzenetek listája
- `POST   /api/contact` - Új üzenet küldése

---

## 📚 Dokumentáció

- **API Dokumentáció:** `API_DOCUMENTATION.md`
- **Postman Útmutató:** `POSTMAN_IMPORT.md`
- **Változási napló:** `CHANGELOG.md`

---

## 🔧 Hasznos parancsok

### Cache törlése
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Összes cache törlése
```bash
php artisan optimize:clear
```

### Route lista megtekintése
```bash
php artisan route:list
```

### Adatbázis frissítése seed nélkül
```bash
php artisan migrate:fresh
```

### Adatbázis frissítése seed-del
```bash
php artisan migrate:fresh --seed
```

### Laravel Tinker (konzol)
```bash
php artisan tinker
```

---

## 🐛 Hibaelhárítás

### 1. "Target class does not exist" hiba
**Megoldás:**
```bash
composer dump-autoload
php artisan config:clear
```

### 2. Database connection hiba
**Ellenőrizd:**
- MySQL fut-e az XAMPP-ben
- `.env` fájl helyes-e:
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=skillforge
  DB_USERNAME=root
  DB_PASSWORD=
  ```

### 3. 404 Not Found az API-nál
**Megoldás:**
```bash
php artisan route:clear
php artisan config:clear
php artisan serve
```

### 4. Permission denied (fájl írási jogok)
**Windows-on:**
- Jobb klikk a `storage` és `bootstrap/cache` mappára
- Properties → Security → Edit
- Add írási jogot a felhasználódnak

### 5. Composer hibaüzenet
**Megoldás:**
```bash
composer install
composer dump-autoload
```

---

## 📦 Projekt struktúra

```
skillforge-backend/
├── app/
│   ├── Events/
│   │   └── CourseCreated.php          # WebSocket event
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CourseController.php
│   │   │   ├── StudentController.php
│   │   │   └── ContactMessageController.php
│   │   └── Requests/
│   │       ├── StoreCourseRequest.php
│   │       └── UpdateCourseRequest.php
│   ├── Models/
│   │   ├── Course.php
│   │   ├── Student.php
│   │   ├── Instructor.php
│   │   └── ContactMessage.php
│   ├── Repositories/
│   │   ├── CourseRepository.php
│   │   └── StudentRepository.php
│   └── Services/
│       ├── CourseService.php
│       └── StudentService.php
├── database/
│   ├── migrations/
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   ├── api.php                         # API végpontok
│   └── web.php
├── storage/
│   └── logs/
│       └── laravel.log                 # Hibanaplók
├── .env                                # Környezeti változók
├── API_DOCUMENTATION.md                # API dokumentáció
├── POSTMAN_IMPORT.md                   # Postman útmutató
├── SkillForge_API.postman_collection.json
└── test-api.ps1                        # Teszt script
```

---

## 🎯 Következő lépések

### Frontend integrációhoz:
1. **Base URL beállítása a frontenden:**
   ```javascript
   const API_BASE_URL = 'http://127.0.0.1:8000/api';
   ```

2. **CORS engedélyezése** (ha szükséges):
   - Már be van állítva a `bootstrap/app.php`-ban

3. **WebSocket csatlakozás** (CourseCreated event):
   ```javascript
   // Laravel Echo példa
   Echo.channel('courses')
       .listen('CourseCreated', (event) => {
           console.log('New course:', event.course);
       });
   ```

### Production deployment:
1. `.env` fájl frissítése production értékekkel
2. `APP_DEBUG=false` beállítása
3. `php artisan config:cache`
4. `php artisan route:cache`
5. `php artisan view:cache`

---

## 📞 Support

Ha problémád van, ellenőrizd:
1. `storage/logs/laravel.log` - Laravel hibák
2. XAMPP error log - Apache/MySQL hibák
3. Browser console - Frontend hibák

---

## ✨ Összes funkció amit kaptál:

✅ **REST API** - Teljes CRUD minden entitásra
✅ **Keresés és szűrés** - Query paraméterekkel
✅ **Pagination** - Laravel pagination
✅ **Validáció** - Request validation
✅ **Repository Pattern** - Tiszta architektúra
✅ **Service Layer** - Üzleti logika szétválasztva
✅ **WebSocket Events** - Real-time értesítések
✅ **Postman Collection** - Azonnal tesztelhető
✅ **Seed adatok** - Példa tartalom
✅ **Dokumentáció** - Teljes API dokumentáció

---

**Jó munkát! 🚀**
