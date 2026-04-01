# 🗺️ CityHeart

> Pin the places you love. Share the world you see.

---

## Quick Start

### 1. Install dependencies
```bash
cd cityheart
npm run install:all
```

### 2. Backend env
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/cityheart
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 3. Frontend env
```bash
cd frontend
cp .env.example .env
```
Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=pk.ey...   ← get free at mapbox.com
```

### 4. Run
```bash
cd cityheart
npm run dev    # starts both backend + frontend
```

Open http://localhost:3000 🎉

---

## Get your Mapbox token (free)
1. Go to https://mapbox.com → Sign up
2. Dashboard → Tokens → copy your Default public token
3. Paste as `REACT_APP_MAPBOX_TOKEN`

## Get MongoDB (free)
- **Local**: install MongoDB Community → use `mongodb://localhost:27017/cityheart`
- **Cloud**: https://mongodb.com/atlas → free M0 cluster → copy connection string

---

## Features
- 🗺️ Interactive world map with animated pins
- ♥ Heart / Bookmark / Visited / Dream pin types  
- ✍️ Letterboxd-style reviews: star rating + text + tags
- 📋 Custom lists ("My Delhi Cafes", "2026 Europe Trip")
- 👥 Follow/unfollow, public/private accounts
- 📰 Social feed — Following & Discover modes
- 🏙️ City community pages — trending, top lists, reviews
- 🔍 Search users and cities
- 🔔 Notifications

## Stack
- **Frontend**: React 18, Tailwind CSS, react-map-gl (Mapbox GL JS), Zustand, React Query
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs

## Project Structure
```
cityheart/
├── backend/
│   ├── models/       User, Place, Bookmark, List, Notification
│   ├── routes/       auth, users, places, lists, feed, cities, notifications, upload
│   ├── middleware/   auth.js
│   └── server.js
└── frontend/src/
    ├── pages/        Landing, Login, Register, Map, Feed, Explore, Profile, City, List, Settings
    ├── components/   map/, places/, lists/, shared/
    ├── context/      authStore.js, mapStore.js
    └── utils/        api.js
```
