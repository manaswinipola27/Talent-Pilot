# VidyāMitra — Intelligent Career Agent

> **Bridging education and employability through personalised AI guidance**

---

## 🏗️ Project Structure

```
Talent Pilot/
├── backend/
│   ├── main.py              # FastAPI entry point + CORS + router registration
│   ├── config.py            # Pydantic settings from .env
│   ├── auth_utils.py        # JWT token creation & validation
│   ├── database.py          # Supabase singleton client
│   ├── schema.sql           # Run in Supabase SQL Editor to create tables
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Copy → .env and fill API keys
│   └── routers/
│       ├── auth.py          # POST /auth/register | /auth/login
│       ├── resume.py        # POST /resume/parse  | GET /resume/report
│       ├── plan.py          # POST /plan/generate | GET /plan/current
│       ├── interview.py     # POST /interview/start | /evaluate | GET /history
│       ├── quiz.py          # POST /quiz/generate | /submit | GET /history
│       ├── evaluate.py      # GET /evaluate/resources | /news | /market
│       ├── jobs.py          # GET /jobs/search
│       └── progress.py      # GET /progress/summary | /timeline
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css        # Full dark-mode design system
        ├── api/client.js    # Axios + JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/Sidebar.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── Dashboard.jsx
            ├── ResumePage.jsx
            ├── PlanPage.jsx
            ├── InterviewPage.jsx
            ├── QuizPage.jsx
            ├── ResourcesPage.jsx
            └── JobsPage.jsx
```

---

## 🚀 Setup Instructions

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste & run `backend/schema.sql`
3. Copy your **Project URL** and **Service Role Key**

### 2. Get API Keys
| Service | Where to get it |
|---------|----------------|
| OpenAI  | [platform.openai.com](https://platform.openai.com) |
| YouTube Data API v3 | [console.cloud.google.com](https://console.cloud.google.com) |
| Google Custom Search | [programmablesearchengine.google.com](https://programmablesearchengine.google.com) |
| Pexels  | [pexels.com/api](https://www.pexels.com/api/) |
| NewsAPI | [newsapi.org](https://newsapi.org) |
| ExchangeRate | [exchangerate-api.com](https://www.exchangerate-api.com) |

### 3. Backend Setup (Terminal 1)
```powershell
cd "Talent Pilot/backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your real keys
uvicorn main:app --reload --port 8000
```

📖 Swagger UI: http://localhost:8000/docs

### 4. Frontend Setup (Terminal 2)
```powershell
cd "Talent Pilot/frontend"
npm install
npm run dev
```

🌐 App: http://localhost:3000

---

## 🔌 API Modules

| Router | Prefix | Key Endpoints |
|--------|--------|--------------|
| Auth | `/auth` | `POST /register`, `POST /login` |
| Resume | `/resume` | `POST /parse`, `GET /report` |
| Plan | `/plan` | `POST /generate`, `GET /current` |
| Interview | `/interview` | `POST /start`, `POST /evaluate` |
| Quiz | `/quiz` | `POST /generate`, `POST /submit` |
| Evaluate | `/evaluate` | `GET /resources`, `/news`, `/market` |
| Jobs | `/jobs` | `GET /search` |
| Progress | `/progress` | `GET /summary`, `GET /timeline` |

---

## 🛡️ Security
- All API keys stored in `.env` (never committed)
- JWT Bearer authentication on all protected routes
- Supabase Service Role Key used server-side only
- CORS restricted to localhost:3000 in development
