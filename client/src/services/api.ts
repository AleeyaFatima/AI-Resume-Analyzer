const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('resumeiq_api_url');
    if (saved) return saved;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

export interface GrammarIssue {
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ProjectSuggestion {
  title: string;
  desc: string;
}

export interface AnalysisResponse {
  raw_text: string;
  resume_score: number;
  ats_score: number;
  interview_readiness: number;
  skills: Record<string, string[]>;
  contact_info: {
    email: string | null;
    phone: string | null;
    linkedin: boolean;
    github: boolean;
  };
  grammar_issues: GrammarIssue[];
  sections_found: Record<string, boolean>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  certifications: string[];
  project_suggestions: ProjectSuggestion[];
}

export interface JobMatchResponse {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
}

export interface Question {
  type: string;
  skill: string;
  question: string;
  answer: string;
  difficulty: string;
}

export interface CoachResponse {
  questions: Question[];
  confidence_level: string;
  expected_difficulty: string;
}

export async function analyzeResume(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getApiBaseUrl()}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to analyze resume.' }));
    throw new Error(errorData.detail || 'Failed to analyze resume.');
  }

  return response.json();
}

export async function compareResumeWithJob(
  resumeText: string,
  jobDescription: string
): Promise<JobMatchResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to compare with job description.' }));
    throw new Error(errorData.detail || 'Failed to compare with job description.');
  }

  return response.json();
}

export async function getInterviewPrep(
  skills: Record<string, string[]>
): Promise<CoachResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skills }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to generate interview prep materials.' }));
    throw new Error(errorData.detail || 'Failed to generate interview prep materials.');
  }

  return response.json();
}
