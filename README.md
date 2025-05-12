# Chanakya – AI Financial Wellness Coach

A full-stack, modular web application that provides intelligent financial guidance and wellness tracking through a modern chat interface.

## Features
- User registration (email, first/last name, mobile, password)
- Secure login and JWT authentication
- Fetch and update user profile (first/last name, email, mobile, address)
- Password reset (upsert password via email)
- Track income and expenses
- Mood Tracker with PERMA model (Positive Emotion, Engagement, Relationships, Meaning, Accomplishment)
- Limit to 2 mood check-ins per user per day for healthy usage
- MoodSession model for storing mood analytics, answers, and summaries
- Personalized budgeting advice (GPT-4 or Groq API)
- Chat memory and natural conversation
- Mood-aware prompts and mood-based AI suggestions
- Robust error handling and validation
- Modern, responsive frontend UI (React, Tailwind, Recharts)
- Docker-ready and environment-based config
- Secure API endpoints, .env never committed to git

## PERMA Model in Mood Tracker

The Mood Tracker is based on the PERMA model of well-being, which measures:

- **P**ositive Emotion
- **E**ngagement
- **R**elationships
- **M**eaning
- **A**ccomplishment

Users answer daily questions aligned to each pillar, helping track and improve overall well-being through actionable AI insights.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Recharts, Axios
- **Backend:** Flask, LangChain, SQLAlchemy, Alembic, Flask-JWT-Extended, Flask-Mail, CORS
- **AI:** GPT-4 (OpenAI) or Groq API
- **Other:** Docker, .env for secrets, responsive UI

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create a `.env` file (see `.env.example` if present) and set your environment variables (e.g., `OPENAI_API_KEY`, database URL, JWT secret, mail server config, etc.).
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the backend:
   ```bash
   flask run
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the frontend:
   ```bash
   npm start
   # or
   yarn start
   ```

---

### Environment Variables
- Never commit `.env` to version control. Ensure `.env` is listed in `.gitignore`.
- Required variables for backend include: `OPENAI_API_KEY`, `DATABASE_URL`, `JWT_SECRET_KEY`, `MAIL_SERVER`, etc.
- For AI features, set either `OPENAI_API_KEY` or `GROQ_API_KEY` as appropriate.

---


## Project Structure
```
├── backend/
│   ├── app.py
│   ├── routes/
│   │   ├── chat.py
│   │   ├── budget.py
│   │   └── mood.py
│   ├── chanakya_chain/
│   │   ├── memory.py
│   │   └── prompts.py
│   ├── db/
│   │   └── models.py
│   ├── utils/
│   │   └── helpers.py
│   ├── alembic/ (migrations)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── BudgetForm.jsx
│   │   │   ├── MoodTracker.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── .env
├── README.md
└── docker-compose.yml
```

---

## Setup & Usage

### 1. Backend (Flask API)
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

#### Main Endpoints
- `POST /auth/register` – Register user (fields: email, password, first_name, last_name, mobile_number)
- `POST /auth/login` – Login with email and password
- `GET /auth/profile` – Get user profile (JWT required)
- `PUT /auth/profile` – Update user profile (JWT required)
- `POST /auth/reset_password` – Reset password by email

All endpoints return JSON and handle errors (e.g., duplicate email, missing fields).
# Run DB migrations (if needed)
alembic upgrade head
flask run  # or python app.py
```

### 2. Frontend (React UI)
```bash
cd frontend
npm install
npm start
```

#### Frontend Features
- Signup form with email, first/last name, mobile, password
- Login form with password reset modal
- Profile page with fetch/update logic and validation
- Error and success messaging for all user actions
- Loading skeletons and modern UI/UX


### 3. Environment Variables
Create a `.env` file in the project root:
```
GROQ_API_KEY=your_groq_or_openai_key
FLASK_ENV=development
```

### 4. Docker (optional)
```bash
docker-compose up --build
```

---

## Alembic Migrations
- Use Alembic for DB schema changes:
  - `alembic revision --autogenerate -m "your message"`
  - `alembic upgrade head`

---

## Notes
- Make sure ports 5001 (backend) and 3000 (frontend) are available.
- For production, use a real database (Postgres recommended, see docker-compose).
- Update `.env` with your API keys and secrets.

---

## License
MIT
