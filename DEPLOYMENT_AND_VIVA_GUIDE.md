# 🎓 Presentation & Viva Guide: Your Secret Diary (MERN)

This guide contains everything you need to show your project to your sir with 100% confidence, run it smoothly, and answer any technical questions.

---

## ⚡ 1. How to Run the Demo for Your Sir Right Now (3 Steps)

### Step 1: Open PowerShell or Command Prompt
Navigate to your project directory:
```bash
cd "c:\Users\hp\OneDrive\Desktop\FullStackProjects\Your-Secret-Diary"
```

### Step 2: Build & Start the Full-Stack App
Run:
```bash
npm run build
npm start
```

### Step 3: Open in Browser
Open: **[http://localhost:5000](http://localhost:5000)**

That's it! Both the frontend React app and Express backend are running together on Port 5000.

---

## 🧸 2. Recommended Walkthrough Flow for Your Sir

1. **Landing Page**:
   - Show the clean hero section, aesthetic stickers, and responsive layout.
2. **Login / Signup**:
   - You can either click "Log in" and use the instant demo credentials:
     - **Email:** `demo@example.com`
     - **Password:** `demo123`
   - Or click "Create diary" to show live registration with password validation and atmosphere/theme selection (e.g. *Soft & Dreamy*, *Warm & Cozy*, *Midnight Thoughts*, *Playful*).
3. **Dashboard**:
   - Show dynamic stats (Total Entries, Moments Felt, Memories Saved).
   - Show recent entry cards.
4. **Create New Entry ("Write today's story")**:
   - Enter a title, pick an emoji mood, write some thoughts.
   - **Upload an image or photo**: Show that it uploads, previews, and is saved permanently into the database.
   - Click "Keep this memory safe ♡".
5. **My Diary Pages (All Entries)**:
   - Show the live search filter (type any keyword or date to filter instantly).
6. **Entry Details & Edit / Delete**:
   - Click an entry to view full page, show the saved photo, click "Edit" to modify it, or demonstrate the delete functionality.
7. **Memory Calendar**:
   - Show how the current month's dates are highlighted with the user's recorded moods. Clicking a date opens that day's entry.
8. **Memories Wall**:
   - Show the multimedia scrapbook gallery of all uploaded photos with timestamps.
9. **Weekly Reflection**:
   - Show the automated emotional analysis: counts entries, calculates dominant mood, and gives tailored psychological advice.
10. **Profile**:
    - Show theme switching (changing the theme updates CSS variables instantly across the whole app).

---

## ☁️ 3. Cloud Deployment (Step-by-Step)

### Option A: Render (Easiest Free Hosting for Full-Stack MERN)
1. Initialize git and push to GitHub (if not already):
   ```bash
   git init
   git add .
   git commit -m "Complete MERN Secret Diary project"
   # push to your GitHub repo
   ```
2. Go to **[https://render.com](https://render.com)** and sign in.
3. Click **New +** -> **Web Service**.
4. Select your GitHub repository.
5. Configure:
   - **Name**: `your-secret-diary`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `secret_diary_super_secret_key_2026`
   - `MONGO_URI` = `mongodb+srv://rekhachopra969_db_user:Rekha2007@cluster0.eqemjml.mongodb.net/secret_diary?retryWrites=true&w=majority&appName=Cluster0`
7. Click **Create Web Service**. Render will build and deploy your app with a free `.onrender.com` URL!

---

## 💡 4. Top 10 Viva / Sir Questions & Answers

### Q1: What architecture does this application follow?
**Ans:** It follows the **MERN** architecture (MongoDB, Express, React, Node.js) with a **RESTful API** client-server separation. The React single-page application communicates with Express endpoints via HTTP JSON requests, authenticated using stateless JWT tokens.

### Q2: How does authentication work?
**Ans:**
- User passwords are encrypted using **bcryptjs** (with salt rounds) before storing in the database.
- On login, passwords are verified via `bcrypt.compare`.
- A **JSON Web Token (JWT)** is signed on the server containing the user ID and sent to the client.
- The client stores the token in `localStorage` and attaches it as `Authorization: Bearer <token>` for all protected API calls.

### Q3: What is the database schema?
**Ans:** There are two primary schemas:
1. **User Schema**: `name`, `email` (unique index), `password` (hashed), `theme`, `timestamps`.
2. **Entry Schema**: `user` (reference to User ID), `title`, `content`, `mood`, `date`, `media` (array of objects storing name, type, and url), `timestamps`.

### Q4: How are image uploads handled?
**Ans:** Images uploaded in the browser are processed into Base64 Data URLs using the HTML5 `FileReader` API and saved directly in the entry document's media array. This ensures photos persist permanently in the database across devices and reloads without needing an external third-party storage bucket.

### Q5: How is state managed on the frontend?
**Ans:** Global authentication and theme states are managed through **React Context API** (`AuthContext`). Component-level states for entries, loading flags, search filters, and form inputs are managed using React Hooks (`useState` and `useEffect`).

### Q6: What does the backend fallback / resilient database feature do?
**Ans:** The backend tries to connect to **MongoDB Atlas Cloud**. If a student presents in an environment where port 27017 is blocked by a college firewall or IP whitelist, the backend automatically fails over to a local persistent JSON database (`server/data/diary_db.json`). This ensures 100% uptime during demonstrations.

### Q7: What are the main HTTP methods used in the API?
**Ans:**
- `GET`: Retrieve entries, user profile, and weekly summary.
- `POST`: Create new accounts, login, and create new diary entries.
- `PUT`: Update existing entries or user profile theme.
- `DELETE`: Remove diary entries.

### Q8: What is CORS and why is it used?
**Ans:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts requests from one domain to another. We use the `cors()` middleware in Express so our React frontend (running on port 5173 during development) can securely interact with the backend API on port 5000.

### Q9: How is routing handled?
**Ans:**
- **Frontend Routing**: Managed client-side by **React Router DOM v7** with `ProtectedRoute` guards that redirect unauthenticated visitors to `/login`.
- **Backend Routing**: Managed by Express modular routers (`express.Router()`) separated into `authRoutes` and `entryRoutes`.

### Q10: How does the Weekly Reflection feature work?
**Ans:** The backend aggregates the user's entries over the past 7 days, evaluates emotional distributions (mood counts), determines the dominant emotion, and provides contextual reflection text and recommendations.
