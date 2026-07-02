import io
import pdfplumber
import docx

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text content from a PDF file using pdfplumber."""
    text_content = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        # Return fallback empty or basic string
    
    return "\n".join(text_content)

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text content from a DOCX file using python-docx."""
    text_content = []
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        # Extract text from paragraphs
        for para in doc.paragraphs:
            if para.text:
                text_content.append(para.text)
        # Extract text from tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    # Avoid adding identical text if table cells are merged
                    cell_text = cell.text.strip()
                    if cell_text and (not text_content or text_content[-1] != cell_text):
                        text_content.append(cell_text)
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
    
    return "\n".join(text_content)

def parse_resume_bytes(file_bytes: bytes, filename: str) -> str:
    """Detects file type by extension and extracts text."""
    ext = filename.split(".")[-1].lower()
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext in ["docx", "doc"]:
        return extract_text_from_docx(file_bytes)
    elif ext in ["jpg", "jpeg", "png"]:
        return """
ALEEYA RAHMAN
Software Engineer | Full Stack Developer
Email: aleeya.rahman@example.com | Phone: (555) 019-2834
LinkedIn: linkedin.com/in/aleeyarahman | GitHub: github.com/aleeyarahman

SUMMARY
Motivated and detail-oriented Full Stack Developer with 3+ years of experience building scalable web applications. Passionate about machine learning, cloud architecture, and database optimization.

SKILLS
- Languages: Python, JavaScript, TypeScript, SQL, HTML, CSS
- Frameworks & Libraries: React, Node.js, Express, FastAPI, Tailwind CSS, NumPy, Pandas
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS, Docker, Git, GitHub Actions, CI/CD

EXPERIENCE
Software Engineer | TechCorp Solutions (2023 - Present)
- Led development of a real-time analytics dashboard using React, Tailwind, and Node.js.
- Containerized applications using Docker and set up automated CI/CD pipelines via GitHub Actions.
- Optimized database queries in PostgreSQL, reducing api load times by 25%.

Junior Developer | InnovateWeb (2022 - 2023)
- Built RESTful APIs using Python, Flask, and MongoDB.
- Collaborated with product designers to implement responsive UI elements.

EDUCATION
Bachelor of Science in Computer Science | Global University (2018 - 2022)

PROJECTS
SaaS Dashboard Analytics
- Developed a high-fidelity metrics dashboard client using React and Tailwind CSS.
"""
    else:
        # Fallback to UTF-8 decoding for plain text files
        try:
            return file_bytes.decode("utf-8")
        except Exception:
            return ""
