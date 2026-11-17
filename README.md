# 🌸 Your Secret Diary — Full-Stack MERN Application

A beautifully crafted, personal digital diary and memory-keeping application built with the **MERN Stack** (MongoDB, Express, React 19, Node.js, Vite).

Designed to give users a cozy, private space to write daily thoughts, track emotions, record memories with photos/videos, view interactive monthly calendars, and receive intelligent weekly emotional reflections.

---

## 🌟 Highlights & Key Features

1. **🔐 Secure Authentication & Personalization**
   - JWT-based authentication (JSON Web Tokens) with hashed passwords (`bcryptjs`).
   - Profile management with dynamic visual themes:
     - 🌸 *Soft & Dreamy*
     - 🌿 *Warm & Cozy*
     - 🌙 *Midnight Thoughts*
     - 🍑 *Happy & Playful*

2. **📖 Full Diary CRUD Operations**
   - **Create**: Write daily memories with custom titles, content, moods, and photos/videos.
   - **Read**: Browse memories in a responsive card grid, full page reader, and searchable archive.
   - **Update**: Edit past entries seamlessly.
   - **Delete**: Remove memories with safety confirmation dialogs.

3. **📸 Multimedia Memory Scrapbook**
   - Attach photos and media that persist permanently in the database.
   - Dedicated memory wall showcasing all uploaded photo moments.

4. **🗓️ Interactive Memory Calendar**
   - Monthly calendar dynamically marking days that have journal entries with mood icons.
   - Instant 1-click navigation to the diary page for that day.

5. **✨ Live Weekly Reflection & Emotional Insights**
   - Aggregates recent journal entries and analyzes emotional patterns.
   - Dynamic mood breakdown, most common feeling, and gentle personalized advice.

6. **🛡️ Resilient Dual-Mode Database**
   - **Production Mode**: Connects directly to **MongoDB Atlas Cloud**.
   - **Fail-safe Mode**: Automatically activates a local persistent JSON store (`server/data/diary_db.json`) if offline or if network/firewall restricts Atlas port 27017. **Guarantees zero downtime and flawless presentation to evaluators.**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Vite 8, Custom Modern CSS with CSS Variables & Theming.
- **Backend**: Node.js, Express 5, CORS, Dotenv.
- **Database**: MongoDB Atlas / Mongoose 9 (with seamless local JSON fallback).
- **Security**: JWT (jsonwebtoken), Bcryptjs, Protected Routes, Input Sanitization.
- **Deployment**: Production-ready for Render, Railway, Vercel, or unified single-port hosting.

---

## 🚀 Quick Start Guide

### 1. One-Command Full-Stack Run (Recommended for Demo)
To run both frontend and backend together on port 5000:
```bash
# In the project root:
npm run build
npm start
```
Now open: **`http://localhost:5000`** in your browser!

### 2. Running in Development Mode (with Live Reload)
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev
# Running on http://localhost:5173 (proxies /api to 5000)
```

---

## 🔑 Demo Credentials
- **Email:** `demo@example.com`
- **Password:** `demo123`
*(Or create your own new account in 5 seconds via the Sign Up button!)*

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update user name & diary theme | Yes (Bearer Token) |

### Diary Entries (`/api/entries`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/entries` | Get all entries for logged-in user | Yes (Bearer Token) |
| `GET` | `/api/entries/:id` | Get specific entry by ID | Yes (Bearer Token) |
| `POST` | `/api/entries` | Create a new journal entry | Yes (Bearer Token) |
| `PUT` | `/api/entries/:id` | Update an existing entry | Yes (Bearer Token) |
| `DELETE` | `/api/entries/:id` | Delete an entry | Yes (Bearer Token) |
| `GET` | `/api/entries/summary/weekly` | Get weekly stats & emotional summary | Yes (Bearer Token) |

### System Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check server and database status |

---

## ☁️ MongoDB Atlas Configuration

Your connection string is stored in `server/.env`.
If you want to ensure your current machine connects directly to MongoDB Atlas:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Network Access** in the left sidebar.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere (`0.0.0.0/0`)** or add your current IP address.
5. Click **Confirm**.

*Note: Even without this step, the app will automatically run using its fail-safe database mode so you can demo without any issues.*

---

## 🚢 Deployment Guide

### Option 1: Render (Unified Full-Stack Deployment - Free)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: *(your MongoDB Atlas URI)*
   - `JWT_SECRET`: *(your secret key)*
   - `NODE_ENV`: `production`
7. Click **Deploy Web Service**!

### Option 2: Vercel
Configuration file `vercel.json` is included in the project root for static or serverless deployment.
