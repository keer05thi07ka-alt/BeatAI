from sqlalchemy.orm import Session
import models
from services.rag_engine import TRUSTED_KNOWLEDGE_DOCS

def seed_sample_data(db: Session):
    """Seed sample medical reports and registered users if database is empty."""

    # Seed default registered users if not present
    if db.query(models.User).count() == 0:
        db.add(models.User(name="Alex Morgan", email="demo@beat.health", password="password123", patient_id="PAT-8921"))
        db.add(models.User(name="Sarah Smith", email="sarah.smith@example.com", password="password123", patient_id="PAT-9402"))
        db.commit()

    existing_reports = db.query(models.Report).count()
    if existing_reports > 0:
        return

    print("Seeding sample medical reports into database...")

    # Sample Report 1: Jan 2026
    r1 = models.Report(
        user_email="demo@beat.health",
        title="Comprehensive Health Checkup - Jan 2026",
        patient_name="Alex Morgan",
        report_date="2026-01-15",
        lab_name="Beat Diagnostics Central",
        summary="Baseline annual wellness health checkup. Most core metabolic, lipid, and blood count parameters within normal range.",
        raw_text="Beat Diagnostics - Jan 15 2026\nPatient: Alex Morgan\nBlood Glucose: 105 mg/dL\nTotal Cholesterol: 180 mg/dL\nHDL Cholesterol: 52 mg/dL\nLDL Cholesterol: 98 mg/dL\nTriglycerides: 130 mg/dL\nHemoglobin: 13.5 g/dL\nWBC: 6.2 x10^3/uL\nSystolic BP: 115 mmHg\nDiastolic BP: 75 mmHg\nHeart Rate: 68 bpm\nTSH: 1.8 uIU/mL",
        file_name="report_jan_2026.pdf",
        file_type="application/pdf"
    )
    db.add(r1)
    db.flush()

    params_r1 = [
        models.ParameterEntry(report_id=r1.id, name="Fasting Blood Glucose", category="Metabolic Panel", value_str="105", numerical_value=105.0, unit="mg/dL", reference_range="70 - 99 mg/dL", min_ref=70.0, max_ref=99.0, status="Elevated", observation="Fasting blood glucose is slightly elevated at 105 mg/dL."),
        models.ParameterEntry(report_id=r1.id, name="Total Cholesterol", category="Lipid Panel", value_str="180", numerical_value=180.0, unit="mg/dL", reference_range="< 200 mg/dL", min_ref=125.0, max_ref=200.0, status="Normal", observation="Total cholesterol is within healthy limits."),
        models.ParameterEntry(report_id=r1.id, name="HDL Cholesterol", category="Lipid Panel", value_str="52", numerical_value=52.0, unit="mg/dL", reference_range="> 40 mg/dL", min_ref=40.0, max_ref=60.0, status="Normal", observation="Optimal HDL level."),
        models.ParameterEntry(report_id=r1.id, name="LDL Cholesterol", category="Lipid Panel", value_str="98", numerical_value=98.0, unit="mg/dL", reference_range="< 100 mg/dL", min_ref=50.0, max_ref=100.0, status="Normal", observation="LDL cholesterol is optimal."),
        models.ParameterEntry(report_id=r1.id, name="Triglycerides", category="Lipid Panel", value_str="130", numerical_value=130.0, unit="mg/dL", reference_range="< 150 mg/dL", min_ref=0.0, max_ref=150.0, status="Normal", observation="Triglycerides within range."),
        models.ParameterEntry(report_id=r1.id, name="Hemoglobin (Hb)", category="Complete Blood Count", value_str="13.5", numerical_value=13.5, unit="g/dL", reference_range="12.0 - 16.5 g/dL", min_ref=12.0, max_ref=16.5, status="Normal", observation="Normal hemoglobin oxygen delivery capability."),
        models.ParameterEntry(report_id=r1.id, name="Systolic Blood Pressure", category="Cardiovascular", value_str="115", numerical_value=115.0, unit="mmHg", reference_range="90 - 120 mmHg", min_ref=90.0, max_ref=120.0, status="Normal", observation="Optimal blood pressure reading."),
        models.ParameterEntry(report_id=r1.id, name="Heart Rate / Pulse", category="Cardiovascular", value_str="68", numerical_value=68.0, unit="bpm", reference_range="60 - 100 bpm", min_ref=60.0, max_ref=100.0, status="Normal", observation="Resting heart rate in normal range.")
    ]
    db.add_all(params_r1)

    # Sample Report 2: Mar 2026
    r2 = models.Report(
        user_email="demo@beat.health",
        title="Follow-up Metabolic & Lipid Panel - Mar 2026",
        patient_name="Alex Morgan",
        report_date="2026-03-20",
        lab_name="Beat Diagnostics Central",
        summary="Quarterly follow-up checkup. Mild increase observed in blood glucose and total cholesterol.",
        raw_text="Beat Diagnostics - Mar 20 2026\nPatient: Alex Morgan\nBlood Glucose: 112 mg/dL\nTotal Cholesterol: 195 mg/dL\nHDL Cholesterol: 50 mg/dL\nLDL Cholesterol: 110 mg/dL\nTriglycerides: 145 mg/dL\nHemoglobin: 13.3 g/dL\nWBC: 6.5 x10^3/uL\nSystolic BP: 118 mmHg\nDiastolic BP: 78 mmHg\nHeart Rate: 72 bpm\nTSH: 1.9 uIU/mL",
        file_name="report_mar_2026.pdf",
        file_type="application/pdf"
    )
    db.add(r2)
    db.flush()

    params_r2 = [
        models.ParameterEntry(report_id=r2.id, name="Fasting Blood Glucose", category="Metabolic Panel", value_str="112", numerical_value=112.0, unit="mg/dL", reference_range="70 - 99 mg/dL", min_ref=70.0, max_ref=99.0, status="Elevated", observation="Fasting glucose measured at 112 mg/dL (+7 mg/dL from Jan 2026)."),
        models.ParameterEntry(report_id=r2.id, name="Total Cholesterol", category="Lipid Panel", value_str="195", numerical_value=195.0, unit="mg/dL", reference_range="< 200 mg/dL", min_ref=125.0, max_ref=200.0, status="Normal", observation="Total cholesterol at 195 mg/dL (+15 mg/dL from Jan 2026)."),
        models.ParameterEntry(report_id=r2.id, name="HDL Cholesterol", category="Lipid Panel", value_str="50", numerical_value=50.0, unit="mg/dL", reference_range="> 40 mg/dL", min_ref=40.0, max_ref=60.0, status="Normal", observation="HDL cholesterol remains optimal."),
        models.ParameterEntry(report_id=r2.id, name="LDL Cholesterol", category="Lipid Panel", value_str="110", numerical_value=110.0, unit="mg/dL", reference_range="< 100 mg/dL", min_ref=50.0, max_ref=100.0, status="Elevated", observation="LDL cholesterol slightly elevated above 100 mg/dL."),
        models.ParameterEntry(report_id=r2.id, name="Triglycerides", category="Lipid Panel", value_str="145", numerical_value=145.0, unit="mg/dL", reference_range="< 150 mg/dL", min_ref=0.0, max_ref=150.0, status="Normal", observation="Triglycerides near upper reference threshold."),
        models.ParameterEntry(report_id=r2.id, name="Hemoglobin (Hb)", category="Complete Blood Count", value_str="13.3", numerical_value=13.3, unit="g/dL", reference_range="12.0 - 16.5 g/dL", min_ref=12.0, max_ref=16.5, status="Normal", observation="Hemoglobin stable."),
        models.ParameterEntry(report_id=r2.id, name="Systolic Blood Pressure", category="Cardiovascular", value_str="118", numerical_value=118.0, unit="mmHg", reference_range="90 - 120 mmHg", min_ref=90.0, max_ref=120.0, status="Normal", observation="Blood pressure in normal range."),
        models.ParameterEntry(report_id=r2.id, name="Heart Rate / Pulse", category="Cardiovascular", value_str="72", numerical_value=72.0, unit="bpm", reference_range="60 - 100 bpm", min_ref=60.0, max_ref=100.0, status="Normal", observation="Normal resting pulse.")
    ]
    db.add_all(params_r2)

    # Sample Report 3: Jun 2026
    r3 = models.Report(
        user_email="demo@beat.health",
        title="Comprehensive Mid-Year Health Review - Jun 2026",
        patient_name="Alex Morgan",
        report_date="2026-06-10",
        lab_name="Beat Diagnostics Central",
        summary="Mid-year health evaluation. Glucose and total cholesterol show continued upward trend. Lipid management consultation recommended.",
        raw_text="Beat Diagnostics - Jun 10 2026\nPatient: Alex Morgan\nBlood Glucose: 120 mg/dL\nTotal Cholesterol: 210 mg/dL\nHDL Cholesterol: 46 mg/dL\nLDL Cholesterol: 125 mg/dL\nTriglycerides: 165 mg/dL\nHemoglobin: 13.2 g/dL\nWBC: 7.1 x10^3/uL\nSystolic BP: 124 mmHg\nDiastolic BP: 82 mmHg\nHeart Rate: 74 bpm\nTSH: 2.1 uIU/mL",
        file_name="report_jun_2026.pdf",
        file_type="application/pdf"
    )
    db.add(r3)
    db.flush()

    params_r3 = [
        models.ParameterEntry(report_id=r3.id, name="Fasting Blood Glucose", category="Metabolic Panel", value_str="120", numerical_value=120.0, unit="mg/dL", reference_range="70 - 99 mg/dL", min_ref=70.0, max_ref=99.0, status="Elevated", observation="Fasting glucose is 120 mg/dL (increased from 112 mg/dL)."),
        models.ParameterEntry(report_id=r3.id, name="Total Cholesterol", category="Lipid Panel", value_str="210", numerical_value=210.0, unit="mg/dL", reference_range="< 200 mg/dL", min_ref=125.0, max_ref=200.0, status="Elevated", observation="Total cholesterol is 210 mg/dL (exceeds 200 mg/dL reference)."),
        models.ParameterEntry(report_id=r3.id, name="HDL Cholesterol", category="Lipid Panel", value_str="46", numerical_value=46.0, unit="mg/dL", reference_range="> 40 mg/dL", min_ref=40.0, max_ref=60.0, status="Normal", observation="HDL cholesterol remains above 40 mg/dL."),
        models.ParameterEntry(report_id=r3.id, name="LDL Cholesterol", category="Lipid Panel", value_str="125", numerical_value=125.0, unit="mg/dL", reference_range="< 100 mg/dL", min_ref=50.0, max_ref=100.0, status="Elevated", observation="LDL cholesterol is elevated at 125 mg/dL."),
        models.ParameterEntry(report_id=r3.id, name="Triglycerides", category="Lipid Panel", value_str="165", numerical_value=165.0, unit="mg/dL", reference_range="< 150 mg/dL", min_ref=0.0, max_ref=150.0, status="Elevated", observation="Triglycerides elevated at 165 mg/dL."),
        models.ParameterEntry(report_id=r3.id, name="Hemoglobin (Hb)", category="Complete Blood Count", value_str="13.2", numerical_value=13.2, unit="g/dL", reference_range="12.0 - 16.5 g/dL", min_ref=12.0, max_ref=16.5, status="Normal", observation="Hemoglobin stable."),
        models.ParameterEntry(report_id=r3.id, name="Systolic Blood Pressure", category="Cardiovascular", value_str="124", numerical_value=124.0, unit="mmHg", reference_range="90 - 120 mmHg", min_ref=90.0, max_ref=120.0, status="Elevated", observation="Systolic blood pressure slightly elevated at 124 mmHg."),
        models.ParameterEntry(report_id=r3.id, name="Heart Rate / Pulse", category="Cardiovascular", value_str="74", numerical_value=74.0, unit="bpm", reference_range="60 - 100 bpm", min_ref=60.0, max_ref=100.0, status="Normal", observation="Resting heart rate normal.")
    ]
    db.add_all(params_r3)

    # Seed Knowledge Docs
    for kdoc in TRUSTED_KNOWLEDGE_DOCS:
        db_doc = models.KnowledgeDoc(
            title=kdoc["title"],
            category=kdoc["category"],
            content=kdoc["content"],
            source=kdoc["source"]
        )
        db.add(db_doc)

    db.commit()
    print("Sample data successfully seeded into Beat database!")
