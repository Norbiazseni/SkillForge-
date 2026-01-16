# WebSocket Beállítás - SkillForge Backend

## 📡 WebSocket Funkcionalitás Állapota

### ✅ Implementált:

1. **CourseCreated Event** (`app/Events/CourseCreated.php`)
   - ✅ `ShouldBroadcast` interface implementálva
   - ✅ Channel: `courses` (public channel)
   - ✅ Event name: `course.created`
   - ✅ Payload tartalmazza:
     - Teljes course objektum (id, title, description, status, difficulty, instructor_id, timestamps)
     - Oktató neve (`instructor_name`)

2. **Event kiváltása** (`app/Services/CourseService.php`)
   - ✅ `createCourse()` metódusban `broadcast(new CourseCreated($course))->toOthers()`
   - ✅ Instructor kapcsolat betöltve az eventhez

3. **Broadcasting konfiguráció** 
   - ✅ `config/broadcasting.php` létrehozva
   - ✅ `routes/channels.php` létrehozva
   - ✅ `bootstrap/app.php` frissítve channels route-tal

### ⚠️ További beállítások szükségesek:

## 🚀 WebSocket Szerver Választási Lehetőségek

### 1️⃣ Laravel Reverb (Ajánlott - Laravel 11+)

**Telepítés:**
```bash
composer require laravel/reverb
php artisan reverb:install
```

**.env beállítás:**
```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=skillforge
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

**Szerver indítása:**
```bash
php artisan reverb:start
```

**Előnyök:**
- ✅ Natív Laravel megoldás
- ✅ Helyi fejlesztéshez tökéletes
- ✅ Ingyenes
- ✅ Egyszerű beállítás

---

### 2️⃣ Pusher (Külső szolgáltatás)

**Telepítés:**
```bash
composer require pusher/pusher-php-server
```

**.env beállítás:**
```env
BROADCAST_CONNECTION=pusher

PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=eu
```

**Regisztráció:** https://pusher.com (ingyenes tier: 100 kapcsolat, 200k üzenet/nap)

**Előnyök:**
- ✅ Külső hosting (nem kell szerver)
- ✅ Megbízható, skálázható
- ⚠️ Ingyenes tier korlátozott

---

### 3️⃣ Laravel Echo Server (Node.js)

**Telepítés:**
```bash
npm install -g laravel-echo-server
laravel-echo-server init
```

**laravel-echo-server.json:**
```json
{
  "authHost": "http://localhost:8000",
  "devMode": true,
  "port": "6001",
  "database": "redis"
}
```

**.env beállítás:**
```env
BROADCAST_CONNECTION=pusher

PUSHER_APP_ID=local
PUSHER_APP_KEY=local
PUSHER_APP_SECRET=local
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http
```

**Szerver indítása:**
```bash
laravel-echo-server start
```

---

## 🧪 Tesztelés

### 1. Backend teszt (Event kiváltás)

**Postman-ben POST request:**
```http
POST http://127.0.0.1:8000/api/courses
Content-Type: application/json

{
  "title": "WebSocket Test Course",
  "description": "Testing WebSocket broadcast",
  "status": "published",
  "difficulty": "beginner",
  "instructor_id": 1
}
```

**Várható eredmény:**
- ✅ HTTP 201 válasz course adatokkal
- ✅ WebSocket event `course.created` a `courses` channelen

---

### 2. Frontend teszt (Event fogadás)

**Laravel Echo kliens (JavaScript):**

**Telepítés:**
```bash
npm install --save-dev laravel-echo pusher-js
```

**JavaScript kód:**
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb', // vagy 'pusher'
    key: 'your-app-key',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    disableStats: true,
});

// Hallgatás a course.created eventre
window.Echo.channel('courses')
    .listen('course.created', (e) => {
        console.log('New course created:', e);
        console.log('Course title:', e.course.title);
        console.log('Instructor name:', e.instructor_name);
        
        // Itt frissítheted a UI-t:
        // - Kurzuslista frissítése
        // - Dashboard statisztikák frissítése
    });
```

---

### 3. Fejlesztői konzol teszt

**Chrome DevTools → Network → WS (WebSocket) tab:**
- ✅ WebSocket connection létrejön
- ✅ `course.created` event megjelenik a framen

---

## 📊 Payload struktúra

Az event által küldött adatok:

```json
{
  "course": {
    "id": 1,
    "title": "WebSocket Test Course",
    "description": "Testing WebSocket broadcast",
    "status": "published",
    "difficulty": "beginner",
    "instructor_id": 1,
    "created_at": "2026-01-16T12:00:00.000000Z",
    "updated_at": "2026-01-16T12:00:00.000000Z"
  },
  "instructor_name": "John Doe"
}
```

---

## 🔧 Troubleshooting

### Probléma: "No broadcaster found"

**Megoldás:**
```bash
php artisan config:clear
php artisan cache:clear
```

Ellenőrizd, hogy a `.env` fájlban:
```env
BROADCAST_CONNECTION=reverb  # vagy pusher
```

---

### Probléma: Event nem küldődik

**Ellenőrzés:**
```bash
# Nézd meg a Laravel log-ot
tail -f storage/logs/laravel.log

# BROADCAST_CONNECTION=log esetén itt jelenik meg
```

**Debug:**
```php
// CourseService.php
Log::info('Broadcasting CourseCreated event', ['course_id' => $course->id]);
broadcast(new CourseCreated($course))->toOthers();
Log::info('Event broadcasted successfully');
```

---

### Probléma: Frontend nem fogadja az eventet

**Ellenőrizd:**
1. WebSocket szerver fut-e (`php artisan reverb:start`)
2. Echo konfigurációban helyes a `key`, `wsHost`, `wsPort`
3. Chrome DevTools → Console → hibák
4. Chrome DevTools → Network → WS tab → connection létrejött-e

---

## 📝 Összefoglalás

### Jelenlegi állapot:
- ✅ **Backend kód kész**: Event létrehozva, broadcast implementálva
- ✅ **Konfiguráció kész**: broadcasting.php, channels.php létrehozva
- ⚠️ **WebSocket szerver**: NINCS ELINDÍTVA (választani kell: Reverb/Pusher/Echo Server)

### Következő lépés:
1. Válassz WebSocket szervert (ajánlott: **Laravel Reverb**)
2. Telepítsd és konfiguráld (lásd fent)
3. Indítsd el a WebSocket szervert
4. Teszteld Postman-ben + frontend Echo klienssel

**A backend 100%-osan kész, csak a WebSocket infrastruktúra beállítása hiányzik!** 🚀
