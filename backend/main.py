import os
import json
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

import models, schemas, crud
from database import engine, get_db, Base
from analysis.hash_utils import calculate_hashes
from analysis.metadata import extract_metadata
from detectors.sensity_adapter import SensityDetector

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Forensic Evidence Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.getcwd(), "evidence_vault")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/cases/", response_model=schemas.Case)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    return crud.create_case(db=db, case=case)

@app.get("/cases/", response_model=list[schemas.Case])
def read_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_cases(db, skip=skip, limit=limit)

@app.get("/cases/{case_id}", response_model=schemas.Case)
def read_case(case_id: str, db: Session = Depends(get_db)):
    db_case = crud.get_case(db, case_id=case_id)
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return db_case

@app.post("/evidence/", response_model=schemas.Evidence)
def upload_evidence(
    case_id: str = Form(...),
    source: str = Form(...),
    acquisition_method: str = Form(...),
    examiner: str = Form(...),
    notes: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Sanitize and save original
    original_filename = file.filename
    safe_filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{original_filename.replace(' ', '_')}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Security: treat uploaded file as immutable from here on
    # Calculate hashes
    hashes = calculate_hashes(file_path)
    file_size = os.path.getsize(file_path)
    mime_type = file.content_type or "application/octet-stream"
    
    evidence_data = schemas.EvidenceCreate(
        case_id=case_id,
        filename=safe_filename,
        original_filename=original_filename,
        mime_type=mime_type,
        file_size=file_size,
        sha256=hashes["sha256"],
        sha1=hashes["sha1"],
        md5=hashes["md5"],
        source=source,
        acquisition_method=acquisition_method,
        examiner=examiner,
        notes=notes
    )
    
    return crud.create_evidence(db=db, evidence=evidence_data)

@app.post("/evidence/{evidence_id}/analyze")
def run_analysis(evidence_id: str, db: Session = Depends(get_db)):
    evidence = crud.get_evidence(db, evidence_id=evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    file_path = os.path.join(UPLOAD_DIR, evidence.filename)
    
    # 1. Metadata analysis
    meta_result = extract_metadata(file_path, evidence.mime_type)
    crud.create_analysis_result(db, evidence_id, schemas.AnalysisResultBase(
        module="metadata",
        result_type="measured_fact",
        data=json.dumps(meta_result)
    ))
    
    crud.create_audit_log(db, evidence_id, schemas.AuditLogBase(
        actor="System",
        action="Metadata extracted",
        evidence_hash=evidence.sha256,
        description="Extracted metadata and media properties from working copy"
    ))
    # 2. Local Heuristic Analysis
    from analysis.heuristics import analyze_local_heuristics
    local_result = analyze_local_heuristics(file_path, evidence.mime_type, meta_result)
    crud.create_analysis_result(db, evidence_id, schemas.AnalysisResultBase(
        module="local_heuristics",
        result_type="heuristic",
        data=local_result
    ))
    
    # 3. Sensity API Integration
    detector = SensityDetector()
    sensity_result = detector.analyze(file_path, evidence.mime_type)
    
    crud.create_analysis_result(db, evidence_id, schemas.AnalysisResultBase(
        module="detector_sensity",
        result_type="model_result",
        data=sensity_result
    ))
    
    crud.create_audit_log(db, evidence_id, schemas.AuditLogBase(
        actor="System",
        action="Detector analysis completed",
        evidence_hash=evidence.sha256,
        description="Ran Local Heuristics and Sensity API Integration"
    ))
    
    return {"status": "success", "message": "Analysis completed and logged to chain of custody"}


