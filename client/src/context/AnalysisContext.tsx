import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  analyzeResume, 
  compareResumeWithJob, 
  getInterviewPrep, 
  type AnalysisResponse, 
  type JobMatchResponse, 
  type CoachResponse 
} from '../services/api';

export type DashboardTab = 'home' | 'resume-analyzer' | 'dashboard' | 'analytics' | 'history' | 'about' | 'settings' | 'profile' | 'comparison';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  timestamp: string;
  data: AnalysisResponse;
}

interface AnalysisContextType {
  loading: boolean;
  error: string | null;
  analysisData: AnalysisResponse | null;
  jobMatchData: JobMatchResponse | null;
  coachData: CoachResponse | null;
  resumeFileName: string | null;
  resumeFileSize: string | null;
  pastedJobDesc: string;
  activeTab: DashboardTab;
  history: AnalysisHistoryItem[];
  toasts: Toast[];
  uploadAndAnalyze: (file: File) => Promise<void>;
  compareResume: (jobDescription: string) => Promise<void>;
  generatePrep: () => Promise<void>;
  setActiveTab: (tab: DashboardTab) => void;
  setPastedJobDesc: (desc: string) => void;
  resetState: () => void;
  deleteHistoryItem: (id: string) => void;
  loadHistoryItem: (item: AnalysisHistoryItem) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [jobMatchData, setJobMatchData] = useState<JobMatchResponse | null>(null);
  const [coachData, setCoachData] = useState<CoachResponse | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeFileSize, setResumeFileSize] = useState<string | null>(null);
  const [pastedJobDesc, setPastedJobDesc] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('resumeiq_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history from localStorage', e);
      }
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const saveHistory = (newHistory: AnalysisHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('resumeiq_history', JSON.stringify(newHistory));
  };

  const uploadAndAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      addToast('Uploading resume...', 'info');
      const data = await analyzeResume(file);
      setAnalysisData(data);
      
      // Calculate file size string
      const sizeKb = file.size / 1024;
      const sizeStr = sizeKb > 1024 
        ? `${(sizeKb / 1024).toFixed(1)} MB` 
        : `${sizeKb.toFixed(0)} KB`;
        
      setResumeFileName(file.name);
      setResumeFileSize(sizeStr);
      setJobMatchData(null); // Reset job comparisons
      setCoachData(null); // Reset coach data
      setPastedJobDesc('');
      
      // Add to history
      const historyItem: AnalysisHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        data: data
      };
      saveHistory([historyItem, ...history]);

      addToast('Resume Uploaded Successfully', 'success');
      setTimeout(() => {
        addToast('Analysis Complete', 'success');
        setActiveTab('dashboard');
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during resume analysis.');
      addToast('Error Uploading File', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const compareResume = async (jobDescription: string) => {
    if (!analysisData) {
      setError('Please upload a resume first.');
      addToast('Upload resume first', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      addToast('Running keyword gap analysis...', 'info');
      const data = await compareResumeWithJob(analysisData.raw_text, jobDescription);
      setJobMatchData(data);
      setPastedJobDesc(jobDescription);
      addToast('Analysis Complete', 'success');
    } catch (err: any) {
      setError(err.message || 'An error occurred during job comparison.');
      addToast('Job matching failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePrep = async () => {
    if (!analysisData) {
      setError('Please upload a resume first.');
      addToast('Upload resume first', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      addToast('Formulating coach questions...', 'info');
      const data = await getInterviewPrep(analysisData.skills);
      setCoachData(data);
      addToast('Questions Generated Successfully', 'success');
    } catch (err: any) {
      setError(err.message || 'An error occurred during interview coaching generation.');
      addToast('Interview coach generation failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setAnalysisData(null);
    setJobMatchData(null);
    setCoachData(null);
    setResumeFileName(null);
    setResumeFileSize(null);
    setPastedJobDesc('');
    setActiveTab('home');
    setError(null);
    addToast('Start New Scan - State Reset', 'info');
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
    addToast('Record Deleted', 'info');
  };

  const loadHistoryItem = (item: AnalysisHistoryItem) => {
    setAnalysisData(item.data);
    setResumeFileName(item.fileName);
    setResumeFileSize(null);
    setJobMatchData(null);
    setCoachData(null);
    setPastedJobDesc('');
    setActiveTab('dashboard');
    addToast('Resume loaded from history', 'success');
  };

  return (
    <AnalysisContext.Provider
      value={{
        loading,
        error,
        analysisData,
        jobMatchData,
        coachData,
        resumeFileName,
        resumeFileSize,
        pastedJobDesc,
        activeTab,
        history,
        toasts,
        uploadAndAnalyze,
        compareResume,
        generatePrep,
        setActiveTab,
        setPastedJobDesc,
        resetState,
        deleteHistoryItem,
        loadHistoryItem,
        addToast,
        removeToast
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};
