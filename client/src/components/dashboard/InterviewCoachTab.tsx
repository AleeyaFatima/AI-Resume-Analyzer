import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const InterviewCoachTab: React.FC = () => {
  const { generatePrep, coachData, loading } = useAnalysis();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'Behavioral' | 'HR'>('All');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const filteredQuestions = coachData
    ? selectedCategory === 'All'
      ? coachData.questions
      : coachData.questions.filter(q => q.type === selectedCategory)
    : [];

  const handleGenerate = async () => {
    try {
      await generatePrep();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {!coachData && !loading ? (
        <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[350px] mt-10">
          <div className="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-purpleAccent animate-float-slow">
            <HelpCircle size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-white">Customized Interview Preparation</h3>
            <p className="text-xs text-secText leading-relaxed">
              Based on your parsed stack experience and career profile, our coach will generate 15 target technical, behavioral, and HR questions complete with study responses.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyanAccent to-purpleAccent text-navy-deep hover:shadow-glow-cyan px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <Sparkles size={14} />
            <span>Generate 15 Questions</span>
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[350px] mt-10">
          <div className="w-12 h-12 border-4 border-purpleAccent border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-white text-lg animate-pulse">Formulating Custom Prompts</h4>
            <p className="text-xs text-secText">Parsing technical concepts, structuring situational behavioral templates, and packaging guides...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top stats header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-glass-card p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-cyanAccent">
                <CheckCircle size={20} />
              </div>
              <div>
                <h5 className="text-[10px] uppercase font-bold text-secText">Confidence Estimate</h5>
                <p className="font-mono text-sm font-bold text-cyanAccent mt-0.5">{coachData?.confidence_level}</p>
              </div>
            </div>

            <div className="glass-card rounded-glass-card p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-purpleAccent">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h5 className="text-[10px] uppercase font-bold text-secText">Expected Difficulty</h5>
                <p className="font-mono text-sm font-bold text-purpleAccent mt-0.5">{coachData?.expected_difficulty}</p>
              </div>
            </div>

            <div className="glass-card rounded-glass-card p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-white">
                <QuestionIcon size={20} />
              </div>
              <div>
                <h5 className="text-[10px] uppercase font-bold text-secText">Total Preparation Bank</h5>
                <p className="font-mono text-sm font-bold text-white mt-0.5">15 Tailored Questions</p>
              </div>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 border-b border-white border-opacity-5 pb-4">
            {(['All', 'Technical', 'Behavioral', 'HR'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedQuestion(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-purpleAccent bg-opacity-15 border-purpleAccent border-opacity-30 text-purpleAccent shadow-glow-purple/10'
                    : 'bg-white bg-opacity-[0.02] border-white border-opacity-5 text-secText hover:text-white'
                }`}
              >
                {cat} Questions
              </button>
            ))}
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQuestion === idx;
              
              const diffBadgeColor = {
                'Easy': 'border-cyanAccent border-opacity-20 text-cyanAccent bg-cyanAccent bg-opacity-5',
                'Medium': 'border-warningAmber border-opacity-20 text-warningAmber bg-warningAmber bg-opacity-5',
                'Hard': 'border-errorCoral border-opacity-20 text-errorCoral bg-errorCoral bg-opacity-5'
              }[q.difficulty] || 'border-white border-opacity-10 text-secText';

              const typeBadgeColor = q.type === 'Technical' 
                ? 'border-cyanAccent border-opacity-10 text-cyanAccent bg-cyanAccent bg-opacity-5' 
                : 'border-purpleAccent border-opacity-10 text-purpleAccent bg-purpleAccent bg-opacity-5';

              return (
                <div 
                  key={idx} 
                  className="rounded-glass-card border border-white border-opacity-10 bg-white bg-opacity-[0.02] overflow-hidden transition-all hover:border-cyanAccent hover:border-opacity-20"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-start gap-4 hover:bg-white hover:bg-opacity-[0.02] transition-colors"
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 border rounded-md ${typeBadgeColor}`}>
                          {q.type}
                        </span>
                        <span className={`text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 border rounded-md ${diffBadgeColor}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[8px] font-mono text-secText uppercase font-semibold">
                          Tag: {q.skill}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-xs md:text-sm text-white leading-relaxed mt-1">
                        {q.question}
                      </h4>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-secText mt-1 shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 text-xs text-secText border-t border-white border-opacity-5 leading-relaxed pt-4 space-y-2">
                          <h5 className="font-heading font-semibold text-[10px] text-cyanAccent uppercase tracking-wide">
                            AI Suggested STAR Response Guide:
                          </h5>
                          <p className="bg-navy-deep bg-opacity-40 p-4 border border-white border-opacity-5 rounded-2xl text-secText">
                            {q.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default InterviewCoachTab;

