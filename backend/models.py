from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    examiner = Column(String)
    organization = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    classification = Column(String)
    notes = Column(Text)
    
    evidences = relationship("Evidence", back_populates="case")

class Evidence(Base):
    __tablename__ = "evidences"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"))
    filename = Column(String)
    original_filename = Column(String)
    mime_type = Column(String)
    file_size = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    sha256 = Column(String, index=True)
    sha1 = Column(String)
    md5 = Column(String)
    source = Column(String)
    acquisition_method = Column(String)
    examiner = Column(String)
    notes = Column(Text)
    
    case = relationship("Case", back_populates="evidences")
    audit_logs = relationship("AuditLog", back_populates="evidence")
    analysis_results = relationship("AnalysisResult", back_populates="evidence")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("evidences.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String)
    action = Column(String)
    evidence_hash = Column(String)
    description = Column(Text)
    
    evidence = relationship("Evidence", back_populates="audit_logs")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, ForeignKey("evidences.id"))
    module = Column(String) # 'metadata', 'video', 'audio', 'detector', 'provenance'
    result_type = Column(String) # 'measured_fact', 'heuristic_indicator', 'model_result', 'examiner_observation'
    data = Column(Text) # JSON stored as string
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    evidence = relationship("Evidence", back_populates="analysis_results")
