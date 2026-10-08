from sqlalchemy.orm import Session
import models, schemas

def get_case(db: Session, case_id: str):
    return db.query(models.Case).filter(models.Case.id == case_id).first()

def get_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Case).offset(skip).limit(limit).all()

def create_case(db: Session, case: schemas.CaseCreate):
    db_case = models.Case(**case.dict())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def create_evidence(db: Session, evidence: schemas.EvidenceCreate):
    db_evidence = models.Evidence(**evidence.dict())
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    
    # Auto-create audit log
    log = models.AuditLog(
        evidence_id=db_evidence.id,
        actor=evidence.examiner,
        action="Evidence received",
        evidence_hash=evidence.sha256,
        description=f"Evidence {evidence.filename} received and registered to case {evidence.case_id}"
    )
    db.add(log)
    db.commit()
    
    return db_evidence

def get_evidence(db: Session, evidence_id: str):
    return db.query(models.Evidence).filter(models.Evidence.id == evidence_id).first()

def get_evidences_by_case(db: Session, case_id: str):
    return db.query(models.Evidence).filter(models.Evidence.case_id == case_id).all()

def create_audit_log(db: Session, evidence_id: str, log: schemas.AuditLogBase):
    db_log = models.AuditLog(**log.dict(), evidence_id=evidence_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def create_analysis_result(db: Session, evidence_id: str, result: schemas.AnalysisResultBase):
    db_result = models.AnalysisResult(**result.dict(), evidence_id=evidence_id)
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result
