from typing import List, Dict, Any

TECHNICAL_QUESTIONS_POOL = {
    "Python": {
        "question": "Can you explain the difference between lists and tuples in Python, and when you would choose one over the other?",
        "answer": "Lists are mutable, meaning their elements can be modified, added, or removed. Tuples are immutable and cannot be changed after creation. Tuples are faster, occupy less memory, and can be used as dictionary keys because they are hashable. You would choose a tuple for constant data records, and a list for sequences of data that will change dynamically.",
        "difficulty": "Easy"
    },
    "React": {
        "question": "What is the Virtual DOM in React, and how does it optimize rendering performance?",
        "answer": "React creates a lightweight in-memory copy of the real DOM, called the Virtual DOM. When state changes, React first applies the updates to the Virtual DOM and then compares it with the previous snapshot (a process called 'diffing'). It calculates the minimal set of changes needed and batches the updates to the real DOM, which is much faster than redrawing the whole UI.",
        "difficulty": "Medium"
    },
    "Docker": {
        "question": "What is the difference between a Docker Image and a Docker Container?",
        "answer": "A Docker Image is a read-only template that contains the application code, runtime, libraries, and settings needed to run. A Docker Container is a runnable, isolated instance of that image. You can spin up multiple containers from a single image.",
        "difficulty": "Easy"
    },
    "AWS": {
        "question": "How do you secure data in transit and at rest within AWS services like S3 or RDS?",
        "answer": "For data at rest, you use KMS (Key Management Service) to manage encryption keys, enabling AES-256 server-side encryption. For data in transit, you enforce HTTPS/TLS endpoints, utilize SSL certificates managed by AWS Certificate Manager (ACM), and configure Security Groups and Network ACLs to limit access.",
        "difficulty": "Medium"
    },
    "Machine Learning": {
        "question": "Explain overfitting in Machine Learning, and list three techniques you would use to prevent it.",
        "answer": "Overfitting occurs when a model learns the training data too well, including its noise, leading to poor generalization on unseen data. To prevent it: 1) Use regularization (L1/L2), 2) Gather more training data or perform data augmentation, and 3) Use cross-validation or apply dropout (in deep learning).",
        "difficulty": "Hard"
    },
    "TypeScript": {
        "question": "What are the key benefits of TypeScript over vanilla JavaScript, and how do Interfaces differ from Types?",
        "answer": "TypeScript introduces static typing, catching bugs during compile time rather than runtime. Interfaces are primarily used to define object shapes and support declaration merging. Types can define object shapes but also unions, primitives, tuples, and aliases, making them more versatile for complex type modeling.",
        "difficulty": "Medium"
    },
    "FastAPI": {
        "question": "Why is FastAPI considered faster than frameworks like Flask, and how does it handle asynchronous operations?",
        "answer": "FastAPI is built on ASGI (Asynchronous Server Gateway Interface) and Starlette, which allows it to handle concurrent async requests natively using Python's async/await. It also uses Pydantic for data validation, which is implemented in highly optimized Cython/Rust code.",
        "difficulty": "Medium"
    },
    "SQL": {
        "question": "What are SQL joins, and can you explain the difference between a LEFT JOIN and an INNER JOIN?",
        "answer": "Joins combine rows from two or more tables based on a related column. An INNER JOIN returns only the rows that have matching values in both tables. A LEFT JOIN returns all rows from the left table, and the matched rows from the right table; if no match is found, NULL values are returned for the right table.",
        "difficulty": "Easy"
    }
}

DEFAULT_TECHNICAL = [
    {
        "question": "What is clean code to you, and what linting or testing methodologies do you incorporate into your workflow?",
        "answer": "Clean code is readable, self-explanatory, and maintainable. I use linters (like ESLint or Flake8) to enforce style consistency, write unit tests (using Jest or Pytest) to assert correctness, and format code with Prettier or Black to keep it legible for the team.",
        "difficulty": "Medium"
    },
    {
        "question": "How do you approach debugging a high-latency API endpoint or slow web page load?",
        "answer": "I check the network waterfall in DevTools to see if it's asset loading or server response time. On the backend, I profiling database queries (e.g., adding missing indexes, optimizing joins), inspect server resource metrics (CPU/RAM), check for synchronous blocking loops, and implement caching layers (like Redis) if database operations are redundant.",
        "difficulty": "Hard"
    }
]

BEHAVIORAL_QUESTIONS = [
    {
        "question": "Describe a time when you had a conflict with a team member. How did you resolve it?",
        "answer": "Explain using the STAR method: Situation (team alignment conflict), Task (delivering on time), Action (initiated a 1-on-1 private discussion, listened to their perspective, focused on technical trade-offs), Result (reached a middle-ground consensus, delivered the feature ahead of schedule, strengthened team communication).",
        "difficulty": "Medium"
    },
    {
        "question": "Tell me about a time you made a major mistake or a project failed. What did you learn?",
        "answer": "Be honest and focus on accountability. Detail a situation where code broke in staging/production due to overlooked edge cases. Detail how you quickly coordinated a rollback/patch, implemented automated integration tests to prevent it, and established a post-mortem culture to share learnings.",
        "difficulty": "Hard"
    },
    {
        "question": "How do you manage tight deadlines when you have multiple competing priorities?",
        "answer": "I list all deliverables, evaluate them by urgency and business impact, communicate immediately with stakeholders to realign expectations, delegate minor tasks if possible, and break work down into small increments to stay focused on high-priority goals.",
        "difficulty": "Easy"
    },
    {
        "question": "Describe a situation where you had to learn a new technology quickly to solve a problem.",
        "answer": "Describe a specific tech stack (e.g., GraphQL or Docker) you hadn't used before. Detail how you read official documentations, built a sandbox prototype to test core behaviors, consulted experienced developers, and successfully integrated the solution under budget.",
        "difficulty": "Medium"
    },
    {
        "question": "Tell me about a time you went above and beyond what was expected of you on a project.",
        "answer": "Describe a time you solved a persistent issue (e.g. automating a deployment pipeline, writing missing unit tests, or redesigning an accessible UI) that was outside your immediate sprint tasks, creating lasting productivity gains for the team.",
        "difficulty": "Easy"
    }
]

HR_QUESTIONS = [
    {
        "question": "Why do you want to join our company, and what values do you think you align with?",
        "answer": "Demonstrate knowledge about the company's products, engineering culture, and vision. Connect their values to your own career path, showing enthusiasm for solving the unique challenges they face.",
        "difficulty": "Easy"
    },
    {
        "question": "Where do you see yourself in 5 years, and how does this role fit into that vision?",
        "answer": "Show a drive to grow technically and professionally. Focus on becoming a senior contributor, mentoring junior developers, mastering cloud architectures, and taking on more technical ownership in product development.",
        "difficulty": "Easy"
    },
    {
        "question": "How do you handle feedback, especially constructive criticism?",
        "answer": "I separate feedback from personal feelings. I view constructive criticism as an opportunity to grow and refine my skills, and I proactively follow up with team leads to check if my improvements align with expectations.",
        "difficulty": "Easy"
    },
    {
        "question": "What is your preferred work environment, and how do you work in distributed teams?",
        "answer": "I thrive in collaborative, transparent environments. In remote or hybrid structures, I prioritize clean documentation, active Slack/Teams communication, thorough pull requests, and prompt updates in daily stand-ups.",
        "difficulty": "Easy"
    },
    {
        "question": "What are your salary expectations, and are you willing to relocate if needed?",
        "answer": "State that you are flexible and focused on finding a role where you can add maximum value. Provide a researched salary range based on market rates for a developer of your level, or suggest discussing it further in later rounds.",
        "difficulty": "Medium"
    }
]

def generate_interview_questions(skills: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    Generates exactly 15 questions:
    - 5 Technical (tailored to resume skills where possible, with fallbacks)
    - 5 Behavioral
    - 5 HR/General
    """
    # Flatten tech skills matched in resume
    flat_skills = [s for cat, list_s in skills.items() if cat != "Soft Skills" for s in list_s]
    
    # Select technical questions
    tech_qs = []
    # Try matching custom questions based on candidate's skills
    for skill in flat_skills:
        if skill in TECHNICAL_QUESTIONS_POOL and len(tech_qs) < 5:
            q_info = TECHNICAL_QUESTIONS_POOL[skill]
            tech_qs.append({
                "type": "Technical",
                "skill": skill,
                "question": q_info["question"],
                "answer": q_info["answer"],
                "difficulty": q_info["difficulty"]
            })
            
    # Fill remaining technical questions up to 5 with default tech questions
    for default_q in DEFAULT_TECHNICAL:
        if len(tech_qs) < 5:
            tech_qs.append({
                "type": "Technical",
                "skill": "General Tech",
                "question": default_q["question"],
                "answer": default_q["answer"],
                "difficulty": default_q["difficulty"]
            })
            
    # Add other placeholder technical questions if still needed
    fallbacks = [
        ("Databases", "How do you choose between a SQL and NoSQL database for a new project?", "A SQL database provides ACID compliance, structured schemas, and joins—ideal for transactional apps. NoSQL (like MongoDB) offers flexible schemas, rapid development, and horizontal scaling—ideal for unstructured data.", "Medium"),
        ("REST APIs", "What are the main HTTP methods used in REST APIs, and what does it mean for an endpoint to be idempotent?", "GET, POST, PUT, DELETE, PATCH. An idempotent method (like GET, PUT, DELETE) produces the same result on the server regardless of how many times it's called. POST is not idempotent because it creates a new record each time.", "Easy"),
        ("Git", "What is the difference between git merge and git rebase, and when would you use each?", "Git merge preserves the full history and chronological order of branch operations. Git rebase rewrites the project history by placing your commits on top of the target branch, creating a clean linear log. Use rebase for local feature branches before sharing, and merge for main trunk integrations.", "Medium")
    ]
    for category, question, answer, diff in fallbacks:
        if len(tech_qs) < 5:
            tech_qs.append({
                "type": "Technical",
                "skill": category,
                "question": question,
                "answer": answer,
                "difficulty": diff
            })

    # Prepare behavioral questions (5)
    behavioral_qs = []
    for q in BEHAVIORAL_QUESTIONS[:5]:
        behavioral_qs.append({
            "type": "Behavioral",
            "skill": "Soft Skill",
            "question": q["question"],
            "answer": q["answer"],
            "difficulty": q["difficulty"]
        })

    # Prepare HR questions (5)
    hr_qs = []
    for q in HR_QUESTIONS[:5]:
        hr_qs.append({
            "type": "HR",
            "skill": "Professional Fit",
            "question": q["question"],
            "answer": q["answer"],
            "difficulty": q["difficulty"]
        })

    # Expected difficulty: average of technical questions + general difficulty
    # Confidence Level: estimate based on skill count
    skills_count = sum(len(lst) for lst in skills.values())
    if skills_count > 10:
        confidence = "High (Well-prepared)"
        expected_diff = "Moderate"
    elif skills_count > 5:
        confidence = "Medium (Ready with prep)"
        expected_diff = "Medium"
    else:
        confidence = "Low (Needs skill development)"
        expected_diff = "High"

    return {
        "questions": tech_qs + behavioral_qs + hr_qs,
        "confidence_level": confidence,
        "expected_difficulty": expected_diff
    }
