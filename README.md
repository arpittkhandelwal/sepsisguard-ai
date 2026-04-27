# 🛡️ SepsisGuard AI

**SepsisGuard AI** is a state-of-the-art, high-fidelity clinical dashboard designed for the real-time detection, monitoring, and proactive intervention of sepsis in hospital environments.

**Live Demo:** [https://sepsisai.netlify.app](https://sepsisai.netlify.app)

Built for the modern clinician, this platform bridges the gap between raw EHR data and actionable, life-saving insights using predictive AI modeling and interactive XAI (Explainable AI).

---

## ✨ Core Features

### 1. Live Risk Stratification & Monitoring
- **Real-Time Dashboards:** Monitor live sepsis risk scores for an entire ward at a glance.
- **High-Fidelity Telemetry:** Dynamic UI mimicking live ECG Lead II and PLETH waveforms for critical patient observation.
- **Vital Sign Tracking:** Seamless tracking of HR, BP, Temp, and SpO2 with visual severity indicators.

### 2. Explainable AI (XAI) Insights
- **Why The Alert?:** SepsisGuard doesn't just give a risk score. It provides "Top 3 Reasons for Risk" (e.g., Elevated Lactate, Tachycardia) so clinicians understand the driving factors behind the AI's prediction.
- **Pattern Recognition:** Visual timeline markers showing exactly when the AI model predicted a risk trajectory vs. when clinical diagnosis occurred.

### 3. "What-If" Intervention Simulator
- **Predictive Outcomes:** Clinicians can test theoretical interventions (e.g., "If I give fluids and lower the HR to 85, and raise MAP to 75, what happens to the risk score?").
- **Simulated Trajectories:** Real-time feedback calculating the theoretical improvement in patient survivability before touching the patient.

### 4. One-Click AI SBAR Handovers
- **Clinical Efficiency:** Instantly generate a Situation, Background, Assessment, and Recommendation (SBAR) handover note directly from the patient's live data.
- **Ready for EHR:** Standardized text that can be copied directly into epic/cerner or during shift changes.

### 5. Patient Registry & Triage
- **Smart Filtering:** Filter the patient registry instantly by Status (Critical, High Risk, Watch, Stable), Department, or Search by Name/ID.
- **Instant Triage:** Automatically sorts the most critical patients to the top of the queue for immediate attention.

---

## 🛠️ Technical Architecture

- **Frontend Framework:** React 19 + Vite for ultra-fast HMR and optimized production builds.
- **Styling:** Tailwind CSS v4 + PostCSS, featuring a custom, clinical-grade color palette and glassmorphic UI components.
- **Database / Backend:** Supabase (PostgreSQL) using direct `@supabase/supabase-js` client connection for real-time, serverless architecture.
- **Hosting:** Fully deployed and automatically built via Netlify CI/CD.
- **Icons & Typography:** Google Material Symbols (Outlined) and Inter font family for maximum readability.

---

## 🚀 Getting Started (Local Development)

1. **Install Dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the Vite Development Server:**
   ```bash
   cd sepsisguard-react
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🎨 Design System

SepsisGuard AI utilizes a custom Tailwind theme defined in `tailwind.config.js`:
- **Primary:** Deep clinical blues (`#005B9F`)
- **Error/Critical:** High-contrast clinical reds (`#ba1a1a`) for immediate attention.
- **Typography:** Specialized classes like `text-vital-sign`, `text-headline-lg`, and `text-label-caps` to strictly mirror physical hospital monitors.

---
*Developed for Hackathon Submission.*
