# 🖼️ SkillForge - Header Logó Javítás

## ❌ Probléma

A **header-ben** a **SkillForge logó** nem töltődött be.

**Rossz útvonal:**
```html
<img src="public/logo.png" alt="SkillForge Logo">
```

---

## 🔍 Probléma Oka

### Angular Static Assets Kezelés

Angular-ban a `public` mappa tartalma **build során** a **gyökérkönyvtárba** kerül.

**Fájl helye a projektben:**
```
skillforge-frontend/
  public/
    logo.png  ← Itt van a fájl
```

**Fájl helye build után (futáskor):**
```
dist/
  logo.png  ← Itt lesz a fájl
```

Ezért a megfelelő útvonal: `/logo.png` (nem `public/logo.png`)

---

## ✅ Megoldás

### 1. **HTML Javítás**

`src/app/shared/layout/header/header.html`:

```html
<header class="header">
  <div class="logo">
    <!-- ✅ JÓ: Abszolút útvonal a gyökértől -->
    <img src="/logo.png" alt="SkillForge Logo" class="logo-img">
    <span>SkillForge</span>
  </div>

  <nav class="nav">
    <a routerLink="/dashboard">Dashboard</a>
    <a routerLink="/courses">Courses</a>
    <a routerLink="/students">Students</a>
    <a routerLink="/instructors">Instructors</a>
    <a routerLink="/contact">Contact</a>
    <a routerLink="/about">About</a>
  </nav>
</header>
```

### 2. **CSS Stílus Hozzáadása**

`src/app/shared/layout/header/header.css`:

```css
.logo {
  display: flex;
  align-items: center;
  gap: 12px;               /* Távolság a kép és szöveg között */
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-img {
  height: 40px;            /* Logó magasság */
  width: auto;             /* Szélesség automatikus (arány megőrzése) */
}
```

---

## 📂 Angular Static Assets Útvonalak

### ✅ Helyes útvonalak:

```html
<!-- Gyökér könyvtárból (public/) -->
<img src="/logo.png">
<img src="/favicon.ico">

<!-- Relatív útvonal (nem ajánlott) -->
<img src="logo.png">

<!-- Assets mappából (ha ott van) -->
<img src="assets/images/logo.png">
```

### ❌ Helytelen útvonalak:

```html
<!-- ❌ public/ könyvtár nevével -->
<img src="public/logo.png">

<!-- ❌ src/ könyvtár nevével -->
<img src="src/logo.png">

<!-- ❌ Teljes fájlrendszer útvonal -->
<img src="c:/xampp/htdocs/SkillForge-/public/logo.png">
```

---

## 🎨 Vizuális Eredmény

### Előtte:
```
┌──────────────────────────────────────────┐
│  SkillForge [X]  Nav Links...            │  ← Törött kép ikon
└──────────────────────────────────────────┘
```

### Utána:
```
┌──────────────────────────────────────────┐
│  [🎓] SkillForge  Nav Links...           │  ← Szép logó
└──────────────────────────────────────────┘
```

---

## 🧪 Ellenőrzés

### 1. Frissítsd a böngészőt

```
Ctrl + F5  (Hard refresh)
```

### 2. Ellenőrizd a Developer Tools-ban (F12)

**Console:**
- ❌ Ha hiba van: `404 Not Found: public/logo.png`
- ✅ Ha jó: Nincs hibaüzenet

**Network fül:**
- Keresd meg a `logo.png` kérést
- ✅ Státusz: `200 OK`
- ❌ Státusz: `404 Not Found`

### 3. Jobb klikk a képen

Ha a kép betöltődött:
- "Open image in new tab" → működik
- URL: `http://localhost:4200/logo.png`

---

## 🔧 Ha továbbra sem töltődik be

### 1. **Ellenőrizd, hogy létezik-e a fájl**

```powershell
Test-Path c:\xampp\htdocs\SkillForge-\skillforge-frontend\public\logo.png
```

Ha `False`, akkor hozd létre vagy rakd át a fájlt.

### 2. **Angular dev server újraindítás**

```powershell
# Terminálban állítsd le (Ctrl + C), majd:
cd c:\xampp\htdocs\SkillForge-\skillforge-frontend
npm start
```

### 3. **angular.json ellenőrzése**

Győződj meg róla, hogy a `public` mappa be van állítva:

```json
{
  "architect": {
    "build": {
      "options": {
        "assets": [
          {
            "glob": "**/*",
            "input": "public"
          }
        ]
      }
    }
  }
}
```

---

## 💡 Alternatív Megoldás: Assets mappa

Ha szeretnéd, áthelyezheted az `src/assets` mappába:

### 1. Fájl áthelyezés

```powershell
Move-Item public/logo.png src/assets/images/logo.png
```

### 2. HTML módosítás

```html
<img src="assets/images/logo.png" alt="SkillForge Logo">
```

**Előny:** Tisztább struktúra, TypeScript importálható  
**Hátrány:** Hosszabb útvonal

---

## 📝 Módosított Fájlok

### Frontend:
1. ✅ `src/app/shared/layout/header/header.html`
2. ✅ `src/app/shared/layout/header/header.css`

---

## 🎉 Eredmény

Most a **SkillForge logó szépen megjelenik** a header-ben! 🎓

A fejléc most már:
- ✅ Logó ikon (40px magas)
- ✅ "SkillForge" szöveg
- ✅ Navigációs linkek
- ✅ Kék háttér (#2563eb)

---

**Dátum:** 2026-01-16  
**Javítás:** Logó útvonal + CSS stílus
