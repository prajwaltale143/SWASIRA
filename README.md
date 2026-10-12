# SWASIRA — Personalized Health & Nutrition Platform

*Health That Understands You*

Welcome to **SWASIRA**, a personalized, life-stage-aware health and nutrition platform. Inspired by the Indian concept of *Swasth* (health and well-being), SWASIRA combines traditional Indian food knowledge with modern nutritional science to provide daily meal guidance based on a person's age, health conditions, allergies, and dietary preferences.

---

## 🚀 Quick Start Guide (Windows PowerShell)

### 1. Install Dependencies

Open PowerShell inside the `Swasira` project folder and run:

```powershell
npm run install:all
```

This installs the required packages for the root project, backend, and frontend.

### 2. Start the Application

**Option A: One-Click Launch**

Double-click `start_swasira.bat` inside the project folder.

The script is intended to start the backend and frontend and open the application in your browser.

To stop the servers, double-click `stop_swasira.bat`.

**Option B: Terminal**

Run:

```powershell
npm run dev
```

The development servers are expected to use these addresses:

* **Backend API:** `http://localhost:5000`
* **Frontend:** `http://localhost:5173`

Open `http://localhost:5173` in your browser.

*Note: These commands and addresses depend on the project's current configuration.*

---

## 🧪 Automated Health and Reliability Check

Keep the development servers running. Open a second PowerShell terminal in the project folder and run:

```powershell
npm run check
```

If the test script is configured as described, it checks these five operations:

1. The health endpoint responds successfully.
2. User signup works.
3. User login works.
4. Onboarding information is saved.
5. A personalized diet plan can be generated.

The actual results shown in your terminal determine which operations pass.

---

## 🎯 Presentation Demo Mode

The signup page and first onboarding step may include a demo panel for team profiles.

The project documentation lists these example profiles:

* **Prajwal:** Migraine
* **Om:** Body pain / stress
* **Gauri:** Weak immunity
* **Bhumi:** Period pain / menstrual issues
* **Ritesh:** Asthma

Age, diet type, and body measurements should be entered during the demonstration rather than assumed.

*Note: Confirm that these profiles and behaviors are available in the current application before presenting them as working features.*

---

## 🛠️ Architecture and Technologies

The project documentation identifies the following technologies:

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts, and Lucide Icons.
* **Backend:** Node.js and Express.
* **Database:** SQLite, with Sequelize listed as the ORM.
* **Authentication:** JWT tokens and bcryptjs password hashing.
* **Diet Recommendation Engine:** Rule-based matching of meals with health conditions, allergies, and life-stage needs.
* **Conversational Intake:** Guided collection of user information with a structured assessment option.

*The exact technologies and implemented features should be verified against the current source code.*

---

## 🔧 Troubleshooting

### 1. Port 5000 Is Already in Use

Check which process is using port 5000 before stopping it.

In PowerShell, run:

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
```

If another process is using the port, identify it before terminating it. Avoid stopping an unknown process.

### 2. Node.js Is Not Recognized

Check whether Node.js and npm are installed:

```powershell
node -v
npm -v
```

If they are not recognized, install Node.js from the official website:

https://nodejs.org/

Restart your terminal after installation if necessary.

### 3. Blank Page or Connection Refused

* Confirm that the backend and frontend have started successfully.
* Open `http://localhost:5173` in your browser.
* Check the terminal for errors.
* Open the browser developer tools with `F12` and inspect the Console tab.
* Confirm that the frontend API configuration matches the backend address.

---

## 📜 Medical Notice

SWASIRA is intended to provide general wellness and nutritional information. It is not a substitute for professional medical advice, diagnosis, or treatment. Consult a qualified healthcare professional for medical concerns, treatment decisions, or condition-specific dietary guidance.
