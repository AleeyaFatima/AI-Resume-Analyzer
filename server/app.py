from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any
import json

from parsers.resume_parser import parse_resume_bytes
from ai.nlp_analyzer import analyze_resume_text
from services.job_matcher import compare_resume_with_job
from ai.interview_coach import generate_interview_questions
from models.schemas import AnalysisResponse, JobMatchRequest, JobMatchResponse, InterviewCoachRequest, CoachResponse

app = FastAPI(
    title="ResumeIQ AI Backend API",
    description="Production-style API for resume parsing, keyword analysis, ATS checking, and career recommendations.",
    version="1.0.0"
)

# Enable CORS for frontend connectivity (localhost development & production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify front-end domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "ResumeIQ AI API",
        "message": "FastAPI is operational."
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    """
    Uploads a resume file (PDF or DOCX), extracts text, and performs
    comprehensive skills matching and quality grading.
    """
    # Verify file type
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc", "txt", "jpg", "jpeg", "png"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF, DOCX, TXT, or image (JPG/PNG) file."
        )

    try:
        contents = await file.read()
        extracted_text = parse_resume_bytes(contents, filename)
        
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Could not extract text from file. Please ensure it is not scanned or empty."
            )
            
        analysis_result = analyze_resume_text(extracted_text)
        return analysis_result
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/compare", response_model=JobMatchResponse)
def compare_resume_job(payload: JobMatchRequest):
    """
    Compares resume text with a pasted job description to determine
    alignment, keyword gaps, and suggestions.
    """
    try:
        match_result = compare_resume_with_job(payload.resume_text, payload.job_description)
        return match_result
    except Exception as e:
        print(f"Error during comparison: {e}")
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

@app.post("/api/coach", response_model=CoachResponse)
def get_interview_coach(payload: InterviewCoachRequest):
    """
    Generates interview questions and tips based on matched skills.
    """
    try:
        coach_result = generate_interview_questions(payload.skills)
        return coach_result
    except Exception as e:
        print(f"Error during interview coach: {e}")
        raise HTTPException(status_code=500, detail=f"Interview coach generation failed: {str(e)}")
