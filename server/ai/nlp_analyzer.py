import re
from typing import Dict, List, Any

# Define a comprehensive skill classification dictionary
SKILLS_DICTIONARY = {
    "Languages": [
        "python", "javascript", "typescript", "java", "c\\+\\+", "c#", "golang", "go",
        "rust", "ruby", "php", "sql", "html", "css", "bash", "shell", "swift", "kotlin",
        "scala", "matlab", "r language", "rstats"
    ],
    "Frameworks & Libraries": [
        "react", "vue", "angular", "next\\.js", "nuxt", "node\\.js", "express", "django",
        "flask", "fastapi", "spring boot", "asp\\.net", "laravel", "rails", "nestjs",
        "tailwind", "bootstrap", "pytorch", "tensorflow", "keras", "pandas", "numpy",
        "scikit-learn", "huggingface", "jquery", "sass", "graphql"
    ],
    "Databases & Caching": [
        "postgresql", "mysql", "sqlite", "mongodb", "redis", "cassandra", "dynamodb",
        "firebase", "elasticsearch", "oracle", "sql server", "neo4j", "mariadb"
    ],
    "Cloud & DevOps": [
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "github actions",
        "terraform", "ansible", "ci/cd", "nginx", "serverless", "cloudflare", "linux",
        "git", "github", "gitlab", "vagrant", "prometheus", "grafana"
    ],
    "AI / ML & Data Science": [
        "machine learning", "deep learning", "natural language processing", "nlp",
        "computer vision", "llms", "generative ai", "genai", "mlops", "data science",
        "prompt engineering", "rag", "retrieval-augmented generation", "vector databases",
        "pinecone", "langchain", "llamaindex", "chromadb", "data analytics", "tableau",
        "power bi", "neural networks", "reinforcement learning"
    ],
    "Soft Skills": [
        "communication", "leadership", "teamwork", "problem solving", "adaptability",
        "agile", "scrum", "project management", "critical thinking", "time management",
        "collaboration", "negotiation", "creativity", "decision making"
    ]
}

# Buzzwords that are often overused and marked as formatting/writing issues
BUZZWORDS = [
    "synergy", "dynamic", "motivated", "detail-oriented", "team player", "go-getter",
    "think outside the box", "results-driven", "hard-working", "self-starter", "thought leader"
]

# Section headers we search for to check resume structure
SECTION_KEYWORDS = {
    "experience": ["experience", "work history", "employment", "professional background", "career"],
    "education": ["education", "academic", "university", "college", "degree", "qualification"],
    "skills": ["skills", "technical skills", "technologies", "expertise", "competencies"],
    "projects": ["projects", "personal projects", "portfolio", "key projects", "academic projects"],
    "contact": ["contact", "about me", "personal info", "address", "phone", "email"]
}

def analyze_resume_text(text: str) -> Dict[str, Any]:
    """
    Performs NLP analysis on extracted resume text.
    Extracts skills, checks formatting and sections, calculates ATS score,
    and returns recommendations.
    """
    clean_text = text.lower()
    
    # 1. Skill Extraction
    extracted_skills: Dict[str, List[str]] = {}
    total_skills_count = 0
    
    for category, skill_list in SKILLS_DICTIONARY.items():
        matched = []
        for skill in skill_list:
            # Word boundary check, escaping special characters (handled by dictionary escaping)
            pattern = r'\b' + skill + r'\b'
            # For skills like Next.js, C++ which have special chars, handle word boundaries carefully
            if any(char in skill for char in ['.', '+', '#']):
                pattern = r'(?:^|\s|[.,/():])' + skill + r'(?:$|\s|[.,/():])'
                
            if re.search(pattern, clean_text):
                # Clean name for display (e.g. C\\+\\+ -> C++)
                display_name = skill.replace("\\", "")
                # Capitalize nicely
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
                
                matched.append(display_name)
                total_skills_count += 1
        extracted_skills[category] = matched

    # 2. Section Checks
    sections_found = {}
    for section, keywords in SECTION_KEYWORDS.items():
        found = False
        for kw in keywords:
            # Match keywords as lines or major headings
            pattern = r'\b' + kw + r'\b'
            if re.search(pattern, clean_text):
                found = True
                break
        sections_found[section] = found

    # 3. Contact Details check
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    
    linkedin_found = "linkedin.com" in clean_text
    github_found = "github.com" in clean_text

    contact_info = {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_found,
        "github": github_found
    }

    # 4. Grammar and Writing style issues
    grammar_issues = []
    
    # Check word count
    word_count = len(text.split())
    if word_count < 100:
        grammar_issues.append({
            "type": "Formatting",
            "message": f"Resume is extremely short ({word_count} words). Recruiters look for detailed context on achievements.",
            "severity": "high"
        })
    elif word_count > 1500:
        grammar_issues.append({
            "type": "Formatting",
            "message": f"Resume is quite lengthy ({word_count} words). Try to condense details to fit a 1 or 2-page layout.",
            "severity": "low"
        })

    # Check for double spaces
    double_spaces = len(re.findall(r'[^\n ] {2,}[^\n ]', text))
    if double_spaces > 3:
        grammar_issues.append({
            "type": "Formatting",
            "message": f"Found {double_spaces} instances of double spacing. Ensure consistent spacing for a professional look.",
            "severity": "medium"
        })

    # Check for overused buzzwords
    found_buzzwords = []
    for buzz in BUZZWORDS:
        if re.search(r'\b' + buzz + r'\b', clean_text):
            found_buzzwords.append(buzz)
    if found_buzzwords:
        grammar_issues.append({
            "type": "Writing Style",
            "message": f"Avoid generic buzzwords: {', '.join(found_buzzwords)}. Replace them with active verb descriptors.",
            "severity": "low"
        })

    # Check for email and phone presence
    if not email_match:
        grammar_issues.append({
            "type": "Contact Info",
            "message": "No email address detected. Ensure your email is clearly visible in the header.",
            "severity": "high"
        })
    if not phone_match:
        grammar_issues.append({
            "type": "Contact Info",
            "message": "No phone number detected. Recruiters need a direct line to contact you.",
            "severity": "high"
        })

    # Check missing social links
    if not linkedin_found:
        grammar_issues.append({
            "type": "Contact Info",
            "message": "No LinkedIn profile URL found. A professional online presence is highly recommended.",
            "severity": "medium"
        })
    if not github_found:
        grammar_issues.append({
            "type": "Contact Info",
            "message": "No GitHub link detected. For software roles, linking code portfolios builds massive credibility.",
            "severity": "medium"
        })

    # Missing core sections
    missing_sections = [s for s, found in sections_found.items() if not found and s != "contact"]
    for s in missing_sections:
        grammar_issues.append({
            "type": "Structure",
            "message": f"Missing a clear '{s.capitalize()}' section header.",
            "severity": "high" if s in ["experience", "education", "skills"] else "medium"
        })

    # 5. Calculate scores
    # Resume Score: out of 100
    # ATS Score: out of 100
    # Interview Readiness: out of 100
    
    # Resume Score Components:
    # - Sections: 40% (10% per section: experience, education, skills, projects)
    # - Contact details: 30% (7.5% per item: email, phone, linkedin, github)
    # - Formatting issues deductions: up to 30% (deduct 5% per high issue, 3% per medium, 1% per low)
    section_score = sum([10 for s in ["experience", "education", "skills", "projects"] if sections_found.get(s)])
    contact_score = sum([7.5 for k, v in contact_info.items() if v])
    deductions = 0
    for issue in grammar_issues:
        if issue["severity"] == "high":
            deductions += 5
        elif issue["severity"] == "medium":
            deductions += 3
        else:
            deductions += 1
    resume_score = max(30, int(section_score + contact_score + (30 - deductions)))

    # ATS Compatibility Score Components:
    # - Standard sections (experience, education, skills must exist): 40%
    # - PDF/Word structure compatibility (no double space, correct word count): 30%
    # - Skill density (at least 6-10 skills matched): 30% (3% per skill up to 30%)
    ats_sections_val = sum([13.3 for s in ["experience", "education", "skills"] if sections_found.get(s)])
    ats_format_val = 30
    if double_spaces > 3: ats_format_val -= 10
    if word_count < 100 or word_count > 1500: ats_format_val -= 10
    ats_skills_val = min(30, total_skills_count * 3)
    ats_score = max(25, int(ats_sections_val + ats_format_val + ats_skills_val))

    # Interview Readiness Score Components:
    # - Experience section presence: 30%
    # - Projects section presence: 20%
    # - Soft skills present: 20% (5% per soft skill up to 20%)
    # - Tech skills count: 30% (3% per tech skill up to 30%)
    ir_exp = 30 if sections_found.get("experience") else 0
    ir_proj = 20 if sections_found.get("projects") else 0
    ir_soft = min(20, len(extracted_skills.get("Soft Skills", [])) * 5)
    
    tech_skills_count = total_skills_count - len(extracted_skills.get("Soft Skills", []))
    ir_tech = min(30, tech_skills_count * 3)
    interview_readiness = max(20, int(ir_exp + ir_proj + ir_soft + ir_tech))

    # 6. Strengths, Weaknesses, Recommendations
    strengths = []
    weaknesses = []
    recommendations = []

    if sections_found.get("experience"):
        strengths.append("Structured professional work history header is defined.")
    if total_skills_count >= 8:
        strengths.append(f"Strong keyword presence with {total_skills_count} skills extracted.")
    if contact_info["email"] and contact_info["phone"]:
        strengths.append("Crucial contact information (email, phone) is present.")
    if github_found or linkedin_found:
        strengths.append("Linked portfolios/social footprints are included.")

    if not sections_found.get("projects"):
        weaknesses.append("Missing a dedicated 'Projects' section to showcase practical work.")
        recommendations.append("Create a 'Projects' section and list 2-3 recent applications or case studies highlighting tech used.")
        
    if not github_found:
        weaknesses.append("No active GitHub link detected in contact section.")
        recommendations.append("Provide your GitHub profile URL in the header to demonstrate open-source contributions.")

    if total_skills_count < 6:
        weaknesses.append("Low overall technical keyword density.")
        recommendations.append("Tailor your skills list to match standard tech stacks, explicitly naming tools and languages.")
        
    if found_buzzwords:
        weaknesses.append(f"Contains generic cliches and buzzwords: {', '.join(found_buzzwords)}.")
        recommendations.append("Replace vague buzzwords with action verbs and quantifiable results (e.g. 'Led database migration' instead of 'dynamic team player').")

    # Fallback recommendations if everything is perfect
    if not recommendations:
        recommendations.append("Keep your resume updated with your most recent accomplishments.")
        recommendations.append("Consider adding links to personal case studies or a custom portfolio website.")
    if not strengths:
        strengths.append("Basic text formatting is legible for parsing tools.")
    if not weaknesses:
        strengths.append("Outstanding structural composition and layout.")

    # 7. Mock certification recommendations based on matched skills
    cert_map = {
        "Python": "PCAP (Python Certified Associate Programmer)",
        "AWS": "AWS Certified Cloud Practitioner or Solutions Architect",
        "Azure": "Microsoft Certified: Azure Fundamentals (AZ-900)",
        "GCP": "Google Associate Cloud Engineer",
        "Docker": "Docker Certified Associate (DCA)",
        "Kubernetes": "Certified Kubernetes Administrator (CKA)",
        "Machine Learning": "TensorFlow Developer Certificate or Google Professional ML Engineer",
        "Deep Learning": "DeepLearning.AI TensorFlow Developer",
        "React": "Meta Front-End Developer Professional Certificate",
        "Scrum": "Professional Scrum Master I (PSM I)"
    }
    
    recommended_certs = []
    # Loop through all extracted skills to see if we have certificates to suggest
    all_flat_skills = [s for cat in extracted_skills.values() for s in cat]
    for skill in all_flat_skills:
        if skill in cert_map and len(recommended_certs) < 3:
            recommended_certs.append(cert_map[skill])
            
    # Fallback default certificates
    if not recommended_certs:
        recommended_certs = [
            "CompTIA Security+ (for security awareness)",
            "AWS Certified Cloud Practitioner (for cloud infrastructure)",
            "Certified ScrumMaster (CSM) (for agile development)"
        ]

    # 8. Mock project suggestions based on gaps
    project_suggestions = []
    # If missing ML/AI:
    if "Machine Learning" not in all_flat_skills and "Deep Learning" not in all_flat_skills:
        project_suggestions.append({
            "title": "Customer Churn Prediction Model",
            "desc": "Build a machine learning classification model using Python, Scikit-Learn, and Pandas. Deploy as a Flask/FastAPI backend on Render."
        })
    # If missing Cloud/DevOps:
    if "Docker" not in all_flat_skills and "AWS" not in all_flat_skills:
        project_suggestions.append({
            "title": "Containerized CI/CD Deployment pipeline",
            "desc": "Create a multi-container React + Node.js application, configure GitHub Actions to build Docker images, and deploy to AWS Elastic Beanstalk."
        })
    # Default React/Web suggestion:
    if len(project_suggestions) < 2:
        project_suggestions.append({
            "title": "SaaS Dashboard with Real-time Analytics",
            "desc": "Develop a responsive dashboard client using React, TypeScript, and Tailwind CSS. Render charts using Recharts and connect to a serverless backend."
        })

    return {
        "raw_text": text,
        "resume_score": resume_score,
        "ats_score": ats_score,
        "interview_readiness": interview_readiness,
        "skills": extracted_skills,
        "contact_info": contact_info,
        "grammar_issues": grammar_issues,
        "sections_found": sections_found,
        "strengths": strengths[:4],
        "weaknesses": weaknesses[:4],
        "recommendations": recommendations[:4],
        "certifications": recommended_certs,
        "project_suggestions": project_suggestions
    }
