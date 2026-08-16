from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, default="password123")
    patient_id = Column(String, default="PAT-1001")
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, default="demo@beat.health")
    title = Column(String, index=True)
    patient_name = Column(String, default="Patient")
    report_date = Column(String, index=True) # YYYY-MM-DD
    lab_name = Column(String, default="General Diagnostics Lab")
    summary = Column(Text)
    raw_text = Column(Text)
    file_name = Column(String)
    file_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    parameters = relationship("ParameterEntry", back_populates="report", cascade="all, delete-orphan")

class ParameterEntry(Base):
    __tablename__ = "parameter_entries"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)
    name = Column(String, index=True) # e.g., Blood Glucose, Cholesterol
    category = Column(String) # e.g., Metabolic, Lipid Panel, Blood Count, Thyroid
    value_str = Column(String) # e.g., "105", "120/80"
    numerical_value = Column(Float, nullable=True) # numeric representation for charts
    unit = Column(String) # e.g., mg/dL, %
    reference_range = Column(String) # e.g., "70-99"
    min_ref = Column(Float, nullable=True)
    max_ref = Column(Float, nullable=True)
    frequency = Column(String, nullable=True) # e.g., 1-0-1, SOS
    duration = Column(String, nullable=True) # e.g., 3 days, 1 month
    status = Column(String, default="Normal") # For backward compatibility
    observation = Column(Text)
    extraction_status = Column(String, default="Confirmed") # Confirmed, Likely, Unclear

    report = relationship("Report", back_populates="parameters")

class KnowledgeDoc(Base):
    __tablename__ = "knowledge_docs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    content = Column(Text)
    reference_range = Column(String, nullable=True)
    source = Column(String, default="Clinical Practice Guidelines")
    embedding_tokens = Column(JSON, nullable=True)
