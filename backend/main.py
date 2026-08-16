import os
from typing import List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from database import engine, get_db, Base
from sample_data import seed_sample_data
from services.parser import extract_text_from_pdf, extract_text_from_image, parse_medical_report
from services.comparator import compare_two_reports
from services.rag_engine import generate_rag_response, TRUSTED_KNOWLEDGE_DOCS

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Beat Healthcare API",
    description="Backend API for Beat - AI Healthcare Information and Health Monitoring Platform",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto seed database on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed_sample_data(db)

# Pydantic Request Models
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "password123"

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = "password123"

class ChatRequest(BaseModel):
    query: str
    report_id: Optional[int] = None

# Helper dependency to verify registered email
def verify_registered_user(user_email: str, db: Session):
    email_clean = user_email.strip().lower()
    if email_clean == "demo@beat.health" or email_clean == "alex.morgan@beat.health":
        return email_clean

    user = db.query(models.User).filter(models.User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="This email address is not registered. Please sign up first."
        )
    return email_clean

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Beat Healthcare Platform",
        "tagline": "Your Health, Our Pulse"
    }

# AUTHENTICATION ENDPOINTS
@app.post("/api/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new patient user account."""
    email_clean = req.email.strip().lower()
    if not email_clean:
        raise HTTPException(status_code=400, detail="Email address is required.")

    existing = db.query(models.User).filter(models.User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email address is already registered. Please sign in instead.")

    patient_num = 1000 + db.query(models.User).count() + 1
    new_user = models.User(
        name=req.name.strip() or "Patient",
        email=email_clean,
        password=req.password or "password123",
        patient_id=f"PAT-{patient_num}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    name_parts = new_user.name.split()
    initials = "".join([p[0].upper() for p in name_parts[:2]]) if name_parts else "P"

    return {
        "name": new_user.name,
        "email": new_user.email,
        "patientId": new_user.patient_id,
        "initials": initials,
        "isDemo": False
    }

@app.post("/api/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user login. Checks whether the email exists in registered accounts."""
    email_clean = req.email.strip().lower()
    if not email_clean:
        raise HTTPException(status_code=400, detail="Email address is required.")

    # Allow Quick Demo account
    if email_clean == "demo@beat.health" or email_clean == "alex.morgan@beat.health":
        return {
            "name": "Alex Morgan",
            "email": "demo@beat.health",
            "patientId": "PAT-8921",
            "initials": "AM",
            "isDemo": True
        }

    # Verify registered account in database
    user = db.query(models.User).filter(models.User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="This email address is not registered. Please sign up first."
        )

    name_parts = user.name.split()
    initials = "".join([p[0].upper() for p in name_parts[:2]]) if name_parts else "P"

    return {
        "name": user.name,
        "email": user.email,
        "patientId": user.patient_id,
        "initials": initials,
        "isDemo": False
    }

# REPORT & MEDICAL DATA ENDPOINTS (STRICTLY ISOLATED PER REGISTERED USER)
@app.post("/api/reports/upload")
async def upload_medical_report(
    file: UploadFile = File(...),
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Upload PDF or Image medical report, strictly bound to verified user account."""
    verified_email = verify_registered_user(user_email, db)

    contents = await file.read()
    file_name = file.filename
    file_type = file.content_type or ""

    # Text extraction pipeline
    if "pdf" in file_type.lower() or file_name.endswith(".pdf"):
        raw_text = extract_text_from_pdf(contents)
    else:
        raw_text = extract_text_from_image(contents)

    # Medical Parameter Identification & Summary Generation
    parsed_data = parse_medical_report(raw_text, file_name, file_type)

    # Persist report strictly tied to verified user_email
    db_report = models.Report(
        user_email=verified_email,
        title=parsed_data["title"],
        patient_name=parsed_data.get("patient_name", "Mrs. Sabina"),
        report_date=parsed_data["report_date"],
        lab_name=parsed_data["lab_name"],
        summary=parsed_data["summary"],
        raw_text=raw_text,
        file_name=file_name,
        file_type=file_type
    )
    db.add(db_report)
    db.flush()

    param_entries = []
    for p in parsed_data["extracted_parameters"]:
        pe = models.ParameterEntry(
            report_id=db_report.id,
            name=p["name"],
            category=p["category"],
            value_str=p["value_str"],
            numerical_value=p.get("numerical_value"),
            unit=p["unit"],
            reference_range=p.get("reference_range", "Not provided"),
            min_ref=p.get("min_ref"),
            max_ref=p.get("max_ref"),
            frequency=p.get("frequency", "Not applicable"),
            duration=p.get("duration", "Not applicable"),
            status=p.get("status", "Found"),
            observation=p.get("observation", "As reported"),
            extraction_status=p.get("extraction_status", "Confirmed")
        )
        param_entries.append(pe)

    db.add_all(param_entries)
    db.commit()
    db.refresh(db_report)

    return {
        "id": db_report.id,
        "user_email": db_report.user_email,
        "title": db_report.title,
        "patient_name": db_report.patient_name,
        "report_date": db_report.report_date,
        "lab_name": db_report.lab_name,
        "summary": db_report.summary,
        "parameters": [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "value_str": p.value_str,
                "numerical_value": p.numerical_value,
                "unit": p.unit,
                "reference_range": p.reference_range,
                "frequency": getattr(p, "frequency", "Not applicable"),
                "duration": getattr(p, "duration", "Not applicable"),
                "status": p.status,
                "observation": p.observation,
                "extraction_status": getattr(p, "extraction_status", "Confirmed")
            } for p in db_report.parameters
        ]
    }

@app.get("/api/reports")
def get_all_reports(
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Fetch list of uploaded reports belonging ONLY to the verified requesting email account."""
    verified_email = verify_registered_user(user_email, db)

    reports = db.query(models.Report).filter(models.Report.user_email == verified_email).order_by(models.Report.report_date.asc()).all()
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "user_email": r.user_email,
            "title": r.title,
            "patient_name": r.patient_name,
            "report_date": r.report_date,
            "lab_name": r.lab_name,
            "summary": r.summary,
            "file_name": r.file_name,
            "parameter_count": len(r.parameters),
            "parameters": [
                {
                    "id": p.id,
                    "name": p.name,
                    "category": p.category,
                    "value_str": p.value_str,
                    "numerical_value": p.numerical_value,
                    "unit": p.unit,
                    "reference_range": p.reference_range,
                    "frequency": getattr(p, "frequency", "Not applicable"),
                    "duration": getattr(p, "duration", "Not applicable"),
                    "status": p.status,
                    "observation": p.observation,
                    "extraction_status": getattr(p, "extraction_status", "Confirmed")
                } for p in r.parameters
            ]
        })
    return result

@app.get("/api/reports/compare")
def compare_reports(
    prev_id: int = Query(..., description="ID of previous report"),
    latest_id: int = Query(..., description="ID of latest report"),
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Side-by-side report comparison restricted strictly to verified user reports."""
    verified_email = verify_registered_user(user_email, db)

    r_prev = db.query(models.Report).filter(models.Report.id == prev_id, models.Report.user_email == verified_email).first()
    r_latest = db.query(models.Report).filter(models.Report.id == latest_id, models.Report.user_email == verified_email).first()

    if not r_prev or not r_latest:
        raise HTTPException(status_code=404, detail="One or both reports not found for this account")

    return compare_two_reports(r_prev, r_latest)

@app.get("/api/reports/{report_id}")
def get_report_by_id(
    report_id: int,
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Fetch single report with verified user account check."""
    verified_email = verify_registered_user(user_email, db)

    r = db.query(models.Report).filter(models.Report.id == report_id, models.Report.user_email == verified_email).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found for this account")
    
    return {
        "id": r.id,
        "user_email": r.user_email,
        "title": r.title,
        "patient_name": r.patient_name,
        "report_date": r.report_date,
        "lab_name": r.lab_name,
        "summary": r.summary,
        "raw_text": r.raw_text,
        "file_name": r.file_name,
        "parameters": [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "value_str": p.value_str,
                "numerical_value": p.numerical_value,
                "unit": p.unit,
                "reference_range": p.reference_range,
                "frequency": getattr(p, "frequency", "Not applicable"),
                "duration": getattr(p, "duration", "Not applicable"),
                "status": p.status,
                "observation": p.observation,
                "extraction_status": getattr(p, "extraction_status", "Confirmed")
            } for p in r.parameters
        ]
    }

@app.delete("/api/reports/{report_id}")
def delete_report(
    report_id: int,
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Delete a report with user account verification."""
    verified_email = verify_registered_user(user_email, db)

    r = db.query(models.Report).filter(models.Report.id == report_id, models.Report.user_email == verified_email).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found for this account")
    db.delete(r)
    db.commit()
    return {"message": f"Report #{report_id} deleted successfully"}

@app.post("/api/reports/seed-sample")
def trigger_seed(db: Session = Depends(get_db)):
    """Reset and re-seed sample demo reports."""
    db.query(models.ParameterEntry).delete()
    db.query(models.Report).delete()
    db.query(models.KnowledgeDoc).delete()
    db.commit()
    seed_sample_data(db)
    return {"message": "Sample reports re-seeded successfully"}

@app.get("/api/history/trends")
def get_health_history_trends(
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """Get aggregated parameter time series for trend visualization for verified user."""
    verified_email = verify_registered_user(user_email, db)

    reports = db.query(models.Report).filter(models.Report.user_email == verified_email).order_by(models.Report.report_date.asc()).all()
    
    parameter_trends = {}

    for r in reports:
        date_label = r.report_date
        for p in r.parameters:
            if p.numerical_value is not None:
                p_name = p.name
                if p_name not in parameter_trends:
                    parameter_trends[p_name] = {
                        "name": p_name,
                        "unit": p.unit,
                        "category": p.category,
                        "reference_range": p.reference_range,
                        "min_ref": p.min_ref,
                        "max_ref": p.max_ref,
                        "data": []
                    }
                parameter_trends[p_name]["data"].append({
                    "date": date_label,
                    "value": p.numerical_value,
                    "value_str": p.value_str,
                    "status": p.status,
                    "report_id": r.id,
                    "report_title": r.title
                })

    return {
        "tracked_parameters": list(parameter_trends.keys()),
        "trends": parameter_trends,
        "total_reports": len(reports)
    }

@app.post("/api/assistant/chat")
def chat_healthcare_assistant(
    req: ChatRequest,
    user_email: str = Header(default="demo@beat.health", alias="X-User-Email"),
    db: Session = Depends(get_db)
):
    """RAG-based Beat Healthcare Assistant for verified user account."""
    verified_email = verify_registered_user(user_email, db)

    report_context = None
    if req.report_id:
        r = db.query(models.Report).filter(models.Report.id == req.report_id, models.Report.user_email == verified_email).first()
        if r:
            report_context = {
                "id": r.id,
                "title": r.title,
                "report_date": r.report_date,
                "summary": r.summary,
                "parameters": [
                    {
                        "name": p.name,
                        "value_str": p.value_str,
                        "unit": p.unit,
                        "reference_range": p.reference_range,
                        "status": p.status,
                        "numerical_value": p.numerical_value,
                        "frequency": getattr(p, "frequency", "Not applicable"),
                        "duration": getattr(p, "duration", "Not applicable"),
                        "observation": p.observation,
                        "extraction_status": getattr(p, "extraction_status", "Confirmed")
                    } for p in r.parameters
                ]
            }

    # Fetch user reports history context strictly for verified user_email
    reports = db.query(models.Report).filter(models.Report.user_email == verified_email).order_by(models.Report.report_date.desc()).all()
    history_context = []
    for r in reports:
        history_context.append({
            "id": r.id,
            "title": r.title,
            "report_date": r.report_date,
            "parameters": [
                {
                    "name": p.name,
                    "value_str": p.value_str,
                    "unit": p.unit,
                    "reference_range": p.reference_range,
                    "status": p.status,
                    "numerical_value": p.numerical_value,
                    "frequency": getattr(p, "frequency", "Not applicable"),
                    "duration": getattr(p, "duration", "Not applicable"),
                    "observation": p.observation,
                    "extraction_status": getattr(p, "extraction_status", "Confirmed")
                } for p in r.parameters
            ]
        })

    response = generate_rag_response(req.query, report_context, history_context)
    return response

@app.get("/api/knowledge")
def get_knowledge_base():
    """Retrieve indexed trusted medical documents."""
    return TRUSTED_KNOWLEDGE_DOCS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
