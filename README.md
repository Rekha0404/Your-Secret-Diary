# 🌸 Your Secret Diary

A personal digital diary where you can write about your day, save special memories, and keep track of how you feel.

I built **Your Secret Diary** as a full-stack project using the MERN stack. The idea was to create a simple and cozy space where users can write daily entries, add photos or videos, and revisit their memories whenever they want.

## ✨ Features

- **User Authentication:** Sign up and log in securely using JWT authentication and hashed passwords.
- **Diary Entries:** Create, view, edit, and delete your daily entries.
- **Mood Tracking:** Add a mood to your diary entries and look back at how you were feeling.
- **Photo & Video Memories:** Add media to make your diary entries more personal.
- **Memory Calendar:** View your entries through a monthly calendar.
- **Weekly Summary:** Get a summary of your recent entries and mood patterns.
- **Personalized Themes:** Choose from different diary themes to customize your experience.

## 🛠️ Technologies Used

- **Frontend:** React 19, React Router, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** JWT, bcryptjs
- **Deployment:** Render

## 🚀 Run Locally

Follow these steps to run the project on your computer.

**1. Clone the repository**

```bash
git clone https://github.com/Rekha0404/Your-Secret-Diary.git
cd Your-Secret-Diary
```

**2. Install dependencies**

```bash
npm install
cd server
npm install
cd ..
```

**3. Set up environment variables**

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**4. Start the application**

For development, open two terminals.

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
npm run dev
```

To run the production build:

```bash
npm run build
npm start
```

## ☁️ Live Demo

Try the application here:

[Your Secret Diary – Live Website](https://your-secret-diary.onrender.com)

You can create your own account using the Sign Up option.

## 📡 API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/entries` | Get diary entries |
| POST | `/api/entries` | Create an entry |
| GET | `/api/entries/:id` | Get a specific entry |
| PUT | `/api/entries/:id` | Update an entry |
| DELETE | `/api/entries/:id` | Delete an entry |
| GET | `/api/entries/summary/weekly` | Get weekly summary |
| GET | `/api/health` | Check server status |

## 💭 What I Learned

Building this project helped me understand how a frontend and backend work together in a real application. I got practical experience with REST APIs, authentication, database integration, CRUD operations, environment variables, and deployment.

There is still room to improve, and I hope to keep adding more features to it.

---

Made with 💗 by Rekha
