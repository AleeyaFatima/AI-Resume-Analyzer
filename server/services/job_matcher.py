import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Any
from ai.nlp_analyzer import SKILLS_DICTIONARY

def extract_skills_from_text(text: str) -> List[str]:
    """Helper to extract a flat list of matching skills from text."""
    clean_text = text.lower()
    matched = []
    
    # Flatten all skills from the dictionary
    for skill_list in SKILLS_DICTIONARY.values():
        for skill in skill_list:
            pattern = r'\b' + skill + r'\b'
            if any(char in skill for char in ['.', '+', '#']):
                pattern = r'(?:^|\s|[.,/():])' + skill + r'(?:$|\s|[.,/():])'
            
            if re.search(pattern, clean_text):
                display_name = skill.replace("\\", "")
                display_name = {
                    "next.js": "Next.js",
                    "node.js": "Node.js",
                    "fastapi": "FastAPI",
                    "pytorch": "PyTorch",
                    "tensorflow": "TensorFlow",
                    "github": "GitHub",
                    "gitlab": "GitLab",
                    "mongodb": "MongoDB",
                    "postgresql": "PostgreSQL",
                    "mysql": "MySQL",
                    "sqlite": "SQLite",
                    "elasticsearch": "Elasticsearch",
                    "graphql": "GraphQL",
                    "scikit-learn": "Scikit-Learn",
                    "huggingface": "Hugging Face",
                    "aws": "AWS",
                    "gcp": "GCP",
                    "ci/cd": "CI/CD",
                    "nlp": "NLP",
                    "llms": "LLMs",
                    "genai": "GenAI",
                    "rag": "RAG",
                    "mlops": "MLOps"
                }.get(display_name, display_name.title())
                
                if display_name not in matched:
                    matched.append(display_name)
                    
    return matched

def compare_resume_with_job(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Computes TF-IDF cosine similarity and extracts matching/missing skills.
    Returns scores and tailored actionable advice.
    """
    if not resume_text.strip() or not job_description.strip():
        return {
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": ["Please upload a resume and provide a job description to analyze compatibility."]
        }

    # 1. Cosine Similarity via TF-IDF
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([resume_text, job_description])
        cosine_sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    except Exception:
        cosine_sim = 0.0

    # 2. Key Skills Match
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_description)
    
    matched_skills = [skill for skill in job_skills if skill in resume_skills]
    missing_skills = [skill for skill in job_skills if skill not in resume_skills]
    
    # 3. Calculate Composite Score
    # 50% Cosine Similarity + 50% Keyword Match percentage
    keyword_score = (len(matched_skills) / len(job_skills) * 100) if job_skills else 0.0
    cosine_score = cosine_sim * 100
    
    # If no skills in job description, rely fully on cosine similarity
    if not job_skills:
        match_score = int(cosine_score)
    else:
        match_score = int(0.4 * cosine_score + 0.6 * keyword_score)
        
    # Keep score between 10 and 99
    match_score = max(15, min(99, match_score))

    # 4. Generate AI Suggestions
    suggestions = []
    if missing_skills:
        suggestions.append(f"Add projects or work experience that show your expertise with {', '.join(missing_skills[:3])}.")
        suggestions.append(f"Explicitly mention {missing_skills[0]} in your Skills section.")
    else:
        suggestions.append("Outstanding! Your skills list aligns fully with the job keywords.")

    if cosine_score < 40:
        suggestions.append("Align the wording of your professional summary with terms used in the job description.")
        suggestions.append("Tailor your work accomplishments to focus on similar business problems as highlighted in the job role.")
    else:
        suggestions.append("Strong content alignment. Ensure you quantify your results (e.g. percentages, dollars, scale).")

    # Limit lists
    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }
