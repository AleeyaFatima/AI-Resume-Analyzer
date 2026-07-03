import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles, Cpu, Search, Database, Layers, CheckSquare } from 'lucide-react';

const stages = [
  { id: 0, label: "Uploading Resume...", desc: "Securely transmitting document bytes", icon: <Loader2 size={16} className="animate-spin text-primaryPurple" /> },
  { id: 1, label: "Reading Document...", desc: "Extracting UTF-8 character arrays", icon: <Search size={16} className="text-secondaryPurple" /> },
  { id: 2, label: "Extracting Skills...", desc: "Identifying language and framework markers", icon: <Database size={16} className="text-[#10B981]" /> },
  { id: 3, label: "Matching Keywords...", desc: "Aligning terminology density indexes", icon: <Layers size={16} className="text-primaryPurple" /> },
  { id: 4, label: "Detecting Experience...", desc: "Mapping career timelines & achievements", icon: <Cpu size={16} className="text-secondaryPurple" /> },
  { id: 5, label: "Calculating ATS Score...", desc: "Evaluating compatibility heuristics", icon: <CheckSquare size={16} className="text-[#10B981]" /> },
  { id: 6, label: "Generating Suggestions...", desc: "Structuring career preparation advice", icon: <Sparkles size={16} className="text-primaryPurple animate-pulse" /> },
  { id: 7, label: "Preparing Final Report...", desc: "Formatting consulting layout records", icon: <Loader2 size={16} className="animate-spin text-secondaryPurple" /> }
];

export const LoadingStages: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // Step through stages every 1.3 seconds to simulate engaging AI thought progression
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 1300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-cardBg rounded-glass-card border border-white border-opacity-5 backdrop-blur-xl space-y-6">
      <div className="flex items-center gap-3 justify-center mb-2">
        <Sparkles className="text-secondaryPurple animate-pulse" size={22} />
        <h4 className="font-heading font-extrabold text-white text-base">ResumeIQ AI Engine</h4>
      </div>

      {/* Shimmer/Skeleton Indicator */}
      <div className="relative w-full h-2 bg-white bg-opacity-5 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primaryPurple via-secondaryPurple to-[#10B981]"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <div className="space-y-3.5">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;

          return (
            <div 
              key={stage.id} 
              className={`flex items-start gap-3.5 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primaryPurple bg-opacity-[0.04] border border-primaryPurple border-opacity-10 scale-[1.01]' 
                  : 'border border-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[#10B981] bg-opacity-10 border border-[#10B981] flex items-center justify-center text-[#10B981]">
                    <Check size={11} strokeWidth={3} />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    {stage.icon}
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white border-opacity-10" />
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <p className={`text-xs font-bold font-heading transition-colors ${
                  isCompleted ? 'text-[#10B981]' : isActive ? 'text-white' : 'text-textMuted'
                }`}>
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-[10px] text-textSecondary font-medium leading-relaxed truncate">
                    {stage.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingStages;
