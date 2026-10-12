# SWASIRA — Personalized Health & Nutrition Platform
> *"Health That Understands You"*

Welcome to **SWASIRA**, a personalized, life-stage-aware health and nutrition platform. Rooted in *"Swasth"* (the ancient philosophy of holistic well-being), SWASIRA blends time-honored Indian food wisdom with modern nutritional science to craft daily meal guidance based on your exact age, conditions, allergies, and dietary lifestyle.

---

## 🚀 Quick Start Guide (Windows PowerShell)

Follow these simple steps in **Windows PowerShell** to get SWASIRA up and running on your machine:

### 1. Install All Dependencies
Open PowerShell inside the `Swasira` folder and run:
```powershell
npm run install:all
```
*(This automatically installs root, backend, and frontend packages.)*

### 2. Start the Application
You can start SWASIRA in two ways:

#### Option A: 1-Click Launch (Easiest)
- Double-click the **Launch SWASIRA** shortcut on your **Desktop**, or
- Double-click `start_swasira.bat` inside the project folder.
*(This automatically boots the backend, frontend, and opens http://localhost:5173 in your default browser!)*

To stop all servers at any time, double-click **Stop SWASIRA** on your Desktop or `stop_swasira.bat`.

#### Option B: Terminal Command
To start both the backend API and frontend dev server simultaneously via terminal, run:
```powershell
npm run dev
```

You will see:
- 🌿 **Backend API**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

Open your web browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Automated Health & Reliability Check

To verify that the database, authentication, onboarding, and recommendation engine are functioning with 100% precision, leave your dev server running and open a second PowerShell terminal, then run:

```powershell
npm run check
```

You should see all 5 steps pass:
```text
  [PASS] Step 1: GET /api/health responded with status "ok"
  [PASS] Step 2: POST /api/auth/signup created test user
  [PASS] Step 3: POST /api/auth/login successfully authenticated
  [PASS] Step 4: POST /api/onboarding saved user health inputs
  [PASS] Step 5: GET /api/diet-plan/:userId generated personalized plan
```

---

## 🎯 Presentation Demo Mode

On the **Signup Page** and **Onboarding Step 1**, an amber **Demo Mode Presentation Panel** is visible. 
Clicking any team profile (Prajwal, Om, Gauri, Bhumi, Ritesh) pre-fills **strictly** team-specified condition details:
- **Prajwal**: Migraine
- **Om**: Body Pain / Stress (Routine: Hectic day)
- **Gauri**: Weak Immunity
- **Bhumi**: Period Pain / Menstrual Issues
- **Ritesh**: Asthma

*Note: In accordance with SWASIRA's strict data integrity rule, age, diet type, and body metrics remain null until entered live during the presentation. No fake or assumed data is ever seeded.*

---

## 🛠️ Architecture & Technologies

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize, SQLite3 (`swasira.sqlite`).
- **Authentication**: JWT token authentication with pure JavaScript `bcryptjs` password hashing.
- **Diet Recommendation Engine**: Rule-based matching prioritizing 30+ authentic homemade Indian dishes, condition compatibility, allergen exclusion, and life-stage calibration.
- **Conversational Intake Companion**: Interactive guided intake with fallback structured assessment.

---

## 🔧 Troubleshooting Guide (Windows PowerShell)

### 1. "Port 5000 is already in use"
If port 5000 is occupied by a lingering process, SWASIRA will print a clear message instead of crashing. To free port 5000 on Windows PowerShell, run:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```
Then run `npm run dev` again.

### 2. "node is not recognized as an internal or external command"
Verify that Node.js (version 18 or newer) is installed and added to your system PATH:
```powershell
node -v
npm -v
```
If not installed, download the LTS version from [https://nodejs.org/](https://nodejs.org/).

### 3. Blank Page or Connection Refused
- Ensure both servers are running via `npm run dev`.
- Ensure your browser opens `http://localhost:5173` (Vite dev server) which automatically proxies API calls to port 5000.
- Check browser console (F12) for any local extension blockers.

---

## 📜 Medical Notice
*SWASIRA provides general wellness and nutritional guidance, not prescriptive medical advice. Always consult certified clinical professionals for acute diagnoses and prescriptions.*
