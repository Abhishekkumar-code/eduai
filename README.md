<<<<<<< HEAD
# 🎓 Problem Statement
    During conflicts and regional tensions — like the recent Iran-Israel war — 
governments often threaten to shut down the internet. In these critical times, 
students from Class 5 to 12 suffer the most. They lose access to study material, 
cannot ask questions, and their education comes to a complete stop.

# 🎓 EduAI — Smart Learning Assistant
An AI-powered educational chatbot for Class 5–12 students of India.
Ask questions in simple language and get instant answers — online or offline!

## 🚀 Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
node server.js
```

## 🌟 Live Features


- 📦 **Offline Mode** — Isko hmane json format mai data diya hai bhut sara bina internet ke bhi kaam karta hai
- 💬 **AI Chat** —  Agar internet hoga to ai se answer dega  gemini ai
- 🖼️ **Deepfake Detection** — Image real hai ya AI-generated check karo
- 📜 **Chat History** — Purane saare questions aur answers dekho
- 📱 **PWA Support** — Mobile pe install karo, bina net ke chalao
- 🏫 **Class 5–12** — Har class ka alag subject-wise data

---

## 🛠️ Tech Stack

### Frontend
| Technology | Use |
|------------|-----|
| React + Vite | UI Framework |
| React Router v6 | Navigation |
| Axios | API Calls |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Vite PWA Plugin | Offline Support |

### Backend
| Technology | Use |
|------------|-----|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| Google Gemini API | AI Answers |
| Deepfake Detection API | Image Analysis |

---
CT UNI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── deepfakeController.js
│   │   │   ├── offlineController.js
│   │   │   └── questionController.js
│   │   ├── model/
│   │   │   └── schema.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── deepfakeRoutes.js
│   │   │   ├── offlineRoutes.js
│   │   │   └── questionRoutes.js
│   │   └── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
├── dist/
├── public/
│   ├── logo(1).svg
│   └── logo.svg
├── src/
│   ├── api/
│   │   └── index.js
│   ├── assets/
│   ├── components/
│   │   ├── Sidebar.css
│   │   └── Sidebar.jsx
│   ├── data/
│   │   ├── class5.json
│   │   ├── class6.json
│   │   ├── class7.json
│   │   ├── class8.json
│   │   ├── class9.json
│   │   ├── class10.json
│   │   ├── class11.json
│   │   └── class12.json
│   ├── hooks/
│   │   └── useNetwork.js
│   ├── pages/
│   │   ├── Chat.css
│   │   ├── Chat.jsx
│   │   ├── Deepfake.css
│   │   ├── Deepfake.jsx
│   │   ├── History.css
│   │   ├── History.jsx
│   │   ├── Home.css
│   │   └── Home.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── editorlint.config.js
├── index.html
├── package.json
└── vite.config.js