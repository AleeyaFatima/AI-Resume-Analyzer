# ResumeIQ AI

> **Transform Your Resume. Unlock More Opportunities with AI.**
>
> Developed by **Aleeya Fatima**

ResumeIQ AI is a premium, modern AI-powered resume analysis and optimization platform designed to act as your personal career coach. It parses resumes, evaluates them against Applicant Tracking System (ATS) standards, detects formatting issues, identifies missing keywords, and generates customized technical and behavioral interview preparation question sets.

---

## 🌟 Key Features

* **Glassmorphic Interactive 3D Cube**: An elegant, hardware-accelerated 3D object in the hero section that tilts to track your cursor, spins dynamically on click, and cycles through five vibrant neon theme states.
* **ATS Compatibility Score**: Estimates how standard recruitment scanning bots parse and classify your resume structure.
* **Resume Quality Score**: Grades section formatting, email/link presence, double-space warnings, and achievements density.
* **Missing Keywords & Skills Gaps**: Cross-references parsed text against a tech-skill taxonomy to extract language, framework, database, and cloud gaps.
* **Tailored Interview Coach**: Generates customized interview preparation sets (Technical, Behavioral, HR) with sample answers mapped directly to your skills.
* **Job Description Matcher**: Paste target job specs to evaluate matching density percentages and get suggestions.
* **Downloadable Reports**: Print and review full analysis results.

---

## 🛠️ Technology Stack

### Frontend Client
* **React 19 & TypeScript**: Component structure and logic.
* **Tailwind CSS**: Custom color palette, spacing, and layout configurations.
* **Framer Motion**: Page transitions, bouncy navigation pill animations, and interactive 3D scene physics.
* **Recharts**: Animated analytics charts (Radar, Bar, Line) for rating distributions and trends.
* **Lucide Icons**: Modern vector icon design.

### Backend Engine
* **Python 3.11**: AI processing and core text extraction logic.
* **FastAPI**: Production-ready, asynchronous web framework endpoints.
* **Uvicorn**: Lightweight server.
* **pdfplumber & python-docx**: Document text extraction.
* **scikit-learn**: Skill density mapping.

---

## 🚀 Local Installation & Run

### 1. Run the Backend Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python run.py
   ```
   *The server runs locally on `http://127.0.0.1:8080`.*

### 2. Run the Frontend Client
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173/` in your browser.*

---

## 🌐 Live Deployment on Render

This project contains a [render.yaml](./render.yaml) blueprint file at the root. Pushing the codebase to GitHub and connecting it to Render automatically deploys both services:
1. **`resumeiq-backend`** (Python FastAPI Web Service)
2. **`resumeiq-frontend`** (Static Site hosting the compiled React client)

The frontend automatically resolves the live backend URL using Render's cross-service references.

---

## 📄 License

This project is open-source and licensed under the [MIT License](./LICENSE).

&copy; 2026 Aleeya Fatima. All rights reserved.
