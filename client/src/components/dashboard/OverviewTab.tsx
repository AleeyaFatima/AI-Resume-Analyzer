import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award, 
  Cpu, 
  FileText, 
  Sparkles, 
  Terminal, 
  Code,
  Briefcase,
  HelpCircle,
  ChevronDown,
  Download
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { downloadPdfReport } from '../../services/pdfReport';

// Animated CountUp Component using Space Grotesk
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ 
  value, 
  duration = 1.0, 
  suffix = "" 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.floor(value);
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMs = duration * 1000;
    const stepTime = Math.max(8, Math.floor(totalMs / Math.max(end, 1)));
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 30);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="font-mono text-3xl font-extrabold text-white">{count}{suffix}</span>;
};

export const OverviewTab: React.FC = () => {
  const { 
    analysisData, 
    jobMatchData, 
    coachData,
    compareResume, 
    generatePrep, 
    loading,
    resumeFileName
  } = useAnalysis();

  const getGreetingByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const [greeting] = useState(getGreetingByTime);
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);
  const [isInterviewCoachOpen, setIsInterviewCoachOpen] = useState(false);
  
  // Job Matcher State
  const [jobText, setJobText] = useState('');
  const [jobTextError, setJobTextError] = useState<string | null>(null);

  // Interview Coach State
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'Behavioral' | 'HR'>('All');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  if (!analysisData) {
    return (
      <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[380px] mt-10">
        <div className="w-16 h-16 bg-white bg-opacity-5 border border-primaryPurple border-opacity-10 rounded-2xl flex items-center justify-center text-primaryPurple animate-float-slow">
          <Cpu size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-white">SaaS Overview Dashboard</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Please upload a resume on the Home page first to view your ResumeIQ scores and target recommendations.
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const skillsCount = Object.values(analysisData.skills).reduce((acc, curr) => acc + curr.length, 0);
  const sectionsCount = Object.values(analysisData.sections_found).filter(Boolean).length;
  const keywordOptimizationScore = Math.min(100, skillsCount * 7 + 25);
  const formattingScore = Math.min(100, sectionsCount * 20);

  const experienceScore = analysisData.sections_found.experience ? 92 : 35;
  const educationScore = analysisData.sections_found.education ? 88 : 40;

  const stats = [
    {
      title: "Resume Score",
      value: analysisData.resume_score,
      suffix: "%",
      desc: "Formatting & structure check",
      icon: <FileText size={18} className="text-primaryPurple" />,
      colorClass: "text-primaryPurple",
      ringValue: analysisData.resume_score
    },
    {
      title: "ATS Score",
      value: analysisData.ats_score,
      suffix: "%",
      desc: "Bot parsing efficiency",
      icon: <Cpu size={18} className="text-secondaryPurple" />,
      colorClass: "text-secondaryPurple",
      ringValue: analysisData.ats_score
    },
    {
      title: "Skills Match",
      value: skillsCount,
      suffix: "",
      desc: "Key industry competencies",
      icon: <Code size={18} className="text-[#10B981]" />,
      colorClass: "text-[#10B981]",
      ringValue: Math.min(100, (skillsCount / 20) * 100)
    },
    {
      title: "Keyword Match",
      value: keywordOptimizationScore,
      suffix: "%",
      desc: "Saturated vocabulary match",
      icon: <Sparkles size={18} className="text-primaryPurple" />,
      colorClass: "text-primaryPurple",
      ringValue: keywordOptimizationScore
    },
    {
      title: "Formatting Score",
      value: formattingScore,
      suffix: "%",
      desc: "Standard layout alignments",
      icon: <Terminal size={18} className="text-secondaryPurple" />,
      colorClass: "text-secondaryPurple",
      ringValue: formattingScore
    },
    {
      title: "Experience Score",
      value: experienceScore,
      suffix: "%",
      desc: "Career progression tracking",
      icon: <Briefcase size={18} className="text-[#10B981]" />,
      colorClass: "text-[#10B981]",
      ringValue: experienceScore
    },
    {
      title: "Education Score",
      value: educationScore,
      suffix: "%",
      desc: "Degree listing presence",
      icon: <Award size={18} className="text-primaryPurple" />,
      colorClass: "text-primaryPurple",
      ringValue: educationScore
    }
  ];

  // Job Matcher trigger
  const handleCompare = async () => {
    setJobTextError(null);
    if (!jobText.trim()) {
      setJobTextError('Please paste a job description first.');
      return;
    }
    try {
      await compareResume(jobText);
    } catch (e) {
      console.error(e);
    }
  };

  // Interview Coach trigger
  const handleGenerateCoach = async () => {
    try {
      await generatePrep();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredQuestions = coachData
    ? selectedCategory === 'All'
      ? coachData.questions
      : coachData.questions.filter(q => q.type === selectedCategory)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hero Header Card */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primaryPurple opacity-[0.03] blur-3xl rounded-full" />
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white bg-opacity-[0.05] border border-white border-opacity-10 rounded-full text-xs font-semibold text-secondaryPurple tracking-wide">
            <Sparkles size={12} className="animate-pulse" />
            <span>AI Coach Activated</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">
            {greeting}, Aleeya 👋
          </h1>
          <p className="text-textSecondary max-w-xl text-sm leading-relaxed">
            Ready to analyze your resume with AI? Check out your comprehensive score audits, and expand the optimization toolkits below.
          </p>
        </div>

        {/* Actions / Floating Sphere Container */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10">
          <button
            onClick={() => downloadPdfReport(analysisData, resumeFileName || 'Resume.pdf')}
            className="flex items-center gap-2 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-glow-purple duration-300 transform hover:-translate-y-0.5"
            title="Download PDF Audit Report"
          >
            <Download size={14} />
            <span>Download PDF Report</span>
          </button>
          
          <div className="relative flex items-center justify-center select-none w-20 h-20">
            <div className="w-14 h-14 sphere-gradient rounded-full animate-float-slow shadow-glow-purple/20" />
          </div>
        </div>
      </div>

      {/* 7 Premium Stats Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="glass-card rounded-glass-card p-6 flex flex-col justify-between space-y-4 relative group hover:-translate-y-1.5 hover:border-primaryPurple hover:border-opacity-30 hover:shadow-glow-purple transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary font-heading">{stat.title}</span>
              <div className="w-8 h-8 rounded-xl bg-white bg-opacity-[0.03] border border-white border-opacity-5 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div>
                <div className="py-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[10px] text-textMuted mt-1 leading-normal">{stat.desc}</p>
              </div>
              
              {/* Circular Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="transform -rotate-90" width="48" height="48">
                  <circle
                    className="text-white text-opacity-5"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                  <circle
                    className={`${stat.colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="3.5"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (Math.min(100, stat.ringValue) / 100) * 125.6}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white">
                  {Math.round(stat.ringValue)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Sections for Job Matcher & Coach */}
      <div className="space-y-6">
        
        {/* Expandable Section 1: ATS Job Description Matcher */}
        <div className="glass-card rounded-glass-card overflow-hidden">
          <button 
            onClick={() => setIsJobMatcherOpen(!isJobMatcherOpen)}
            className="w-full p-6 text-left flex justify-between items-center bg-[#181828] hover:bg-opacity-80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primaryPurple bg-opacity-10 border border-primaryPurple border-opacity-25 rounded-xl flex items-center justify-center text-primaryPurple shadow-glow-purple/10">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-md font-heading font-extrabold text-white">Target Job Compatibility Matcher</h3>
                <p className="text-[10px] text-textSecondary">Calculate keyword gaps and matching scores based on a pasted job posting</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isJobMatcherOpen ? 180 : 0 }}
              className="text-textSecondary"
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isJobMatcherOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-t border-white border-opacity-5"
              >
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#181828] bg-opacity-40">
                  {/* Left input */}
                  <div className="lg:col-span-5 space-y-4">
                    <p className="text-xs text-textSecondary leading-relaxed">
                      Paste the requirements, stack details, and role summary from any target job posting to perform immediate similarity analysis.
                    </p>
                    <textarea
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                      rows={8}
                      placeholder="Paste Job Description terms here..."
                      className="w-full bg-[#0B0B17] border border-primaryPurple border-opacity-15 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primaryPurple leading-relaxed resize-none transition-colors"
                    />
                    
                    {jobTextError && (
                      <p className="text-xs text-errorCoral flex items-center gap-1"><AlertCircle size={12}/>{jobTextError}</p>
                    )}

                    <button 
                      onClick={handleCompare}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-glow-purple duration-300 transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Compare to Description</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right results */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    {!jobMatchData ? (
                      <div className="p-8 text-center border border-white border-opacity-5 rounded-2xl flex flex-col items-center justify-center space-y-2 bg-[#0B0B17] bg-opacity-20 min-h-[220px]">
                        <FileText size={32} className="text-textSecondary opacity-30 animate-pulse" />
                        <h4 className="font-heading font-bold text-sm text-white">Awaiting Comparison</h4>
                        <p className="text-xs text-textSecondary">Paste the target job description on the left and start calculation.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-primaryPurple bg-opacity-[0.03] border border-primaryPurple border-opacity-15 rounded-2xl flex items-center gap-4">
                          <div className="w-14 h-14 bg-cardBg border border-primaryPurple border-opacity-20 rounded-xl flex items-center justify-center font-number text-lg font-bold text-secondaryPurple shadow-glow-purple/10">
                            {jobMatchData.match_score}%
                          </div>
                          <div>
                            <h5 className="font-heading font-bold text-xs text-white">
                              {jobMatchData.match_score >= 80 ? 'Excellent Compatibility!' : jobMatchData.match_score >= 60 ? 'Moderate Compatibility' : 'Low Content Similarity'}
                            </h5>
                            <p className="text-[10px] text-textSecondary leading-normal mt-0.5">
                              Matched {jobMatchData.matched_skills.length} skills, with {jobMatchData.missing_skills.length} identified gaps.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#0B0B17] bg-opacity-50 border border-white border-opacity-5 rounded-2xl space-y-2 max-h-[140px] overflow-y-auto">
                            <h6 className="text-[10px] font-heading font-bold text-[#10B981] flex items-center gap-1">
                              <CheckCircle2 size={12}/> Matched ({jobMatchData.matched_skills.length})
                            </h6>
                            <div className="flex flex-wrap gap-1">
                              {jobMatchData.matched_skills.map((s, i) => (
                                <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-white bg-opacity-5 rounded text-white">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-[#0B0B17] bg-opacity-50 border border-white border-opacity-5 rounded-2xl space-y-2 max-h-[140px] overflow-y-auto">
                            <h6 className="text-[10px] font-heading font-bold text-errorCoral flex items-center gap-1">
                              <XCircle size={12}/> Missing ({jobMatchData.missing_skills.length})
                            </h6>
                            <div className="flex flex-wrap gap-1">
                              {jobMatchData.missing_skills.map((s, i) => (
                                <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-errorCoral bg-opacity-10 border border-errorCoral border-opacity-15 rounded text-errorCoral">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0B0B17] bg-opacity-40 border border-white border-opacity-5 rounded-2xl space-y-2">
                          <h6 className="text-[10px] font-heading font-bold text-secondaryPurple uppercase tracking-wider">Tailoring Suggestions</h6>
                          <ul className="space-y-1.5">
                            {jobMatchData.suggestions.map((sug, i) => (
                              <li key={i} className="text-[11px] text-textSecondary flex items-start gap-1.5 leading-normal">
                                <span className="text-secondaryPurple font-bold shrink-0">•</span>
                                <span>{sug}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expandable Section 2: AI Interview Prep Coach */}
        <div className="glass-card rounded-glass-card overflow-hidden">
          <button 
            onClick={() => setIsInterviewCoachOpen(!isInterviewCoachOpen)}
            className="w-full p-6 text-left flex justify-between items-center bg-[#181828] hover:bg-opacity-80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondaryPurple bg-opacity-10 border border-secondaryPurple border-opacity-25 rounded-xl flex items-center justify-center text-secondaryPurple shadow-glow-purple/10">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="text-md font-heading font-extrabold text-white">AI Interview Prep Coach</h3>
                <p className="text-[10px] text-textSecondary">Generate customized technical, behavioral, and HR questions based on your resume stack</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isInterviewCoachOpen ? 180 : 0 }}
              className="text-textSecondary"
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isInterviewCoachOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-t border-white border-opacity-5"
              >
                <div className="p-6 bg-[#181828] bg-opacity-40 space-y-6">
                  {!coachData ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto min-h-[220px]">
                      <HelpCircle size={32} className="text-secondaryPurple opacity-40 animate-bounce" />
                      <h4 className="font-heading font-bold text-sm text-white">No Interview Prep Generated Yet</h4>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        Ready to practice? Click below to generate 15 customized tech, behavioral, and HR question templates based on your skills.
                      </p>
                      <button
                        onClick={handleGenerateCoach}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white rounded-full font-heading font-bold text-xs shadow-glow-purple hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {loading ? 'Formulating...' : 'Generate 15 Questions'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 border-b border-white border-opacity-5 pb-4">
                        {(['All', 'Technical', 'Behavioral', 'HR'] as const).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setExpandedQuestion(null);
                            }}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border ${
                              selectedCategory === cat
                                ? 'bg-primaryPurple bg-opacity-20 border-primaryPurple text-white shadow-glow-purple/10'
                                : 'bg-[#0B0B17] border-white border-opacity-5 text-textSecondary hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {filteredQuestions.map((q, idx) => {
                          const isExpanded = expandedQuestion === idx;
                          return (
                            <div 
                              key={idx} 
                              className="rounded-xl border border-white border-opacity-5 bg-[#0B0B17] bg-opacity-40 overflow-hidden"
                            >
                              <button
                                onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                                className="w-full p-4 text-left flex justify-between items-center text-xs text-white font-medium hover:bg-white hover:bg-opacity-5 transition-colors"
                              >
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono uppercase bg-primaryPurple bg-opacity-15 border border-primaryPurple border-opacity-15 px-2 py-0.5 rounded text-secondaryPurple font-extrabold mr-2">
                                    {q.type}
                                  </span>
                                  <span>{q.question}</span>
                                </div>
                                <ChevronDown size={14} className={`text-textSecondary transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {isExpanded && (
                                <div className="p-4 bg-cardBg border-t border-white border-opacity-5 text-xs text-textSecondary leading-relaxed">
                                  <h6 className="font-heading font-bold text-[9px] text-secondaryPurple uppercase tracking-wider mb-2">STAR Guide Response:</h6>
                                  <p className="bg-[#0B0B17] bg-opacity-50 p-3 rounded-lg border border-white border-opacity-5 text-textSecondary">
                                    {q.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

export default OverviewTab;
