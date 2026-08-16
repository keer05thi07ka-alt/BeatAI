import re
import math
from collections import Counter

# Trusted Medical Knowledge Base Document Chunks
TRUSTED_KNOWLEDGE_DOCS = [
    {
        "id": "doc-01",
        "title": "Clinical Blood Glucose Guidelines",
        "category": "Metabolic",
        "source": "American Diabetes Association Clinical Guidelines",
        "content": "Fasting blood glucose levels between 70-99 mg/dL are considered normal. Fasting levels from 100-125 mg/dL indicate impaired fasting glucose (prediabetes), while 126 mg/dL or higher on two separate tests indicates diabetes. HbA1c below 5.7% is normal, 5.7%-6.4% indicates prediabetes, and 6.5% or higher indicates diabetes. Lifestyle management includes regular aerobic physical activity (150 mins/week), balanced dietary fiber, low glycemic index foods, and weight management to help maintain healthy glucose control."
    },
    {
        "id": "doc-02",
        "title": "Lipid Panel & Cholesterol Guidelines",
        "category": "Cardiovascular",
        "source": "National Heart, Lung, and Blood Institute (NHLBI)",
        "content": "Total cholesterol should ideally remain below 200 mg/dL. HDL ('good') cholesterol should be above 40 mg/dL for men and above 50 mg/dL for women, as higher HDL protects blood vessels. LDL ('bad') cholesterol optimal target is below 100 mg/dL. Triglycerides should be under 150 mg/dL. Elevated LDL and triglycerides increase arterial plaque accumulation risk. Key lifestyle modifications to reduce and manage cholesterol include: 1) Adopting a heart-healthy Mediterranean-style diet low in saturated and trans fats; 2) Increasing soluble dietary fiber (oats, legumes, fruits, vegetables); 3) Engaging in regular aerobic exercise (30 mins/day); 4) Maintaining healthy weight and avoiding tobacco."
    },
    {
        "id": "doc-03",
        "title": "Complete Blood Count (CBC) Interpretation",
        "category": "Hematology",
        "source": "Hematology Reference Manual",
        "content": "Hemoglobin (Hb) normal reference range is 12.0-15.5 g/dL for adult females and 13.5-17.5 g/dL for adult males. Hemoglobin carries oxygen throughout tissues. Low hemoglobin indicates anemia, which may cause fatigue, pale skin, or shortness of breath. White Blood Cells (WBC) range from 4,500 to 11,000 cells/uL; elevated WBC suggests infection, inflammation, or physical stress. Platelets (150,000-450,000 /uL) facilitate normal blood coagulation."
    },
    {
        "id": "doc-04",
        "title": "Blood Pressure Classification",
        "category": "Cardiovascular",
        "source": "ACC/AHA High Blood Pressure Clinical Guidelines",
        "content": "Normal blood pressure is systolic below 120 mmHg and diastolic below 80 mmHg. Elevated BP is systolic 120-129 mmHg with diastolic <80 mmHg. Stage 1 Hypertension is systolic 130-139 mmHg or diastolic 80-89 mmHg. Stage 2 Hypertension is systolic 140+ mmHg or diastolic 90+ mmHg. Management strategies emphasize sodium restriction under 2,000 mg/day, regular physical activity, stress mitigation, and routine monitoring."
    },
    {
        "id": "doc-05",
        "title": "Thyroid Function & TSH Reference Ranges",
        "category": "Endocrinology",
        "source": "Endocrine Society Clinical Practice Guidelines",
        "content": "Thyroid Stimulating Hormone (TSH) normal reference range is 0.4 to 4.0 uIU/mL. Elevated TSH usually signals hypothyroidism (underactive thyroid gland), where the pituitary gland releases extra TSH to stimulate the thyroid. Low TSH signals hyperthyroidism (overactive thyroid). Symptoms of hypothyroidism include fatigue, weight gain, cold sensitivity, and dry skin. Serum Free T4 helps confirm diagnosis alongside TSH."
    },
    {
        "id": "doc-06",
        "title": "Renal & Kidney Function Panel",
        "category": "Nephrology",
        "source": "National Kidney Foundation Guidelines",
        "content": "Serum Creatinine normal range is 0.6 to 1.2 mg/dL. Creatinine is a breakdown product of muscle creatine phosphate and is filtered exclusively by kidneys. eGFR (estimated Glomerular Filtration Rate) above 90 mL/min/1.73m2 represents normal kidney filtration function. BUN (Blood Urea Nitrogen) normal range is 7 to 20 mg/dL. Staying well hydrated supports normal kidney filtration."
    },
    {
        "id": "doc-07",
        "title": "Cardiovascular & Antiplatelet Therapy Guidelines",
        "category": "Pharmacology & Cardiology",
        "source": "ACC/AHA Clinical Guidelines on Cardiovascular Antiplatelet Therapy",
        "content": "Clopidogrel (Clopid 75mg) is an antiplatelet medication that prevents blood platelets from aggregating and forming blood clots. It is prescribed for cardiovascular protection following positive cardiac stress tests (ETT +ve), symptoms of palpitation, ischemic heart disease, or post-cardiac procedures. Co-prescribed medications often include beta-blockers (Bisoprolol/Cardicor), statins (Rosuvastatin), ARBs (Telmisartan/Arbitel), and gastric protection agents (Esomeprazole/Sergel) to prevent gastrointestinal irritation."
    }
]

# Medication Knowledge Base for Direct AI Q&A
MEDICATION_KNOWLEDGE = {
    "clopid": {
        "title": "Clopid 75mg (Clopidogrel)",
        "role": "Antiplatelet / Blood Thinner",
        "reason": "Clopid 75 contains Clopidogrel (75mg), an antiplatelet blood thinner medication. It is prescribed to prevent blood platelets from sticking together and forming dangerous blood clots in arteries, particularly after cardiac evaluation (such as an ETT +ve treadmill test or palpitation investigation)."
    },
    "cardicor": {
        "title": "Cardicor 5mg (Bisoprolol)",
        "role": "Beta-Blocker / Heart Rate Regulation",
        "reason": "Cardicor 5 contains Bisoprolol (5mg), a selective beta-blocker. It is prescribed to slow down resting heart rate, control palpitations, and reduce heart workload to maintain steady cardiac rhythm."
    },
    "arbitel": {
        "title": "Arbitel 20mg (Telmisartan)",
        "role": "Blood Pressure Medication (ARB)",
        "reason": "Arbitel 20 contains Telmisartan (20mg), an Angiotensin II Receptor Blocker (ARB). It is prescribed to manage blood pressure, relax blood vessels, and protect long-term renal and vascular health."
    },
    "rosuva": {
        "title": "Rosuva 5mg (Rosuvastatin)",
        "role": "Lipid-Lowering Statin",
        "reason": "Rosuva 5 contains Rosuvastatin (5mg), a statin medication. It is prescribed to lower LDL ('bad') cholesterol, increase HDL ('good') cholesterol, and prevent arterial plaque buildup."
    },
    "sergel": {
        "title": "Sergel 20mg (Esomeprazole)",
        "role": "Gastric Mucosal Protection (PPI)",
        "reason": "Sergel 20 contains Esomeprazole (20mg), a Proton Pump Inhibitor (PPI). It is prescribed to reduce stomach acid production and protect the gastric lining, especially when taking daily antiplatelets (like Clopid 75) that can cause stomach irritation."
    },
    "nitrin": {
        "title": "Nitrin SR (Nitroglycerin SR)",
        "role": "Anti-Anginal Vasodilator",
        "reason": "Nitrin SR is a sustained-release nitroglycerin vasodilator prescribed to dilate coronary arteries, improve oxygenated blood flow to the heart muscle, and relieve cardiac tightness."
    },
    "metazine": {
        "title": "Metazine MR (Trimetazidine)",
        "role": "Cardiac Metabolic Care",
        "reason": "Metazine MR contains Trimetazidine (modified release). It is prescribed to support cardiac cellular energy metabolism during periods of reduced blood flow."
    },
    "ranola": {
        "title": "Ranola 500mg (Ranolazine)",
        "role": "Anti-Anginal Care",
        "reason": "Ranola 500 contains Ranolazine (500mg). It is prescribed to manage chronic cardiac symptoms and improve exercise tolerance without significantly lowering blood pressure."
    },
    "sitagliptin": {
        "title": "Sitagliptin 50mg",
        "role": "Anti-Diabetic Medication",
        "reason": "Sitagliptin (50mg) is a DPP-4 inhibitor anti-diabetic medication prescribed to support blood glucose regulation."
    },
    "xinc": {
        "title": "XINC B Supplement",
        "role": "Nutritional Supplement",
        "reason": "XINC B contains Zinc and Vitamin B-Complex. It is prescribed to support cellular metabolism, immune function, and overall tissue recovery."
    },
    "sustained release": {
        "title": "Sustained Release (SR)",
        "role": "Extended-Release Pharmaceutical Formulation",
        "reason": "Sustained Release (SR) means the pill is specially coated so that the active medicine is released slowly and continuously into your bloodstream over 12 to 24 hours. This provides long-lasting, steady protection (like Nitrin SR for cardiac blood flow) without taking pills every few hours. Note: Never crush or chew SR tablets."
    },
    "modified release": {
        "title": "Modified Release (MR)",
        "role": "Controlled-Release Pharmaceutical Formulation",
        "reason": "Modified Release (MR) means the rate and timing of drug release in your digestive tract is engineered for smooth, controlled absorption. This maintains constant therapeutic drug levels in your body (like Metazine MR for heart tissue care) and reduces stomach irritation. Note: Never crush or chew MR tablets."
    },
    "bd": {
        "title": "BD (Bis in Die - Twice Daily)",
        "role": "Prescription Timing Abbreviation",
        "reason": "BD stands for 'Bis in Die' (Latin for 'Twice Daily'). On a prescription, '1-0-1 (BD)' means: Take 1 dose in the Morning, 0 in the Afternoon, and 1 dose in the Evening/Night (total 2 doses per day)."
    },
    "1-0-1": {
        "title": "Dosage Frequency: 1-0-1",
        "role": "Prescription Instructions",
        "reason": "The code '1-0-1' means you should take the medication twice a day: 1 dose in the Morning, 0 in the Afternoon, and 1 dose in the Evening/Night."
    },
    "0-1-0": {
        "title": "Dosage Frequency: 0-1-0",
        "role": "Prescription Instructions",
        "reason": "The code '0-1-0' means you should take the medication exactly once a day, in the Afternoon/Midday."
    },
    "1-0-0": {
        "title": "Dosage Frequency: 1-0-0",
        "role": "Prescription Instructions",
        "reason": "The code '1-0-0' means you should take the medication exactly once a day, in the Morning."
    },
    "0-0-1": {
        "title": "Dosage Frequency: 0-0-1",
        "role": "Prescription Instructions",
        "reason": "The code '0-0-1' means you should take the medication exactly once a day, in the Evening/Night."
    },
    "1-1-1": {
        "title": "Dosage Frequency: 1-1-1",
        "role": "Prescription Instructions",
        "reason": "The code '1-1-1' means you should take the medication three times a day: 1 dose in the Morning, 1 dose in the Afternoon, and 1 dose in the Evening/Night."
    },
    "flagyl": {
        "title": "Flagyl 400mg (Metronidazole)",
        "role": "Anti-Diarrheal & Anti-Protozoal Antimicrobial",
        "reason": "Flagyl contains Metronidazole (400mg). It is a nitroimidazole antimicrobial prescribed for acute gastroenteritis, intestinal protozoal infections, and loose motions to eradicate causative intestinal pathogens."
    },
    "drotin": {
        "title": "Drotin-M (Drotaverine + Mefenamic Acid)",
        "role": "Anti-Spasmodic & Abdominal Pain Relief",
        "reason": "Drotin-M is a combination anti-spasmodic tablet. Drotaverine relaxes smooth intestinal muscle spasms, while Mefenamic acid reduces inflammatory stomach pain and cramps caused by gastroenteritis."
    },
    "pan 40": {
        "title": "Pan 40 (Pantoprazole 40mg)",
        "role": "Gastric Acid Reducer (PPI)",
        "reason": "Pan 40 contains Pantoprazole (40mg), a Proton Pump Inhibitor (PPI). Prescribed before breakfast (BBF) to reduce stomach acid, prevent hyperacidity, and soothe stomach lining irritation during illness."
    },
    "electral": {
        "title": "Electral Powder (Oral Rehydration Salts - ORS)",
        "role": "Oral Electrolyte Rehydration Therapy",
        "reason": "Electral Powder is a World Health Organization (WHO) formulation of essential electrolytes (Sodium, Potassium, Chloride, Citrate, and Dextrose). It restores vital fluid balance and prevents dangerous dehydration during acute diarrhea or vomiting."
    },
    "ultrafen": {
        "title": "Ultrafen-Plus 50mg (Diclofenac + Paracetamol)",
        "role": "NSAID Anti-Inflammatory & Analgesic Pain Reliever",
        "reason": "Ultrafen-Plus combines Diclofenac (50mg) and Paracetamol. It is an anti-inflammatory analgesic prescribed for joint pain, knee osteoarthritis, and soft tissue swelling to reduce pain and improve joint mobility."
    },
    "relentus": {
        "title": "Tab Relentus",
        "role": "Muscle Relaxant & Analgesic Support",
        "reason": "Relentus is prescribed as a muscle relaxant and analgesic support tablet taken at bedtime to relieve muscle spasm and joint stiffness associated with knee pain."
    },
    "cartilix": {
        "title": "Tab Cartilix (Glucosamine + Chondroitin)",
        "role": "Joint Cartilage Repair & Chondroprotective Care",
        "reason": "Cartilix provides Glucosamine and Chondroitin Sulfate, key building blocks for articular cartilage. Prescribed in knee joint pain to stimulate cartilage repair, reduce joint space narrowing, and protect against degeneration."
    },
    "ultracal": {
        "title": "Tab Ultracal-D (Calcium + Vitamin D3)",
        "role": "Bone Mineral Density & Calcium Supplementation",
        "reason": "Ultracal-D delivers bioavailable Calcium and Vitamin D3 to support bone mineralization, strengthen skeletal joint structures, and aid recovery in orthopedic disorders."
    }
}

STOP_WORDS = {"i", "want", "to", "know", "how", "the", "is", "a", "an", "my", "in", "for", "of", "what", "tell", "me", "about", "can", "you", "please", "does", "do", "should", "ok", "okay"}

def normalize_text(text: str) -> str:
    """Corrects common typos and normalizes medical keywords."""
    t = text.lower()
    t = re.sub(r'\bcholest[a-z]*\b', 'cholesterol', t)
    t = re.sub(r'\bsug[a-z]*\b', 'glucose', t)
    t = re.sub(r'\bdiabet[a-z]*\b', 'glucose', t)
    t = re.sub(r'\bpressur[a-z]*\b', 'pressure', t)
    t = re.sub(r'\bhemoglob[a-z]*\b', 'hemoglobin', t)
    t = re.sub(r'\bthyroid[a-z]*\b', 'tsh', t)
    t = re.sub(r'\bcreatin[a-z]*\b', 'creatinine', t)
    t = re.sub(r'\belectrol[a-z]*\b', 'electral', t)
    return t

def tokenize(text: str):
    """Tokenize and filter stop words."""
    words = re.findall(r'\w+', normalize_text(text))
    return [w for w in words if w not in STOP_WORDS]

def compute_tf_idf_similarity(query: str, doc_text: str) -> float:
    """Computes similarity between query and document text."""
    q_tokens = tokenize(query)
    d_tokens = tokenize(doc_text)
    
    if not q_tokens or not d_tokens:
        return 0.0

    q_counts = Counter(q_tokens)
    d_counts = Counter(d_tokens)

    all_words = set(q_counts.keys()).union(set(d_counts.keys()))

    dot_product = sum(q_counts[w] * d_counts[w] for w in all_words)
    mag_q = math.sqrt(sum(v ** 2 for v in q_counts.values()))
    mag_d = math.sqrt(sum(v ** 2 for v in d_counts.values()))

    if mag_q * mag_d == 0:
        return 0.0

    bonus = 0.0
    for q_word in q_tokens:
        if q_word in doc_text.lower():
            bonus += 0.5

    return (dot_product / (mag_q * mag_d)) + bonus

def retrieve_relevant_docs(query: str, top_k: int = 2):
    """Vector / Keyword RAG retriever for trusted medical docs."""
    scored_docs = []
    norm_q = normalize_text(query)
    
    for doc in TRUSTED_KNOWLEDGE_DOCS:
        score = compute_tf_idf_similarity(norm_q, doc["title"] + " " + doc["content"])
        scored_docs.append((score, doc))
    
    scored_docs.sort(key=lambda x: x[0], reverse=True)
    return [doc for score, doc in scored_docs[:top_k]]

def format_ref_status(ref_range: str, status: str):
    """Formats reference range and status cleanly without 'None' text."""
    parts = []
    if ref_range and str(ref_range).strip() not in ["None", "", "N/A"]:
        parts.append(f"Report Reference Range: {ref_range}")
    if status and str(status).strip() not in ["None", "", "N/A"]:
        parts.append(f"Status: **{status}**")
    
    return f" ({', '.join(parts)})" if parts else ""

def generate_rag_response(query: str, report_context: dict = None, history_context: list = None):
    """
    Universal RAG Generator: Intelligently answers medication inquiries, comparative, management,
    parameter-specific, and reference-range questions accurately based on report history and clinical guidelines.
    """
    query_norm = normalize_text(query)
    retrieved_docs = retrieve_relevant_docs(query_norm, top_k=2)
    sources = []

    for doc in retrieved_docs:
        sources.append({
            "id": doc["id"],
            "title": doc["title"],
            "source": doc["source"],
            "category": doc["category"]
        })

    if report_context:
        sources.append({
            "id": f"report-{report_context.get('id', 'current')}",
            "title": report_context.get('title', 'Uploaded Medical Report'),
            "source": f"Report dated {report_context.get('report_date')}",
            "category": "User Health Data"
        })

    response_paragraphs = []
    params = report_context.get("parameters", []) if report_context else []

    # 1. MEDICATION / PRESCRIPTION INQUIRY (Top Priority!)
    matched_med_key = None
    for med_key in MEDICATION_KNOWLEDGE.keys():
        if med_key in query_norm:
            matched_med_key = med_key
            break

    is_med_query = matched_med_key is not None or any(kw in query_norm for kw in ["prescription", "prescribed", "medication", "medicine", "tablet", "dosage", "why is", "why prescribed"])

    if matched_med_key:
        med_info = MEDICATION_KNOWLEDGE[matched_med_key]
        response_paragraphs.append(
            f"### Why **{med_info['title']}** is Prescribed:\n\n" +
            f"**Clinical Reason**: {med_info['reason']}\n\n" +
            f"**Medication Category**: {med_info['role']}"
        )

        # Check if medication is in the selected report parameters
        report_meds = [p for p in params if matched_med_key in p.get('name', '').lower()]
        if report_meds:
            lines = []
            for p in report_meds:
                parts = [f"**{p.get('value_str')} {p.get('unit')}**"]
                if p.get('frequency') and p.get('frequency') not in ['Not applicable', 'N/A']:
                    freq_val = p.get('frequency')
                    freq_str = f"Frequency: {freq_val}"
                    if freq_val in MEDICATION_KNOWLEDGE:
                        freq_str += f" ({MEDICATION_KNOWLEDGE[freq_val]['reason']})"
                    parts.append(freq_str)
                if p.get('duration') and p.get('duration') not in ['Not applicable', 'Not provided', 'N/A']:
                    parts.append(f"Duration: {p.get('duration')}")
                if p.get('observation') and p.get('observation').strip():
                    parts.append(f"Instructions: {p.get('observation')}")
                lines.append(f"* **{p.get('name')}**: " + " | ".join(parts) + f" ({p.get('status')})")
            response_paragraphs.append(
                f"**From your uploaded prescription ({report_context.get('title')}, {report_context.get('report_date')})**:\n\n" +
                "\n".join(lines)
            )

        if retrieved_docs:
            response_paragraphs.append(
                f"**Clinical Guidance ({retrieved_docs[0]['source']})**:\n" +
                f"{retrieved_docs[0]['content']}"
            )

    # 2. Comparative / Trend / Maintenance Inquiry
    elif any(k in query_norm for k in ["compare", "comparing", "previous", "maintained", "maintain", "change", "changed", "trend", "diff", "earlier", "history"]):
        target_keyword = None
        for kw in ["cholesterol", "glucose", "sugar", "pressure", "bp", "hemoglobin", "tsh", "creatinine", "wbc", "triglycerides", "hdl", "ldl"]:
            if kw in query_norm:
                target_keyword = kw
                break

        if history_context and len(history_context) >= 2:
            latest = history_context[0]
            previous = history_context[1]
            
            latest_params = {p.get('name'): p for p in latest.get('parameters', [])}
            prev_params = {p.get('name'): p for p in previous.get('parameters', [])}

            if target_keyword:
                matched_latest = [p for name, p in latest_params.items() if target_keyword in normalize_text(name)]
                
                if matched_latest:
                    lines = []
                    for lp in matched_latest:
                        p_name = lp.get('name')
                        l_val = lp.get('numerical_value')
                        pp = prev_params.get(p_name)
                        p_val = pp.get('numerical_value') if pp else None

                        ref_range = lp.get('reference_range') or (pp.get('reference_range') if pp else None)
                        status_val = lp.get('status') or (pp.get('status') if pp else None)
                        ref_str = format_ref_status(ref_range, status_val)

                        if l_val is not None and p_val is not None:
                            diff = round(l_val - p_val, 2)
                            if diff == 0:
                                status_text = f"was **maintained** at {l_val} {lp.get('unit')} (no change)"
                            elif diff > 0:
                                status_text = f"was **not maintained**; it **increased** by +{diff} {lp.get('unit')} (from {p_val} to {l_val} {lp.get('unit')})"
                            else:
                                status_text = f"**decreased** by {diff} {lp.get('unit')} (from {p_val} to {l_val} {lp.get('unit')})"
                            
                            lines.append(f"* **{p_name}**: Your value {status_text}.{ref_str}")
                        else:
                            lines.append(f"* **{p_name}**: Latest value is **{lp.get('value_str')} {lp.get('unit')}**.{ref_str}")

                    response_paragraphs.append(
                        f"Comparing your latest report (**{latest.get('report_date')}**) with your previous report (**{previous.get('report_date')}**):\n\n" +
                        "\n".join(lines)
                    )
                else:
                    response_paragraphs.append(
                        f"In comparing your latest report ({latest.get('report_date')}) with previous report ({previous.get('report_date')}), parameter data for {target_keyword} was retrieved as follows:\n\n" +
                        f"* **Latest Report**: {latest.get('title')} ({latest.get('report_date')})\n" +
                        f"* **Previous Report**: {previous.get('title')} ({previous.get('report_date')})"
                    )
            else:
                changes = []
                for name, lp in latest_params.items():
                    if name in prev_params:
                        pp = prev_params[name]
                        l_val = lp.get('numerical_value')
                        p_val = pp.get('numerical_value')
                        if l_val is not None and p_val is not None:
                            diff = round(l_val - p_val, 2)
                            direction = "Increased" if diff > 0 else "Decreased" if diff < 0 else "Maintained (Stable)"
                            sign = "+" if diff > 0 else ""
                            changes.append(f"* **{name}**: {p_val} → {l_val} {lp.get('unit')} ({sign}{diff}, **{direction}**)")
                
                response_paragraphs.append(
                    f"Comparing all parameters between your latest report (**{latest.get('report_date')}**) and previous report (**{previous.get('report_date')}**):\n\n" +
                    "\n".join(changes)
                )

            if retrieved_docs:
                response_paragraphs.append(
                    f"**Clinical Reference Context ({retrieved_docs[0]['source']})**:\n{retrieved_docs[0]['content']}"
                )
        else:
            response_paragraphs.append(
                f"To compare changes between reports, Beat tracks your parameters across multiple uploaded reports. Currently showing data for selected report dated **{report_context.get('report_date') if report_context else 'N/A'}**."
            )

    # 3. Management / Lifestyle Query
    elif any(k in query_norm for k in ["reduce", "lower", "manage", "control", "improve", "help", "fix"]):
        if "cholesterol" in query_norm or "lipid" in query_norm or "ldl" in query_norm or "triglycerides" in query_norm:
            response_paragraphs.append(
                "Based on trusted clinical guidelines from the **National Heart, Lung, and Blood Institute (NHLBI)**, key lifestyle modifications to manage and lower cholesterol levels include:\n\n" +
                "1. **Heart-Healthy Nutrition**: Focus on a Mediterranean-style diet low in saturated and trans fats. Limit red meats, full-fat dairy, and fried foods.\n" +
                "2. **Increase Soluble Fiber**: Consume more oats, barley, legumes (beans, lentils), fruits (apples, berries), and vegetables to help bind cholesterol in the digestive tract.\n" +
                "3. **Regular Physical Activity**: Aim for at least 150 minutes of moderate aerobic exercise per week (e.g., brisk walking, cycling, swimming) to boost HDL ('good') cholesterol.\n" +
                "4. **Weight & Lifestyle Management**: Maintain a healthy body mass index (BMI) and avoid tobacco products."
            )
            chol_params = [p for p in params if any(w in p.get('name', '').lower() for w in ['cholesterol', 'triglycerides', 'hdl', 'ldl'])]
            if chol_params:
                lines = [f"* **{p.get('name')}**: {p.get('value_str')} {p.get('unit')}{format_ref_status(p.get('reference_range'), p.get('status'))}" for p in chol_params]
                response_paragraphs.append(
                    f"**From your selected report ({report_context.get('title')}, {report_context.get('report_date')})**:\n\n" +
                    "\n".join(lines)
                )

        elif "glucose" in query_norm or "sugar" in query_norm:
            response_paragraphs.append(
                "According to the **American Diabetes Association (ADA)** guidelines, lifestyle strategies for managing blood glucose include:\n\n" +
                "1. **Balanced Nutrition**: Emphasize low glycemic index foods, high-fiber vegetables, and whole grains while reducing refined sugars and sweetened beverages.\n" +
                "2. **Regular Exercise**: Engage in 30 minutes of daily physical activity to improve insulin sensitivity.\n" +
                "3. **Weight Management**: Modest weight reduction significantly improves blood sugar control."
            )
            g_params = [p for p in params if any(w in p.get('name', '').lower() for w in ['glucose', 'hba1c', 'sugar'])]
            if g_params:
                lines = [f"* **{p.get('name')}**: {p.get('value_str')} {p.get('unit')}{format_ref_status(p.get('reference_range'), p.get('status'))}" for p in g_params]
                response_paragraphs.append(
                    f"**From your selected report ({report_context.get('title')}, {report_context.get('report_date')})**:\n\n" +
                    "\n".join(lines)
                )

        elif "pressure" in query_norm or "bp" in query_norm:
            response_paragraphs.append(
                "Per **ACC/AHA High Blood Pressure Clinical Guidelines**, effective strategies to manage blood pressure include:\n\n" +
                "1. **Sodium Restriction**: Limit daily dietary sodium intake to under 2,000 mg.\n" +
                "2. **DASH Diet**: Eat a diet rich in fruits, vegetables, and potassium while minimizing processed foods.\n" +
                "3. **Physical Exercise & Stress Relief**: Regular aerobic exercise and stress management techniques help keep arterial pressure in check."
            )
            bp_params = [p for p in params if 'pressure' in p.get('name', '').lower() or 'bp' in p.get('name', '').lower()]
            if bp_params:
                lines = [f"* **{p.get('name')}**: {p.get('value_str')} {p.get('unit')}{format_ref_status(p.get('reference_range'), p.get('status'))}" for p in bp_params]
                response_paragraphs.append(
                    f"**From your selected report ({report_context.get('title')}, {report_context.get('report_date')})**:\n\n" +
                    "\n".join(lines)
                )
        else:
            response_paragraphs.append(
                "Here is clinical lifestyle management information based on your query:\n\n" +
                f"**From {retrieved_docs[0]['title']} ({retrieved_docs[0]['source']})**:\n{retrieved_docs[0]['content']}"
            )

    # 4. Specific Parameter Value Query
    elif any(k in query_norm for k in ["cholesterol", "glucose", "hemoglobin", "pressure", "tsh", "creatinine", "wbc"]):
        matched_params = []
        for p in params:
            p_norm = normalize_text(p.get('name', ''))
            if any(w in query_norm for w in tokenize(p_norm)):
                matched_params.append(p)

        if matched_params:
            p_info_list = [
                f"* **{p.get('name')}**: Extracted as **{p.get('value_str')} {p.get('unit')}**{format_ref_status(p.get('reference_range'), p.get('status'))}."
                for p in matched_params
            ]
            response_paragraphs.append(
                f"Here is the specific information extracted from your selected report (**{report_context.get('title')}**, {report_context.get('report_date')}):\n\n" +
                "\n".join(p_info_list)
            )
            if retrieved_docs:
                response_paragraphs.append(
                    f"**Clinical Knowledge ({retrieved_docs[0]['source']})**:\n{retrieved_docs[0]['content']}"
                )
        else:
            if retrieved_docs:
                response_paragraphs.append(
                    f"**From {retrieved_docs[0]['title']} ({retrieved_docs[0]['source']})**:\n{retrieved_docs[0]['content']}"
                )

    # 5. Tests / Parameters List Query
    elif any(k in query_norm for k in ["test", "included", "what parameters", "what values", "all values", "summary", "overview"]):
        if params:
            param_lines = [
                f"* **{p.get('name')}**: {p.get('value_str')} {p.get('unit')} ({p.get('status')})" for p in params
            ]
            response_paragraphs.append(
                f"Your selected report (**{report_context.get('title')}** dated {report_context.get('report_date')}) includes the following {len(params)} extracted parameters:\n\n" +
                "\n".join(param_lines) +
                f"\n\n**Executive Summary**: {report_context.get('summary')}"
            )
        else:
            response_paragraphs.append("Your health records contain parameters for Fasting Blood Glucose, Total Cholesterol, HDL/LDL Cholesterol, Triglycerides, Hemoglobin, WBC Count, and Blood Pressure.")

    # 6. General Fallback with retrieved docs
    else:
        response_paragraphs.append(
            f"Here is clinical reference knowledge regarding your query (**\"{query}\"**):"
        )
        if retrieved_docs:
            for doc in retrieved_docs:
                response_paragraphs.append(
                    f"**From {doc['title']} ({doc['source']})**:\n{doc['content']}"
                )
        if report_context and params:
            response_paragraphs.append(
                f"**Report Context ({report_context.get('title')}, {report_context.get('report_date')})**:\n" +
                f"{report_context.get('summary')}"
            )

    full_answer = "\n\n".join(response_paragraphs)

    return {
        "answer": full_answer,
        "sources": sources,
        "query": query
    }
