# 🎧 MusicProject — Spotify Style (MERN + Deezer API)

MusicProject es una aplicación **Full Stack** inspirada en Spotify, donde los usuarios pueden **explorar canciones, reproducir previews** y **crear playlists personalizadas**.

> Proyecto pensado para portfolio: repositorio público, estructura clara y funcionalidades esenciales.

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Register / Login
- JWT para autorización
- Creación automática de playlist **"Favoritos"** al registrarse

### 📚 Playlists (CRUD)
- Crear playlist
- Editar nombre
- Eliminar playlist
- Ver playlists del usuario
- Seleccionar playlist activa desde el sidebar

### 🎵 Canciones + Deezer
- Exploración de canciones desde:
  - Canciones locales (MongoDB)
  - Deezer API (tracks con preview)
- Añadir canciones a una playlist
- Reproducción de preview (cuando está disponible)
- Endpoint para completar preview faltante desde Deezer: `GET /songs/fetch-audio/:songId`

---

## 🧠 Estructura del proyecto

- `backend/` → API REST (Node + Express + MongoDB)
- `frontend/` → UI (React + Tailwind)

---

## ⚙️ Backend (Node + Express + MongoDB)

### 📌 Rutas principales (API REST)

#### 👤 Users / Auth
- `POST /users/register` → Registro + crea playlist “Favoritos”
- `POST /users/login` → Login + devuelve token + `favoritePlaylistId`

#### 🎶 Songs
- `GET /songs` → Todas las canciones locales
- `GET /songs/:songId` → Canción por ID
- `GET /songs/genre/:genreId` → Canciones por género
- `GET /songs/fetch-audio/:songId` → Busca preview en Deezer y actualiza la canción
- `POST /songs/from-deezer` → Guarda canción Deezer en Mongo si aún no existe

#### 📚 Playlists
- `GET /playlists/user/:userId` → Playlists del usuario
- `GET /playlists/:playlistId` → Playlist por ID
- `POST /playlists` → Crear playlist
- `PUT /playlists/:playlistId` → Renombrar / actualizar datos
- `PUT /playlists/:playlistId/add-song` → Añadir canción
- `PUT /playlists/:playlistId/remove-song` → Remover canción
- `DELETE /playlists/:playlistId` → Eliminar playlist

#### 🌍 Deezer
- `GET /deezer/search` (o ruta equivalente) → Combina canciones de chart/search y devuelve tracks con preview

---

## 🧩 Arquitectura

- **Controllers:** reciben request/response y delegan lógica
- **Services:** lógica de negocio + acceso a DB
- **Models:** esquemas MongoDB (User, Song, Playlist)
- **Middleware:** validación JWT para rutas privadas

---

## 🎨 Frontend (React + Tailwind)

### Páginas principales
- **Landing**
- **Register / Login** (mini mensajes UI integrados)
- **Home** (biblioteca + playlist activa + reproductor)
- **ExplorePage** (canciones Deezer + canciones locales)

### 🎧 Player
Reproductor centralizado con `PlayerContext`:
- Play / Pause / Resume / Stop
- Manejo de preview inválida
- Fallback automático: si una canción local no tiene preview → consulta `GET /songs/fetch-audio/:songId`

---

## 🖼️ Screenshots

> Agregá tus capturas dentro de `/frontend/screenshots/` y luego linkealas así:

- Landing  
  `![Landing](frontend/screenshots/landing.png)`

- Home / Biblioteca  
  `![Home](frontend/screenshots/home.png)`

- Explorar canciones  
  `![Explore](frontend/screenshots/explore.png)`

- Login / Register  
  `![Login](frontend/screenshots/login.png)`  
  `![Register](frontend/screenshots/register.png)`

---

## ✅ Estado del proyecto

📌 **Finalizado** — proyecto de portfolio para LinkedIn / GitHub.



