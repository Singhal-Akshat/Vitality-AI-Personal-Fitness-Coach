# ⚡ Vitality AI - Personal Fitness Coach

Vitality AI is a state-of-the-art personal fitness companion that combines data-driven tracking with AI-powered coaching. Built to provide personalized advice while ensuring user safety through intelligent guardrails.

---

## 🚀 Live Demo
- **Frontend:** [Hosted on Vercel](https://vitality-ai-personal-fitness-coach.vercel.app/)

---

## ✨ Key Features

### 📊 Comprehensive Dashboard
Get a high-level overview of your fitness journey, including recent activities, water intake, and personalized milestones.

### 🤖 AI-Powered Coaching (Gemini 3.1 Flash)
- **Personalized Insights:** Receive tailored fitness tips based on your profile and recent logs.
- **Smart Milestones:** Get AI-generated achievements that celebrate your specific progress.
- **Supportive Interaction:** A coach that understands your experience level and goals.

### 🛡️ Safety Guardrails
Vitality AI isn't just about pushing harder; it's about pushing smarter:
- **Weight Goal Validation:** Checks if your target weight loss is sustainable (0.5kg - 1kg/week).
- **Activity Spike Detection:** Warns you if a session is significantly more intense than your recent average.
- **Overtraining Prevention:** Monitors weekly volume and sessions to suggest dedicated rest days.

### 💧 Health Tracking
- **Activity Logging:** Track duration and type of workouts.
- **Hydration Tracker:** Simple interface to log and monitor daily water intake.
- **Progress Trends:** Visualize your consistency and activity patterns.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS (Modern, responsive UI)
- **Icons:** Lucide React
- **Routing:** React Router 7
- **AI Integration:** Google Generative AI (Gemini SDK)

### Backend
- **Server:** Flask (Python)
- **AI Engine:** Google Gemini 3.1 Flash
- **Deployment:** Gunicorn (Production-ready WSGI server)
- **Security:** Flask-CORS, Python-dotenv

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Singhal-Akshat/Vitality-AI-Personal-Fitness-Coach.git
cd Vitality-AI-Personal-Fitness-Coach
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=5000
```
Run the server:
```bash
python app.py
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
Run the development server:
```bash
npm run dev
```

---

## 🌐 Deployment

### Frontend (Vercel)
The frontend is optimized for Vercel deployment. Ensure the `VITE_API_URL` is set to your Render backend URL in Vercel's environment variables.

### Backend (Render)
The backend is configured for Render. Use the following build/start commands:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`

---

## 📜 License
This project is licensed under the MIT License.

---

## 👨‍💻 Developed By
**Akshat Singhal**  
[GitHub](https://github.com/Singhal-Akshat) | [LinkedIn](https://linkedin.com/in/akshatsinghal)

> *Disclaimer: Vitality AI is an AI coach, not a medical professional. Always consult with a doctor before starting a new exercise program.*
