<div align="center">

# ✂️ Snip

**A production-grade URL shortener built with real backend engineering in mind.**

[![Live Demo](https://img.shields.io/badge/Frontend-Live%20Demo-00C7B7?style=for-the-badge&logo=vercel)](https://url-shortner-frontend-xh83.vercel.app/)
[![API](https://img.shields.io/badge/Backend-API%20Live-4B32C3?style=for-the-badge&logo=render)](https://url-shortener-api-k6gj.onrender.com)

*React · Node.js · TypeScript · PostgreSQL · Redis · Docker*

</div>

---

## What makes Snip different?

Most URL shortener tutorials stop at basic CRUD. Snip goes further — it's built with the same patterns used in production systems:

| Problem | Solution |
|---|---|
| Repeated DB hits on popular links | **Redis cache-aside** — serves redirects from memory in ~1–5ms |
| API abuse / spam | **Sliding window rate limiting** — smoother than fixed window, no burst loopholes |
| Secure user data | **JWT authentication** on all dashboard and link management routes |
| Real-world observability | **Per-link analytics** — click tracking on every redirect |
| Fast QR sharing | **On-demand QR code generation** per short URL |
| Local reproducibility | **Docker Compose** — one command to run the full stack |

---

## Architecture

```
┌──────────────────────┐
│    React Frontend    │
│  Dashboard · Auth    │
└──────────┬───────────┘
           │ REST API (JWT-protected)
           ▼
┌──────────────────────┐
│   Node.js + Express  │
│  TypeScript · Prisma │
└──────┬───────────────┘
       │
  ┌────┴──────────────┐
  ▼                   ▼
┌──────────────┐  ┌───────────────┐
│  PostgreSQL  │  │     Redis     │
│ Users/Links  │  │ Cache / Limits│
└──────────────┘  └───────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express, **TypeScript** |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache & Rate Limiting | Redis |
| Auth | JWT |
| QR Code | `qrcode` |
| Deployment | Vercel (frontend) · Render (backend) |
| Local Dev | Docker · Docker Compose |

---

## Features

**For Users**
- Register and log in with JWT-based authentication
- Create short URLs from any long link
- View, search, and filter your links from a personal dashboard
- Deactivate links at any time
- Copy short link to clipboard in one click
- Download a QR code for any link
- View click analytics per link

**Backend / Infrastructure**
- Redis cache-aside for near-instant redirects on popular links
- Sliding window rate limiting to prevent API abuse
- Click tracking on every redirect event
- Fully typed TypeScript codebase
- Docker Compose for reproducible local setup
- Deployed and publicly accessible

---

## Local Setup

**Requirements:** Docker and Docker Compose

```bash
git clone https://github.com/yourusername/snip-url-shortener.git
cd snip-url-shortener
cp Backend/.env.example Backend/.env   # fill in values
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## Environment Variables

**Backend — `Backend/.env`**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@db:5432/urlshortener
JWT_SECRET=your_secret_key
REDIS_URL=redis://redis:6379
BASE_URL=http://localhost:5000
```

**Frontend — `Frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create a new account |
| `POST` | `/api/v1/auth/login` | Log in and receive a JWT |

```json
{ "email": "user@gmail.com", "password": "yourpassword" }
```

### Links `(JWT required)`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/links` | Create a short URL |
| `GET` | `/api/v1/links` | Get all your links |
| `DELETE` | `/api/v1/links/:shortCode` | Deactivate a link |
| `GET` | `/:shortCode` | Redirect to original URL *(public)* |

```json
{ "originalUrl": "https://example.com/very/long/path" }
```

### Analytics & QR

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/analytics/:shortCode` | ✅ | Click data for a link |
| `GET` | `/api/v1/qr/:shortCode` | ❌ | QR code image *(public)* |

---

## Key Design Decisions

### Sliding Window Rate Limiting
Fixed window rate limiting has a known burst problem — a user can make 10 requests at 12:59 and 10 more at 1:00, effectively doubling the allowed rate in a two-second window. Sliding window tracks requests over a rolling period, eliminating this gap and providing consistent protection.

### Cache-Aside Pattern

```
Incoming redirect request
  └─► Check Redis
        ├─ HIT  → return URL immediately (~1–5ms)
        └─ MISS → query PostgreSQL → write to Redis → return URL (~50–200ms)
```

Write-through caching would add unnecessary complexity for a redirect-heavy workload. Cache-aside keeps it simple: reads are fast, writes go to the DB first.

### Why PostgreSQL?
Users own links. Links own analytics. These relationships benefit from joins, foreign keys, and indexed queries — all areas where PostgreSQL is purpose-built.

### Why Redis?
Short-lived, high-frequency data is Redis's sweet spot: redirect lookups happen constantly, rate limit counters need atomic increments, and neither needs durable storage.

---

## Performance at a Glance

| Scenario | Without Redis | With Redis |
|---|---|---|
| Popular link redirect | DB query on every hit | Served from memory |
| Response time | ~50–200ms | ~1–5ms |
| DB load under traffic | High | Significantly reduced |

---

## Project Structure

```
snip/
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

## Roadmap

- [ ] Custom short aliases
- [ ] Link expiry / TTL
- [ ] Device & country analytics
- [ ] CSV export
- [ ] Link folders and tags
- [ ] Team workspaces
- [ ] CI/CD pipeline

---

## Author

**Arvind Kumar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-myprofile-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/arvind2006/)
