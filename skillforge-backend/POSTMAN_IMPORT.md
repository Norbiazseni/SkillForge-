# Postman Import útmutató - SkillForge API

## Fájlok

A következő fájlokat találod ebben a mappában:

1. **SkillForge_API.postman_collection.json** - Teljes API collection az összes végponttal
2. **SkillForge_Development.postman_environment.json** - Development környezet (Laravel dev szerver)
3. **SkillForge_XAMPP.postman_environment.json** - XAMPP környezet

## Importálás lépései

### 1. Postman Collection importálása

1. Nyisd meg a Postman alkalmazást
2. Kattints a bal felső sarokban az **Import** gombra
3. Húzd be vagy válaszd ki a `SkillForge_API.postman_collection.json` fájlt
4. Kattints az **Import** gombra

### 2. Environment importálása

#### Development környezet (Laravel dev szerver - ajánlott):
1. Kattints az **Import** gombra
2. Válaszd ki a `SkillForge_Development.postman_environment.json` fájlt
3. Kattints az **Import** gombra

#### XAMPP környezet:
1. Kattints az **Import** gombra
2. Válaszd ki a `SkillForge_XAMPP.postman_environment.json` fájlt
3. Kattints az **Import** gombra

### 3. Environment aktiválása

1. A jobb felső sarokban válaszd ki az importált environmentet
   - **SkillForge Development** (http://127.0.0.1:8000) vagy
   - **SkillForge XAMPP** (http://localhost/skillforge-backend/public)

## Collection struktúra

### 📁 Courses
- ✅ **GET** Get All Courses - Lista pagination-nel, search-el, filter-rel
- 🔍 **GET** Search Courses by Title - Keresés példa
- 👁️ **GET** Get Course by ID - Egy kurzus részletei
- ➕ **POST** Create Course - Új kurzus létrehozása (broadcasts event)
- ✏️ **PUT** Update Course - Kurzus módosítása
- ❌ **DELETE** Delete Course - Kurzus törlése

### 📁 Students
- ✅ **GET** Get All Students - Hallgatók listája
- 👁️ **GET** Get Student by ID - Egy hallgató részletei
- ➕ **POST** Create Student - Új hallgató létrehozása
- ✏️ **PUT** Update Student - Hallgató módosítása
- ❌ **DELETE** Delete Student - Hallgató törlése

### 📁 Contact Messages
- ✅ **GET** Get All Contact Messages - Üzenetek listája
- ➕ **POST** Create Contact Message - Új üzenet küldése

## Használat

### 1. Szerver indítása

**Development (ajánlott):**
```bash
cd c:\xampp\htdocs\skillforge-backend
php artisan serve --host=127.0.0.1 --port=8000
```

**XAMPP:**
- Indítsd el az XAMPP Control Panel-t
- Start Apache és MySQL
- Az API elérhető: http://localhost/skillforge-backend/public/api

### 2. Tesztelés

1. Válaszd ki a megfelelő environmentet (Development vagy XAMPP)
2. Kattints egy request-re a collection-ben
3. Kattints a **Send** gombra
4. Nézd meg a választ a Response ablakban

### 3. Query paraméterek

A **Get All Courses** request query paraméterei:
- `search` - Keresés címben és leírásban
- `difficulty` - Szűrés nehézség szerint (beginner, intermediate, advanced)
- `status` - Szűrés státusz szerint (draft, published, archived)
- `per_page` - Elemek száma oldalanként
- `sort_by` - Rendezés mezője
- `sort_order` - Rendezés iránya (asc, desc)

### 4. Request body példák

#### Create Course:
```json
{
    "title": "Advanced JavaScript Techniques",
    "description": "Master advanced JavaScript concepts",
    "difficulty": "advanced",
    "instructor_id": 1
}
```

#### Create Student:
```json
{
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
}
```

#### Create Contact Message:
```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "Hello, I have a question..."
}
```

## Tippek

### Variables használata
A `{{base_url}}` változót az environment automatikusan beállítja:
- Development: `http://127.0.0.1:8000`
- XAMPP: `http://localhost/skillforge-backend/public`

### Response ellenőrzése
- **200 OK** - Sikeres GET/PUT
- **201 Created** - Sikeres POST
- **204 No Content** - Sikeres DELETE
- **404 Not Found** - Az erőforrás nem található
- **422 Unprocessable Entity** - Validációs hiba

### Pre-request Scripts (opcionális)
Ha szeretnél automatikus teszteket, használd a Tests tab-ot:

```javascript
// Ellenőrizd a status code-ot
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Ellenőrizd a response-t
pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

## Gyakori problémák

### 1. Connection refused
**Megoldás:** Győződj meg róla, hogy a Laravel dev szerver fut:
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. 404 Not Found (XAMPP)
**Megoldás:** 
- Ellenőrizd az Apache-ot az XAMPP Control Panel-ben
- Állítsd be az environment-et XAMPP-re
- Ellenőrizd a `public/.htaccess` fájlt

### 3. Database connection error
**Megoldás:**
```bash
# Ellenőrizd a .env fájlt
DB_CONNECTION=mysql
DB_DATABASE=skillforge
DB_HOST=127.0.0.1

# Futtasd a migrációkat
php artisan migrate:fresh --seed
```

## WebSocket Event (CourseCreated)

Új kurzus létrehozásakor a `CourseCreated` event broadcast-olódik:

**Event neve:** `CourseCreated`

**Payload:**
```json
{
    "course": {
        "id": 1,
        "title": "New Course",
        "description": "Description",
        "status": "draft",
        "difficulty": "beginner",
        "instructor_id": 1,
        "created_at": "2026-01-16T10:00:00+00:00",
        "updated_at": "2026-01-16T10:00:00+00:00"
    },
    "instructor_name": "John Doe"
}
```

## További segítség

- API dokumentáció: `API_DOCUMENTATION.md`
- Laravel szerver log: `storage/logs/laravel.log`
- Routes lista: `php artisan route:list`

---

**Jó tesztelést!** 🚀
