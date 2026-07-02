from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class InterviewCoachRequest(BaseModel):
    skills: Dict[str, List[str]]

class GrammarIssueSchema(BaseModel):
    type: str
    message: str
    severity: str

class ProjectSuggestionSchema(BaseModel):
    title: str
    desc: str

class ContactInfoSchema(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: bool = False
    github: bool = False

class AnalysisResponse(BaseModel):
    raw_text: str
    resume_score: int
    ats_score: int
    interview_readiness: int
    skills: Dict[str, List[str]]
    contact_info: ContactInfoSchema
    grammar_issues: List[GrammarIssueSchema]
    sections_found: Dict[str, bool]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    certifications: List[str]
    project_suggestions: List[ProjectSuggestionSchema]

class JobMatchResponse(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]

class QuestionSchema(BaseModel):
    type: str
    skill: str
    question: str
    answer: str
    difficulty: str

class CoachResponse(BaseModel):
    questions: List[QuestionSchema]
    confidence_level: str
    expected_difficulty: str
