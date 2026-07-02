import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  X, 
  Briefcase, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import ProgressRing from '../ui/ProgressRing';

export const JobMatcherTab: React.FC = () => {
  const { compareResume, jobMatchData, loading } = useAnalysis();
  const [jobText, setJobText] = useState('');
  const [errorInput, setErrorInput] = useState<string | null>(null);

  const handleCompare = async () => {
    setErrorInput(null);
    if (!jobText.trim()) {
      setErrorInput('Please paste a job description first.');
      return;
    }
    try {
      await compareResume(jobText);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* LEFT COLUMN: Job Description Input Area (1 Span) */}
      <div className="lg:col-span-1 space-y-4 flex flex-col">
        <div className="glass-card rounded-glass-card p-6 space-y-4 flex-1 flex flex-col">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <Briefcase size={18} className="text-cyanAccent" />
            <span>Target Job Description</span>
          </h3>
          <p className="text-xs text-secText leading-relaxed">
            Paste the job posting description here to calculate skill overlaps and alignment scores.
          </p>
          
          <div className="flex-1 flex flex-col mt-2">
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="w-full flex-1 min-h-[300px] bg-navy-deep bg-opacity-50 border border-white border-opacity-10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-cyanAccent font-body leading-relaxed resize-none"
              placeholder="Paste requirements, stack details, and role summary..."
              disabled={loading}
            ></textarea>
          </div>

          {errorInput && (
            <div className="text-xs text-errorCoral flex items-center gap-1.5 px-1">
              <AlertCircle size={14} />
              <span>{errorInput}</span>
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyanAccent to-purpleAccent text-navy-deep hover:shadow-glow-cyan disabled:bg-white disabled:bg-opacity-5 disabled:text-secText px-4 py-3 rounded-full text-xs font-bold transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy-deep border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing compatibility...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Calculate Match Score</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Analysis & Results Pane (2 Span) */}
      <div className="lg:col-span-2 space-y-6">
        {!jobMatchData && !loading ? (
          <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
            <div className="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-secText animate-float-slow">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">Compare to Role</h3>
              <p className="text-sm text-secText mt-2 max-w-sm leading-relaxed mx-auto">
                Once you paste the job posting details and click compare, we'll calculate your similarity percentage and point out which technical stack terms are missing.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[450px]">
            <div className="w-12 h-12 border-4 border-cyanAccent border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-white text-lg animate-pulse">Running Cosine Similarity Analysis</h4>
              <p className="text-xs text-secText">Comparing vocabulary structures, weighting skills, and running keyword checklists...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header compatibility KPI */}
            <div className="glass-card rounded-glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex justify-center md:justify-start">
                <ProgressRing percentage={jobMatchData?.match_score || 0} color="cyan" label="Compatibility" />
              </div>
              <div className="md:col-span-2 space-y-2 text-center md:text-left">
                <h4 className="font-heading font-bold text-lg text-white">
                  {(jobMatchData?.match_score || 0) >= 80 
                    ? 'Excellent Role Alignment!' 
                    : (jobMatchData?.match_score || 0) >= 60 
                      ? 'Moderate Role Match' 
                      : 'Low Structural Match'}
                </h4>
                <p className="text-xs text-secText leading-relaxed">
                  Your resume has {jobMatchData?.matched_skills.length} matching keyword overlays out of {(jobMatchData?.matched_skills.length || 0) + (jobMatchData?.missing_skills.length || 0)} identified keywords in the job description.
                </p>
              </div>
            </div>

            {/* Matching vs Missing splits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched list */}
              <div className="glass-card rounded-glass-card p-6 space-y-4">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyanAccent shadow-glow-cyan"></span>
                  <span>Matching Skills ({jobMatchData?.matched_skills.length || 0})</span>
                </h4>
                {jobMatchData?.matched_skills.length === 0 ? (
                  <p className="text-xs text-secText">No matching keywords found in description.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {jobMatchData?.matched_skills.map((skill, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-cyanAccent bg-opacity-5 border border-cyanAccent border-opacity-20 text-cyanAccent rounded-md">
                        <Check size={10} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing list */}
              <div className="glass-card rounded-glass-card p-6 space-y-4">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purpleAccent shadow-glow-purple"></span>
                  <span>Missing Skills ({jobMatchData?.missing_skills.length || 0})</span>
                </h4>
                {jobMatchData?.missing_skills.length === 0 ? (
                  <p className="text-xs text-secText">No missing technical terms detected.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {jobMatchData?.missing_skills.map((skill, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-purpleAccent bg-opacity-5 border border-purpleAccent border-opacity-20 text-purpleAccent rounded-md">
                        <X size={10} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom suggestions list */}
            <div className="glass-card rounded-glass-card p-6 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyanAccent" />
                <span>Job-Specific Tailoring Suggestions</span>
              </h3>
              <div className="space-y-3">
                {jobMatchData?.suggestions.map((sug, idx) => (
                  <div key={idx} className="p-3.5 bg-white bg-opacity-[0.02] border border-white border-opacity-5 rounded-2xl flex items-start gap-2.5 text-xs text-secText leading-relaxed">
                    <span className="text-cyanAccent font-mono font-bold">{idx + 1}.</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default JobMatcherTab;

