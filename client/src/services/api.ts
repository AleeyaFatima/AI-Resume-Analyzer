const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('resumeiq_api_url');
    if (saved && !saved.includes(window.location.host)) {
      return saved;
    }
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:8080';
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

async function parseResponseJson<T>(response: Response, defaultError: string): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let msg = defaultError;
    try {
      const json = JSON.parse(text);
      msg = json.detail || json.message || msg;
    } catch (e) {
      if (text) {
        msg = `${defaultError} (${response.status}): ${text.slice(0, 80)}`;
      } else {
        msg = `${defaultError} (${response.status})`;
      }
    }
    throw new Error(msg);
  }
  return response.json();
}

export async function analyzeResume(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getApiBaseUrl()}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  return parseResponseJson<AnalysisResponse>(response, 'Failed to analyze resume.');
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

  return parseResponseJson<JobMatchResponse>(response, 'Failed to compare with job description.');
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

  return parseResponseJson<CoachResponse>(response, 'Failed to generate interview prep materials.');
}
