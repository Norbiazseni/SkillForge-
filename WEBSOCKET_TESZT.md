# 🧪 WebSocket Működés Tesztelése - 3 Módszer

## ✅ 1. MÓDSZER: Log Driver (AZONNAL HASZNÁLHATÓ!)

### Előnyök:
- ✅ Nincs szükség külső szerverre
- ✅ Azonnal működik
- ✅ Tökéletes fejlesztéshez

### Lépések:

#### 1️⃣ Ellenőrizd a .env fájlt:
```env
BROADCAST_CONNECTION=log
```

#### 2️⃣ Tisztítsd a cache-t:
```bash
php artisan config:clear
```

#### 3️⃣ Nyiss egy terminált a log követésére:

**PowerShell-ben:**
```powershell
Get-Content storage\logs\laravel.log -Wait -Tail 20
```

**Vagy Git Bash/Linux-ban:**
```bash
tail -f storage/logs/laravel.log
```

#### 4️⃣ Postman-ben küldd el ezt a POST kérést:

**URL:** `http://127.0.0.1:8000/api/courses`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (raw JSON):**
```json
{
  "title": "WebSocket Teszt Kurzus",
  "description": "Ez egy teszt kurzus a WebSocket működésének ellenőrzésére",
  "status": "published",
  "difficulty": "beginner",
  "instructor_id": 1
}
```

#### 5️⃣ Nézd a log terminált!

**Várható eredmény:** A log-ban megjelenik valami ilyesmi:

```
[2026-01-16 12:30:45] local.INFO: Broadcasting [App\Events\CourseCreated] on channels [courses] with payload:
{
    "course": {
        "id": 5,
        "title": "WebSocket Teszt Kurzus",
        "description": "Ez egy teszt...",
        "status": "published",
        "difficulty": "beginner",
        "instructor_id": 1,
        "created_at": "2026-01-16T12:30:45.000000Z",
        "updated_at": "2026-01-16T12:30:45.000000Z"
    },
    "instructor_name": "John Doe"
}
```

### ✅ Ha látod a fenti log bejegyzést → **WebSocket event MŰKÖDIK!** 🎉

---

## 🚀 2. MÓDSZER: Laravel Reverb (Valódi WebSocket)

### Telepítés:

```bash
composer require laravel/reverb
php artisan reverb:install
```

### .env módosítás:

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=skillforge
REVERB_APP_KEY=local-key
REVERB_APP_SECRET=local-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### Reverb szerver indítása:

```bash
php artisan reverb:start
```

**Látni fogsz valami ilyesmit:**
```
  INFO  Server running on http://0.0.0.0:8080
  INFO  Reverb server started
  INFO  Listening for connections...
```

### Tesztelés:

1. **Új terminálban** indítsd a Laravel dev szervert:
   ```bash
   php artisan serve
   ```

2. **Postman-ben** küldd el ugyanazt a POST kérést (mint az 1. módszernél)

3. **A Reverb terminálban** látni fogod:
   ```
   INFO  Connection opened for app skillforge
   INFO  Broadcasting to [courses] with event [course.created]
   ```

### ✅ Ha látod a Reverb log-ban → **Valódi WebSocket működik!** 🎉

---

## 🌐 3. MÓDSZER: Frontend JavaScript Kliens

### HTML teszt oldal létrehozása:

Hozd létre ezt a fájlt: `public/test-websocket.html`

```html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Teszt - SkillForge</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        #status {
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .connected {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .disconnected {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .waiting {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        #events {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        .event {
            padding: 10px;
            margin: 10px 0;
            background: white;
            border-left: 4px solid #007bff;
            border-radius: 3px;
        }
        .event-time {
            color: #6c757d;
            font-size: 12px;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        button:hover {
            background: #0056b3;
        }
        button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 WebSocket Teszt - SkillForge</h1>
        
        <div id="status" class="waiting">
            📡 Várakozás a kapcsolatra...
        </div>

        <div>
            <button id="connectBtn">Csatlakozás</button>
            <button id="disconnectBtn" disabled>Lecsatlakozás</button>
            <button id="clearBtn">Események törlése</button>
        </div>

        <h2>📨 Fogadott események:</h2>
        <div id="events">
            <p style="color: #6c757d;">Még nincs esemény. Hozz létre egy új kurzust Postman-ben!</p>
        </div>

        <hr>
        <h3>📋 Tesztelési lépések:</h3>
        <ol>
            <li>Kattints a "Csatlakozás" gombra</li>
            <li>Postman-ben küldd el a POST /api/courses kérést</li>
            <li>Itt meg fog jelenni az új kurzus esemény!</li>
        </ol>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/pusher-js@8/dist/web/pusher.min.js"></script>
    <script>
        const statusDiv = document.getElementById('status');
        const eventsDiv = document.getElementById('events');
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');
        const clearBtn = document.getElementById('clearBtn');

        let pusher = null;
        let channel = null;

        // Pusher konfiguráció (Reverb kompatibilis)
        const config = {
            broadcaster: 'pusher',
            key: 'local-key', // Ha Reverb-et használsz
            cluster: 'mt1',
            wsHost: 'localhost',
            wsPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            disableStats: true,
        };

        function updateStatus(message, type) {
            statusDiv.textContent = message;
            statusDiv.className = type;
        }

        function addEvent(eventData) {
            const time = new Date().toLocaleTimeString('hu-HU');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.innerHTML = `
                <div class="event-time">${time}</div>
                <strong>🎓 Új kurzus létrehozva!</strong><br>
                <strong>Cím:</strong> ${eventData.course.title}<br>
                <strong>Oktató:</strong> ${eventData.instructor_name}<br>
                <strong>Státusz:</strong> ${eventData.course.status}<br>
                <strong>Nehézség:</strong> ${eventData.course.difficulty}<br>
                <details>
                    <summary>Teljes payload</summary>
                    <pre>${JSON.stringify(eventData, null, 2)}</pre>
                </details>
            `;
            
            if (eventsDiv.querySelector('p')) {
                eventsDiv.innerHTML = '';
            }
            
            eventsDiv.insertBefore(eventDiv, eventsDiv.firstChild);
        }

        connectBtn.addEventListener('click', () => {
            try {
                // Pusher inicializálása
                pusher = new Pusher(config.key, {
                    wsHost: config.wsHost,
                    wsPort: config.wsPort,
                    forceTLS: config.forceTLS,
                    enabledTransports: config.enabledTransports,
                    disableStats: config.disableStats,
                });

                // Csatlakozás a 'courses' channelhez
                channel = pusher.subscribe('courses');

                // Sikeres csatlakozás
                pusher.connection.bind('connected', () => {
                    updateStatus('✅ Csatlakozva! Várakozás az eseményekre...', 'connected');
                    connectBtn.disabled = true;
                    disconnectBtn.disabled = false;
                    console.log('WebSocket kapcsolat létrejött');
                });

                // Hiba esetén
                pusher.connection.bind('error', (err) => {
                    updateStatus('❌ Hiba: ' + err.message, 'disconnected');
                    console.error('WebSocket hiba:', err);
                });

                // CourseCreated event figyelése
                channel.bind('course.created', (data) => {
                    console.log('📨 CourseCreated event fogadva:', data);
                    addEvent(data);
                });

            } catch (error) {
                updateStatus('❌ Hiba: ' + error.message, 'disconnected');
                console.error('Csatlakozási hiba:', error);
            }
        });

        disconnectBtn.addEventListener('click', () => {
            if (pusher) {
                pusher.disconnect();
                updateStatus('⭕ Lecsatlakozva', 'disconnected');
                connectBtn.disabled = false;
                disconnectBtn.disabled = true;
            }
        });

        clearBtn.addEventListener('click', () => {
            eventsDiv.innerHTML = '<p style="color: #6c757d;">Események törölve.</p>';
        });
    </script>
</body>
</html>
```

### Tesztelés:

1. **Laravel Reverb indítása:**
   ```bash
   php artisan reverb:start
   ```

2. **Laravel dev szerver indítása (új terminál):**
   ```bash
   php artisan serve
   ```

3. **Nyisd meg böngészőben:**
   ```
   http://127.0.0.1:8000/test-websocket.html
   ```

4. **Kattints a "Csatlakozás" gombra**

5. **Postman-ben küldd el a POST /api/courses kérést**

6. **A weboldalon azonnal megjelenik az új kurzus!** 🎉

---

## 📊 Összehasonlítás

| Módszer | Előny | Hátrány | Ajánlott |
|---------|-------|---------|----------|
| **Log Driver** | ✅ Azonnal működik<br>✅ Nincs setup | ⚠️ Nem valódi WebSocket | 🔧 Fejlesztéshez |
| **Reverb** | ✅ Valódi WebSocket<br>✅ Laravel natív | ⚠️ Külön szerver kell | 🚀 Éles használatra |
| **Frontend kliens** | ✅ Látványos<br>✅ Valós idejű UI | ⚠️ HTML/JS kód kell | 🎨 Demóhoz |

---

## 🎯 Gyors döntési fa:

1. **Csak ellenőrizni akarod, hogy az event küldődik?**
   → Használd az **1. módszert (Log Driver)**

2. **Valódi WebSocket-et szeretnél tesztelni?**
   → Használd a **2. módszert (Reverb)**

3. **Látni akarod működés közben a UI-ban?**
   → Használd a **3. módszert (Frontend kliens)**

---

## 🔧 Troubleshooting

### Probléma: "Connection refused"
**Megoldás:** Ellenőrizd, hogy a Reverb szerver fut-e (`php artisan reverb:start`)

### Probléma: Log-ban nem jelenik meg semmi
**Megoldás:**
```bash
php artisan config:clear
php artisan cache:clear
# Ellenőrizd: .env fájlban BROADCAST_CONNECTION=log
```

### Probléma: Frontend nem csatlakozik
**Megoldás:** Ellenőrizd a böngésző konzolt (F12), nézd meg a WebSocket hibákat

---

## ✅ Sikeres teszt jelei:

- ✅ **Log-ban** megjelenik a "Broadcasting [App\Events\CourseCreated]" üzenet
- ✅ **Reverb-ben** látod a "Broadcasting to [courses]" üzenetet
- ✅ **Frontend-en** megjelenik az új kurzus az eseménylistában

**Ha bármelyik működik → A backend WebSocket implementációd 100%-osan helyes!** 🎉
