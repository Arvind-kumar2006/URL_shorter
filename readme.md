# Snip 🔗

> A full-stack URL shortener built with **React + Node.js + PostgreSQL + Redis**, featuring JWT auth, analytics dashboard, QR generation, rate limiting, and caching.

---

## 🚀 Live Demo

| | URL |
|---|---|
| Frontend | https://your-frontend-link.vercel.app |
| Backend API | https://url-shortener-api-k6gj.onrender.com |

---

## 🧠 Why This Project Is Interesting

Most beginner projects only do CRUD. Snip solves real backend problems:

| Feature | What It Solves |
|---|---|
| ⚡ Redis Cache | Serves repeated redirects from memory — no DB hit every time |
| 🛡 Rate Limiting | Stops spam users from flooding API requests |
| 📊 Analytics | Tracks clicks and user activity in real time |
| 🔐 JWT Auth | Secures dashboard routes end-to-end |
| 🏭 Production Thinking | Caching, scalable routes, API protection, deployment-ready |

---

## 🏗 Architecture

```
┌──────────────────┐
│   React Frontend │
│ Dashboard / Auth │
└────────┬─────────┘
         │ REST API
         ▼
┌──────────────────┐
│ Node.js + Express│
│ Controllers/API  │
└───────┬──────────┘
        │
   ┌────┴────────────┐
   ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ PostgreSQL DB │  │    Redis     │
│ Users / Links │  │ Cache/Limit  │
└──────────────┘  └──────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Cache / Rate Limit | Redis |
| Auth | JWT |
| QR Code | qrcode library |
| Deployment | Vercel (frontend), Render (backend) |

---

## ✨ Features

**User**
- Register / Login with JWT authentication
- Protected dashboard
- Create and manage short URLs
- Search and filter links
- Deactivate links
- Copy to clipboard
- Download QR codes
- View analytics per link

**Backend**
- Redis caching for fast redirects
- Sliding window rate limiting
- Secure JWT-protected APIs
- Click tracking on redirects
- Production-ready deployment

---

## ⚙️ Local Setup

**Requirements:** Docker, Docker Compose

```bash
git clone https://github.com/yourusername/snip-url-shortener.git
cd snip-url-shortener
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

## 📁 Folder Structure

```
├── Frontend/
│   └── src/
│       ├── pages/
│       └── components/
└── Backend/
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/
        ├── services/
        ├── utils/
        └── prisma/
```

---

## 🔐 Environment Variables

**Backend `.env`**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@db:5432/urlshortener
JWT_SECRET=your_secret_key
REDIS_URL=redis://redis:6379
BASE_URL=http://localhost:5000
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |

**Register / Login body:**
```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

### Links

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/links` | ✅ | Create a short URL |
| GET | `/api/v1/links` | ✅ | Get all your links |
| DELETE | `/api/v1/links/:shortCode` | ✅ | Deactivate a link |
| GET | `/:shortCode` | ❌ | Redirect to original URL |

**Create link body:**
```json
{
  "originalUrl": "https://google.com"
}
```

### Analytics & QR

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/analytics/:shortCode` | ✅ | Get click analytics |
| GET | `/api/v1/qr/:shortCode` | ❌ | Get QR code image |

---

## 🧠 Design Decisions

### 1. Sliding Window Rate Limiting

Fixed window has a burst problem — 10 requests at 12:59 and 10 at 1:00 means 20 requests slip through instantly. Sliding window smooths traffic over a rolling time period, making it fairer and more suitable for real APIs.

### 2. Cache-Aside Pattern

```
Request → Check Redis
    Hit  → Return cached URL
    Miss → Fetch from DB → Store in Redis → Return
```

Simple, fast reads, and ideal for redirect-heavy workloads. Write-through would add unnecessary complexity here.

### 3. PostgreSQL for Relational Consistency

Users own links, analytics need joins, and indexes matter for query performance — PostgreSQL is the right fit.

### 4. Redis for Hot Data

Perfect for short-lived, frequently accessed data: redirect lookups, rate limit counters, and session-like fast storage.

---

## 📈 Performance Impact

| Scenario | Without Redis | With Redis |
|---|---|---|
| Popular link redirect | DB query every time | Served from memory |
| DB load | High under traffic | Significantly reduced |
| Response time | ~50–200ms | ~1–5ms |

---

## 🧪 Future Improvements

- [ ] Custom short aliases
- [ ] Link expiry dates
- [ ] Device & country analytics
- [ ] Team workspaces
- [ ] Link folders / tags
- [ ] CSV export
- [ ] CI/CD pipeline

---

## �‍💻 Author

**Arvind Kumar**

- GitHub: [github.com/yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
