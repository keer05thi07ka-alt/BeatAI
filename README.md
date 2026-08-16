# Beat AI - Patient Medical Record & AI Companion

Beat AI is an intelligent healthcare platform designed to serve as a comprehensive personal medical record and an interactive AI companion for patients. It enables users to upload medical documents, automatically extracts and tracks vital parameters over time, and provides an integrated, highly contextual RAG-powered Chat Assistant to answer questions about their health data.

## 🚀 Features
* **Smart Medical Report Parsing:** Automatically parse and structure handwritten prescriptions, blood tests, and cardiology notes using heuristic extraction and OCR fallback.
* **Health Trend Visualization:** Interactive charts tracking key health parameters (Blood Glucose, Cholesterol, Blood Pressure) across multiple visits.
* **Intelligent RAG Assistant:** An AI chatbot that can explain specific dosage frequencies (e.g., `1-0-1`), decipher complex medical terminologies, and cross-reference your specific report metrics against official ADA and NHLBI clinical guidelines.
* **Report Comparison Engine:** Compare recent tests against historical baselines to monitor improvements or declines in your health.

## 🛠️ Technology Stack
* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts
* **Backend:** FastAPI, Python, Uvicorn, Pydantic
* **AI/NLP Engine:** Custom built Retrieval-Augmented Generation (RAG) using curated medical dictionaries and fuzzy keyword matching.

## 🏃‍♂️ How to Run Locally

### 1. Start the Backend Server (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Start the Frontend Server (Vite)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

### 3. Open the App
Navigate to `http://127.0.0.1:5173` in your web browser.

## ⚠️ Disclaimer
Beat is an informational and health monitoring platform designed for personal tracking and educational purposes. **Beat does not provide medical diagnoses or replace consultations with licensed healthcare professionals.** Always consult a doctor for medical advice.
