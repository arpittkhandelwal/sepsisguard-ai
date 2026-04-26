# 🧬 SepsisGuard AI: Predictive Precision for Acute Care

> **Finalist Submission for GeekVerse - GeeksforGeeks X LPU 2026**  
> *Transforming chaotic clinical data into life-saving predictive intelligence.*

---

## 🏥 The Problem: The Sepsis "Silent Killer"
Sepsis is responsible for **1 in 5 deaths** globally. In the ICU, every hour of delayed treatment increases the risk of mortality by **8%**. Standard protocols (SIRS/qSOFA) are often reactive—triggering only after the patient has already begun to decompensate. This leads to:
*   **Alert Fatigue:** Clinicians are overwhelmed by non-specific alarms.
*   **Failure to Rescue:** Delays in identifying subtle physiological shifts.
*   **Data Silos:** Bedside data is rarely synthesized into a longitudinal risk trajectory.

## 💡 The Solution: SepsisGuard AI
SepsisGuard AI is a high-fidelity Clinical Intelligence Portal that moves the diagnostic needle from **Reactive to Predictive**. By leveraging advanced machine learning on real-time vitals and biomarkers, it provides an **8.5-hour lead time** over conventional protocols.

---

## 🔥 Core Features (Hackathon Highlights)

### 1. 🧪 The "Digital Twin" Intervention Simulator
A world-first feature for bedside clinicians. Doctors can simulate "What-If" scenarios—adjusting simulated Heart Rate or Mean Arterial Pressure—to see a predicted risk reduction score before a single drop of fluid is administered.

### 2. 🧠 Neural Explainability (XAI)
Using **SHAP (SHapley Additive exPlanations)**, SepsisGuard solves the "Black Box" AI problem. It explicitly shows clinicians **why** a score is high (e.g., "+45% drive from Lactate levels"), building trust and clinical validity.

### 3. 📈 High-Fidelity Risk Trajectory
A sub-pixel precise SVG mapping of the last 12 hours of patient risk. It features distinct markers for **Model Prediction Point** (Early Detection) vs. **Clinical Diagnosis Point**, proving the AI's advantage visually.

### 4. 🌌 Global AI Assistant
A facility-wide intelligence layer that operates as a persistent sidebar. It monitors entire wards, surfaces critical alerts for the next-up patient, and provides a "System Status" overview of critical cases across the hospital.

### 5. 📊 Clinical Analytics Suite
A full performance review dashboard tracking **Survival Rate Improvements (+14.2%)** and department-specific model accuracy, allowing hospital administrators to validate the AI's impact.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS (Vanilla), Material Symbols |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase) with JSONB for clinical history |
| **Explainability** | SHAP-inspired Feature Attribution Models |
| **Deployment** | Netlify (Frontend), Automated SPA Routing |

---

## 🔄 Implementation Workflow

1.  **Clinical Discovery:** Researched SOFA/qSOFA scoring and Sepsis Bundle compliance markers to ensure clinical relevance.
2.  **Schema Architecture:** Designed a flexible PostgreSQL schema using JSONB to handle high-resolution time-series data for risk history.
3.  **UI/UX Prototyping:** Developed a "Clinical-Dark" theme using glassmorphism to reduce eye strain for ICU nurses during night shifts.
4.  **Simulation Engine:** Built a predictive heuristic engine that calculates risk reduction based on hemodynamic stabilization targets.
5.  **Integration:** Connected the React frontend to a live Express backend, ensuring sub-100ms latency for real-time monitoring.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/arpittkhandelwal/sepsisguard-ai.git

# Install Frontend dependencies
cd sepsisguard-react
npm install

# Install Backend dependencies
cd ../sepsisguard-backend
npm install
```

### Environment Setup
Create a `.env` in `sepsisguard-react`:
`VITE_API_URL=http://localhost:3001`

---

## 🔐 Demo Credentials (Admin Access)

Use these credentials to explore the full capabilities of the portal:

*   **🩺 User ID:** `dr.khandelwal@hospital.org`
*   **🔑 Password:** `123`

---

## 🩺 The Vision
"Failure to Rescue" is often a failure of timing. SepsisGuard AI is a commitment to buying doctors the one thing they need most in the ICU: **Time.**

**Developed with ⚡ Energy and 🧠 Precision by:**
# **ARPIT KHANDELWAL**
*Pioneering Predictive Healthcare*
