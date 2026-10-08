from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class AuditLogBase(BaseModel):
    actor: str
    action: str
    evidence_hash: str
    description: str

class AuditLog(AuditLogBase):
    id: int
    evidence_id: str
    timestamp: datetime
    class Config:
        orm_mode = True

class AnalysisResultBase(BaseModel):
    module: str
    result_type: str
    data: str
    confidence: Optional[float] = None

class AnalysisResult(AnalysisResultBase):
    id: int
    evidence_id: str
    timestamp: datetime
    class Config:
        orm_mode = True

class EvidenceBase(BaseModel):
    filename: str
    mime_type: str
    file_size: int
    sha256: str
    source: str
    acquisition_method: str
    examiner: str
    notes: Optional[str] = None
    original_filename: str
    sha1: Optional[str] = None
    md5: Optional[str] = None

class EvidenceCreate(EvidenceBase):
    case_id: str

class Evidence(EvidenceBase):
    id: str
    case_id: str
    created_at: datetime
    audit_logs: List[AuditLog] = []
    analysis_results: List[AnalysisResult] = []
    class Config:
        orm_mode = True

class CaseBase(BaseModel):
    title: str
    examiner: str
    organization: str
    description: str
    classification: str
    notes: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class Case(CaseBase):
    id: str
    created_at: datetime
    evidences: List[Evidence] = []
    class Config:
        orm_mode = True
