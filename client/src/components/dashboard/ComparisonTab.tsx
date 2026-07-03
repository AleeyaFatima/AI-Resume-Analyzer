import React from 'react';
import { motion } from 'framer-motion';
import { useAnalysis } from '../../context/AnalysisContext';
import { FileText, Sparkles } from 'lucide-react';

export const ComparisonTab: React.FC = () => {
  const { analysisData } = useAnalysis();

  if (!analysisData) {
    return (
      <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[380px] mt-10">
        <div className="w-16 h-16 bg-white bg-opacity-5 border border-primaryPurple border-opacity-10 rounded-2xl flex items-center justify-center text-primaryPurple animate-float-slow">
          <FileText size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-white">Resume Comparison</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Please upload a resume first to view the side-by-side improvement comparison.
          </p>
        </div>
      </div>
    );
  }

  // Generate an improved version of the resume based on the raw text
  const originalText = analysisData.raw_text;
  
  // Create an improved text block dynamically
  const generateImprovedText = () => {
    let text = originalText;
    
    // Replace passive words with action verbs
    const replacements = [
      { from: /motivated and detail-oriented/i, to: "Result-driven" },
      { from: /led development/i, to: "Spearheaded design and delivery" },
      { from: /optimized database/i, to: "Architected high-performance database schemas" },
      { from: /built restful/i, to: "Engineered scalable RESTful API microservices" }
    ];

    replacements.forEach(rep => {
      text = text.replace(rep.from, rep.to);
    });

    // Append missing skills to the skills section if found
    const missingSkillsList = analysisData.weaknesses.slice(0, 3).map(w => {
      // clean weakness description into a simple skill name
      return w.replace(/missing/i, '').replace(/no references to/i, '').trim();
    }).filter(s => s.length > 0 && s.length < 25);

    if (missingSkillsList.length > 0) {
      const skillsHeaderIndex = text.toLowerCase().indexOf("skills");
      if (skillsHeaderIndex !== -1) {
        // Insert missing skills
        const insertPos = text.indexOf("\n", skillsHeaderIndex + 8);
        if (insertPos !== -1) {
          text = text.slice(0, insertPos) + `\n- Added Competencies: ${missingSkillsList.join(', ')}` + text.slice(insertPos);
        }
      }
    }

    return text;
  };

  const improvedText = generateImprovedText();

  // Helper to render highlights in comparison
  const highlightDiff = () => {
    // Splits text by lines and compares
    const origLines = originalText.split('\n');
    const impLines = improvedText.split('\n');

    return { origLines, impLines };
  };

  const { origLines, impLines } = highlightDiff();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="glass-card rounded-glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-secondaryPurple animate-pulse" />
            <span>AI Resume Optimization Comparison</span>
          </h2>
          <p className="text-xs text-textSecondary">
            Review your original document side-by-side with suggestions, highlighting active action verbs and integrated competencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Resume */}
        <div className="glass-card rounded-glass-card p-6 flex flex-col h-[550px]">
          <div className="flex items-center gap-2 pb-4 border-b border-white border-opacity-5 mb-4 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-errorCoral" />
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-textSecondary font-heading">Original Resume</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 font-mono text-[11px] leading-relaxed text-textMuted bg-[#0B0B17] bg-opacity-30 p-4 rounded-xl border border-white border-opacity-5 select-text">
            {origLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`py-0.5 ${
                  line.toLowerCase().includes("led") || line.toLowerCase().includes("built") || line.toLowerCase().includes("motivated")
                    ? "bg-errorCoral bg-opacity-10 text-errorCoral px-1 rounded"
                    : ""
                }`}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Improved */}
        <div className="glass-card rounded-glass-card p-6 flex flex-col h-[550px]">
          <div className="flex items-center justify-between pb-4 border-b border-white border-opacity-5 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-successGreen animate-pulse" />
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-white font-heading">AI Optimized Resume</h3>
            </div>
            <span className="text-[9px] font-mono font-bold bg-[#10B981] bg-opacity-10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981] border-opacity-20">
              Suggested Upgrades
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 font-mono text-[11px] leading-relaxed text-white bg-[#0B0B17] bg-opacity-50 p-4 rounded-xl border border-primaryPurple border-opacity-10 select-text">
            {impLines.map((line, idx) => {
              const isModified = line.toLowerCase().includes("spearheaded") || 
                                 line.toLowerCase().includes("architected") || 
                                 line.toLowerCase().includes("engineered") || 
                                 line.toLowerCase().includes("competencies") ||
                                 line.toLowerCase().includes("result-driven");
              return (
                <div 
                  key={idx} 
                  className={`py-0.5 ${
                    isModified
                      ? "bg-[#10B981] bg-opacity-15 text-successGreen font-bold px-1 rounded"
                      : ""
                  }`}
                >
                  {line || "\u00A0"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonTab;
