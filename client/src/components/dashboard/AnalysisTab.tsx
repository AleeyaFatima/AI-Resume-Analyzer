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
  FileCheck
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
          
          {/* Grid: Strengths & Weaknesses (2 Premium Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <div className="glass-card rounded-glass-card p-6 space-y-4">
              <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
                <CheckCircle className="text-[#10B981]" size={16} />
                <span>Strengths</span>
              </h3>
              <ul className="space-y-2.5">
                {analysisData.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-textSecondary leading-relaxed">
                    <span className="text-[#10B981] font-bold shrink-0 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Missing Keywords Card */}
            <div className="glass-card rounded-glass-card p-6 space-y-4">
              <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
                <XCircle className="text-errorCoral" size={16} />
                <span>Weaknesses & Missing Keywords</span>
              </h3>
              <ul className="space-y-2.5">
                {analysisData.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-textSecondary leading-relaxed">
                    <span className="text-errorCoral font-bold shrink-0 mt-0.5">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions Card */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <Compass className="text-primaryPurple" size={16} />
              <span>Improvement Suggestions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysisData.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-2xl flex items-start gap-2.5 text-xs text-textSecondary leading-relaxed">
                  <span className="text-secondaryPurple font-mono font-bold">{idx + 1}.</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formatting Issues Checklist Card */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <FileText className="text-secondaryPurple" size={16} />
              <span>Formatting Issues</span>
            </h3>
            <div className="space-y-2">
              {formattingIssues.length === 0 ? (
                <p className="text-xs text-[#10B981] bg-[#10B981] bg-opacity-5 p-3 rounded-xl border border-[#10B981] border-opacity-15">
                  ✓ Formatting check passed: No double spacing or structure alerts detected.
                </p>
              ) : (
                formattingIssues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0B17] bg-opacity-40 border border-errorCoral border-opacity-10 rounded-xl flex items-start gap-2.5 text-xs text-textSecondary">
                    <AlertTriangle size={14} className="text-errorCoral shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading font-bold text-[10px] text-white uppercase block mb-0.5">{issue.type}</span>
                      <p>{issue.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grammar Suggestions Card */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h3 className="text-md font-heading font-bold text-white flex items-center gap-2">
              <Sparkles className="text-primaryPurple" size={16} />
              <span>Grammar & Writing Suggestions</span>
            </h3>
            <div className="space-y-2">
              {grammarSuggestions.length === 0 ? (
                <p className="text-xs text-[#10B981] bg-[#10B981] bg-opacity-5 p-3 rounded-xl border border-[#10B981] border-opacity-15">
                  ✓ Grammar check passed: No buzzword density or contact details issues found.
                </p>
              ) : (
                grammarSuggestions.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-xl flex items-start gap-2.5 text-xs text-textSecondary">
                    <AlertTriangle size={14} className="text-secondaryPurple shrink-0 mt-0.5" />
                    <div>
                      <span className="font-heading font-bold text-[10px] text-white uppercase block mb-0.5">{issue.type}</span>
                      <p>{issue.message}</p>
                    </div>
                  </div>
                ))
              )}
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
            <div className="bg-[#0B0B17] border border-primaryPurple border-opacity-15 rounded-2xl p-4 max-h-[250px] overflow-y-auto font-mono text-[10px] leading-relaxed text-textSecondary text-left select-text whitespace-pre-wrap">
              {analysisData.raw_text}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AnalysisTab;
