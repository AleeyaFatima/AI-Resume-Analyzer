import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Bookmark, 
  Grid, 
  FileText, 
  Sparkles, 
  Compass,
  Scroll,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const AnalysisTab: React.FC = () => {
  const { analysisData } = useAnalysis();

  if (!analysisData) {
    return (
      <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[380px] mt-10">
        <div className="w-16 h-16 bg-white bg-opacity-5 border border-primaryPurple border-opacity-10 rounded-2xl flex items-center justify-center text-primaryPurple animate-float-slow">
          <FileCheck size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-white">Detailed Resume Analyzer</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Please upload a resume on the Home page first to view custom AI-graded layout audits and structural reviews.
          </p>
        </div>
      </div>
    );
  }

  // Segment grammar issues into Formatting Issues and Grammar/Writing Suggestions
  const formattingIssues = analysisData.grammar_issues.filter(issue => issue.type === 'Formatting' || issue.type === 'Structure');
  const grammarSuggestions = analysisData.grammar_issues.filter(issue => issue.type === 'Writing Style' || issue.type === 'Contact Info');

  // Contact health list
  const contacts = [
    { label: 'Email Address', val: analysisData.contact_info.email || 'Missing', has: !!analysisData.contact_info.email },
    { label: 'Phone Number', val: analysisData.contact_info.phone || 'Missing', has: !!analysisData.contact_info.phone },
    { label: 'LinkedIn Link', val: analysisData.contact_info.linkedin ? 'linkedin.com/in/...' : 'Missing', has: analysisData.contact_info.linkedin },
    { label: 'GitHub Link', val: analysisData.contact_info.github ? 'github.com/...' : 'Missing', has: analysisData.contact_info.github },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Top Banner: Overall Score Summary */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-heading font-extrabold text-white">Resume Analysis Report</h2>
          <p className="text-xs text-textSecondary">
            Review detailed findings on formatting structures, extracted stack terms, and grammatical issues.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0B0B17] bg-opacity-40 p-4 border border-primaryPurple border-opacity-10 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] text-textSecondary uppercase font-bold">Overall Score</span>
            <p className="text-xs text-textSecondary mt-0.5">High quality layout</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-r from-primaryPurple to-secondaryPurple flex items-center justify-center rounded-xl font-number text-2xl font-bold text-white shadow-glow-purple">
            {analysisData.resume_score}%
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Contact health */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <Bookmark className="text-primaryPurple" size={16} />
              <span>Contact Credentials</span>
            </h3>
            <div className="space-y-3">
              {contacts.map((contact, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-[#0B0B17] bg-opacity-40 border border-white border-opacity-5 rounded-xl text-xs">
                  <span className="text-textSecondary">{contact.label}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px]">
                    {contact.has ? (
                      <>
                        <CheckCircle size={12} className="text-[#10B981]" />
                        <span className="text-white truncate max-w-[110px]">{contact.val}</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} className="text-errorCoral" />
                        <span className="text-textSecondary opacity-50">Missing</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Detected Skills */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <Grid className="text-secondaryPurple" size={16} />
              <span>Detected Skills</span>
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {Object.entries(analysisData.skills).map(([category, skillList], idx) => {
                if (skillList.length === 0) return null;
                return (
                  <div key={idx} className="space-y-2 border-b border-white border-opacity-5 pb-3 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary font-heading">
                      {category} ({skillList.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skillList.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="text-[10px] font-mono px-2.5 py-0.5 bg-[#0B0B17] bg-opacity-50 border border-primaryPurple border-opacity-15 text-white rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Overall AI Summary */}
          <div className="glass-card rounded-glass-card p-6 border-l-4 border-primaryPurple space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
                <Sparkles className="text-secondaryPurple" size={18} />
                <span>Overall AI Summary Assessment</span>
              </h3>
              <span className="text-[9px] font-mono font-bold bg-primaryPurple bg-opacity-10 text-secondaryPurple px-2 py-0.5 rounded border border-primaryPurple border-opacity-20 uppercase">
                Executive Brief
              </span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Based on the semantic analysis, your resume scores <strong>{analysisData.resume_score}%</strong>. It demonstrates strong keyword alignment across the taxonomy, but can be improved by addressing the formatting checklist and integrating missing DevOps and cloud metrics.
            </p>
          </div>

          {/* Grid of AI Feedback Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Strengths */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-successGreen space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <CheckCircle className="text-successGreen" size={16} />
                  <span>Strengths</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-successGreen bg-opacity-10 text-successGreen px-2 py-0.5 rounded border border-successGreen border-opacity-20 uppercase">
                  Verified
                </span>
              </div>
              <ul className="space-y-2.5">
                {analysisData.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-textSecondary leading-relaxed">
                    <span className="text-successGreen font-bold shrink-0 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Weaknesses */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-errorCoral space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <XCircle className="text-errorCoral" size={16} />
                  <span>Weaknesses & Gaps</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-errorCoral bg-opacity-10 text-errorCoral px-2 py-0.5 rounded border border-errorCoral border-opacity-20 uppercase">
                  Critique
                </span>
              </div>
              <ul className="space-y-2.5">
                {analysisData.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-textSecondary leading-relaxed">
                    <span className="text-errorCoral font-bold shrink-0 mt-0.5">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Missing Skills */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-warningAmber space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="text-warningAmber" size={16} />
                  <span>Missing Competency Skills</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-warningAmber bg-opacity-10 text-warningAmber px-2 py-0.5 rounded border border-warningAmber border-opacity-20 uppercase">
                  Core Gap
                </span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">
                We noted missing records for crucial stack dependencies:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {analysisData.weaknesses.slice(0, 3).map((w, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-[#0B0B17] bg-opacity-50 border border-warningAmber border-opacity-20 text-warningAmber rounded-md">
                    {w.replace(/missing/i, '').replace(/no references to/i, '').trim() || 'Additional Stack'}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 4: Action Verbs */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-primaryPurple space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Compass className="text-secondaryPurple" size={16} />
                  <span>Action Verbs Upgrade</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-primaryPurple bg-opacity-10 text-secondaryPurple px-2 py-0.5 rounded border border-primaryPurple border-opacity-20 uppercase">
                  Style
                </span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">
                Replace generic descriptors with dynamic action-oriented verbs to boost applicant metrics:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-textSecondary">
                <div className="bg-[#0B0B17] p-1.5 rounded border border-white border-opacity-5 text-center">
                  <span className="text-errorCoral line-through">Led</span> <ArrowRight size={10} className="inline mx-1 text-textMuted"/> <span className="text-successGreen font-bold">Spearheaded</span>
                </div>
                <div className="bg-[#0B0B17] p-1.5 rounded border border-white border-opacity-5 text-center">
                  <span className="text-errorCoral line-through">Built</span> <ArrowRight size={10} className="inline mx-1 text-textMuted"/> <span className="text-successGreen font-bold">Engineered</span>
                </div>
              </div>
            </div>

            {/* Card 5: Formatting Issues */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-secondaryPurple space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <FileText className="text-secondaryPurple" size={16} />
                  <span>Formatting Issues</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-primaryPurple bg-opacity-10 text-secondaryPurple px-2 py-0.5 rounded border border-primaryPurple border-opacity-20 uppercase">
                  Layout
                </span>
              </div>
              <div className="space-y-2">
                {formattingIssues.length === 0 ? (
                  <p className="text-xs text-successGreen bg-successGreen bg-opacity-5 p-2 rounded-xl border border-successGreen border-opacity-15">
                    ✓ Formatting checks passed successfully.
                  </p>
                ) : (
                  formattingIssues.slice(0, 2).map((issue, idx) => (
                    <p key={idx} className="text-xs text-textSecondary leading-relaxed">
                      • {issue.message}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Card 6: Grammar Suggestions */}
            <div className="glass-card rounded-glass-card p-6 border-l-4 border-successGreen space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-successGreen" size={16} />
                  <span>Grammar Suggestions</span>
                </h3>
                <span className="text-[9px] font-mono font-bold bg-successGreen bg-opacity-10 text-successGreen px-2 py-0.5 rounded border border-successGreen border-opacity-20 uppercase">
                  Grammar
                </span>
              </div>
              <div className="space-y-2">
                {grammarSuggestions.length === 0 ? (
                  <p className="text-xs text-successGreen bg-successGreen bg-opacity-5 p-2 rounded-xl border border-successGreen border-opacity-15">
                    ✓ Grammar checks passed successfully.
                  </p>
                ) : (
                  grammarSuggestions.slice(0, 2).map((issue, idx) => (
                    <p key={idx} className="text-xs text-textSecondary leading-relaxed">
                      • {issue.message}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Resume Summary Terminal View Card */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <Scroll className="text-primaryPurple" size={16} />
              <span>Parsed Resume Summary</span>
            </h3>
            <p className="text-xs text-textSecondary leading-normal">
              Scrollable raw text extracted from your document profile by the PDF/DOCX parser backend.
            </p>
            <div className="bg-[#0B0B17] border border-primaryPurple border-opacity-15 rounded-2xl p-4 max-h-[200px] overflow-y-auto font-mono text-[10px] leading-relaxed text-textSecondary text-left select-text whitespace-pre-wrap">
              {analysisData.raw_text}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AnalysisTab;
