# CityHeart 🗺️♥️

> **Pin the places you love.** A social travel mapping platform where explorers discover, review, and share their favorite locations worldwide.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-heartyourcity.vercel.app-blue?style=flat-square)](https://heartyourcity.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()

---

## ✨ Features

🗺️ **Personal World Map**
- Drop pins anywhere on Earth
- Mark places as loved (♥), saved (🔖), visited (✓), or dream destinations (✦)
- Interactive Mapbox integration with multiple map styles

✍️ **Rich Reviews & Ratings**
- Star ratings (1-5)
- Written reviews with custom tags
- Photo uploads coming soon
- Public or private reviews

📋 **Custom Lists**
- Create curated lists: "Delhi Cafes," "2026 Europe Trip," "Hidden Gems"
- Share with community or keep private
- View lists on interactive map

👥 **Social Discovery**
- Follow friends and explorers
- See their pins in your personalized feed
- Private account option with follow requests
- User profiles with pin collections

🏙️ **City Pages**
- Trending spots by city
- Recent reviews from community
- Top curated lists
- Real-time discovery

🔍 **Smart Explore**
- Search cities, places, users
- Browse by vibe: cozy, aesthetic, rooftop, hidden gem, etc.
- Discover new destinations through trusted eyes

---

## 🚀 Quick Start

### Live Demo
Visit **[heartyourcity.vercel.app](https://heartyourcity.vercel.app)** to see it in action!

### Sign Up (30 seconds)
1. Click "Get started free"
2. Enter email, username, password, display name
3. Start pinning places immediately

### Pin a Place
1. Go to your map
2. Search for a place using the search bar
3. Click the pin to save
4. Choose your bookmark type (love it, save, visited, dream)
5. Optional: Add a star rating and review

### Follow Users
1. Go to Explore
2. Search for other travelers
3. Click Follow to see their pins in your feed

---

## 💻 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS for styling
- Mapbox GL for interactive maps
- Zustand for state management
- React Query for data fetching
- Lucide React for icons

**Backend**
- Node.js + Express
- MongoDB for data storage
- JWT authentication
- Multer for file handling
- CORS enabled for production

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier)
- Mapbox account (free tier)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/perhapslaksh/cityheart.git
cd cityheart
```

**2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env
echo "CLIENT_URL=http://localhost:3000" >> .env

# Start backend
npm run dev
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install

# Create .env.local file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
echo "REACT_APP_MAPBOX_TOKEN=your_mapbox_token" >> .env.local

# Start frontend
npm run dev
```

**4. Open browser**
Navigate to `http://localhost:5173` (or port shown in terminal)

---

## 🌐 Deployment

### Deploy Backend (Render)
1. Push code to GitHub
2. Connect Render to GitHub repo
3. Set environment variables in Render dashboard:
   ```
   MONGO_URI = your_mongodb_uri
   JWT_SECRET = your_secret_key
   CLIENT_URL = https://your-vercel-domain.vercel.app
   ```
4. Deploy!

### Deploy Frontend (Vercel)
1. Connect Vercel to GitHub repo
2. Set environment variables:
   ```
   REACT_APP_API_URL = https://your-render-url.onrender.com/api
   REACT_APP_MAPBOX_TOKEN = your_mapbox_token
   ```
3. Deploy!

---

## 📚 API Documentation

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Places
```bash
GET  /api/places/search?q=cafe&city=Delhi
POST /api/places/:id/bookmark        # Save place
DELETE /api/places/:id/bookmark      # Remove bookmark
GET  /api/places/:id                 # Get place details
```

### Users
```bash
GET  /api/users/search?q=username
GET  /api/users/:username            # Get profile
PUT  /api/users/me                   # Update profile
POST /api/users/:id/follow           # Follow user
DELETE /api/users/:id/follow         # Unfollow
GET  /api/users/:username/bookmarks  # Get user's pins
```

### Lists
```bash
POST /api/lists                      # Create list
GET  /api/lists/:id                  # Get list
PUT  /api/lists/:id                  # Update list
DELETE /api/lists/:id                # Delete list
POST /api/lists/:id/places           # Add place to list
```

### Cities
```bash
GET /api/cities                      # All cities
GET /api/cities/:city                # City details
```

### Feed
```bash
GET /api/feed?mode=following&page=1  # Personalized feed
```

---

## 🎨 Design

**Color Palette**
- Primary: Terracotta (#C4664A)
- Accent: Red (#E84545)
- Background: Cream (#F9F5EF)
- Text: Ink (#2D2D2D)

**Pin Types**
- ♥ Heart (Red) - Love it
- 🔖 Bookmark (Terracotta) - Save for later
- ✓ Visited (Sage) - Been there
- ✦ Dream (Gold) - Want to visit

**Vibes**
Cozy • Instagrammable • Hidden Gem • Rooftop • Aesthetic • Street Food • Sunset View • Local Favorite • Vintage • Late Night • Romantic • Artsy

---

## 🤝 Contributing

Love CityHeart? Want to improve it?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Photo uploads to reviews
- Advanced map filters
- Trip planning tools
- Real-time notifications
- Mobile app (React Native)
- Dark mode theme
- Map sharing with custom links

---

## 📖 Pages Overview

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Welcome & features |
| Sign Up | `/register` | Create account |
| Sign In | `/login` | Login page |
| Map | `/map` | Your personal world map |
| Feed | `/feed` | What your friends are pinning |
| Explore | `/explore` | Discover cities & users |
| City | `/city/:city` | Trending spots in a city |
| User Profile | `/:username` | User's pins & lists |
| List | `/list/:id` | View specific list |
| Settings | `/settings` | Edit your profile |

---

## 🐛 Issues & Support

Found a bug? Have a suggestion?

1. Check existing [Issues](https://github.com/perhapslaksh/cityheart/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if possible

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Mapbox for interactive maps
- MongoDB for reliable database
- Vercel & Render for hosting
- React community for amazing tools
- All our users for making CityHeart special ♥️

---

## 👨‍💻 Author

**@perhapslaksh**

- GitHub: [perhapslaksh](https://github.com/perhapslaksh)
- Twitter: [@perhapslaksh](https://twitter.com/perhapslaksh)

---

## 🌟 Show Some Love

If you like CityHeart, please:
- ⭐ Star this repository
- 🐦 Share with friends
- 💬 Give feedback
- 🤝 Contribute!

---

<div align="center">

### 🗺️ Ready to pin your favorite places?

[Start Mapping Now](https://heartyourcity.vercel.app) • [Report Bug](https://github.com/perhapslaksh/cityheart/issues) • [Request Feature](https://github.com/perhapslaksh/cityheart/issues)

**Made with ♥️ for explorers, by explorers**

</div>
