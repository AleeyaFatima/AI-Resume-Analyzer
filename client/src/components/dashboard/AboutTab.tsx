import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, Code, ShieldCheck } from 'lucide-react';

export const AboutTab: React.FC = () => {
  const features = [
    "AI Resume Analysis",
    "ATS Compatibility Score",
    "Resume Quality Score",
    "Grammar Analysis",
    "Keyword Detection",
    "Missing Skills Identification",
    "Resume Formatting Review",
    "Personalized Improvement Suggestions",
    "Downloadable PDF Report",
    "Resume Scan History",
    "Interactive Analytics Dashboard",
    "Responsive Design",
    "Secure File Processing"
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "Tailwind CSS", category: "Design" },
    { name: "Node.js", category: "Backend" },
    { name: "Express.js", category: "Backend" },
    { name: "Python", category: "AI Engine" },
    { name: "FastAPI", category: "AI Engine" },
    { name: "Machine Learning", category: "AI Engine" },
    { name: "Artificial Intelligence", category: "AI Engine" },
    { name: "Chart.js", category: "Analytics" },
    { name: "Framer Motion", category: "Animation" },
    { name: "Lucide Icons", category: "Design" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Platform Description */}
      <div className="glass-card rounded-glass-card p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primaryPurple opacity-5 rounded-full blur-[80px] pointer-events-none" />
        
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold flex items-center gap-2">
          <Sparkles className="text-secondaryPurple animate-pulse" size={24} />
          <span>What is ResumeIQ AI?</span>
        </h2>
        
        <p className="text-sm md:text-base text-textSecondary leading-relaxed">
          ResumeIQ AI is an intelligent resume analysis platform that helps job seekers improve their resumes using Artificial Intelligence. The system evaluates resumes against modern ATS (Applicant Tracking System) standards and provides actionable recommendations to improve interview chances.
        </p>
      </div>

      {/* Grid: Features & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Features list (Span 7) */}
        <div className="glass-card rounded-glass-card p-6 md:p-8 md:col-span-7 space-y-4">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <Award className="text-primaryPurple" size={20} />
            <span>Key Features</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-xl text-xs text-white">
                <ShieldCheck size={14} className="text-secondaryPurple shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Credits (Span 5) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Mission */}
          <div className="glass-card rounded-glass-card p-6 space-y-3 flex-1 flex flex-col justify-center">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-primaryPurple font-heading">Our Mission</h4>
            <blockquote className="text-sm text-textSecondary italic border-l-2 border-primaryPurple pl-3 leading-relaxed">
              "Our mission is to help students and professionals create stronger resumes using the power of Artificial Intelligence, making career preparation simpler, smarter, and more accessible."
            </blockquote>
          </div>

          {/* Credits */}
          <div className="glass-card rounded-glass-card p-6 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-secondaryPurple font-heading">Credits & Development</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryPurple to-secondaryPurple flex items-center justify-center font-heading font-extrabold text-white text-lg shadow-glow-purple">
                AF
              </div>
              <div>
                <h5 className="font-heading font-bold text-sm text-white">Aleeya Fatima</h5>
                <p className="text-xs text-secondaryPurple font-mono mt-0.5">BS Artificial Intelligence</p>
              </div>
            </div>
            <div className="flex gap-2 text-[10px] text-textSecondary font-semibold pt-1">
              <span className="px-2 py-0.5 bg-white bg-opacity-5 rounded border border-white border-opacity-5">Developer</span>
              <span className="px-2 py-0.5 bg-white bg-opacity-5 rounded border border-white border-opacity-5">Designer</span>
              <span className="px-2 py-0.5 bg-white bg-opacity-5 rounded border border-white border-opacity-5">AI Architect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <Code className="text-primaryPurple" size={20} />
          <span>Technologies Used</span>
        </h3>
        <p className="text-xs text-textSecondary">State of the art libraries, frameworks and languages implementing the parser and analysis pipeline.</p>
        <div className="flex flex-wrap gap-2.5 pt-3">
          {technologies.map((tech, idx) => (
            <div key={idx} className="group relative flex items-center gap-2 px-4 py-2 bg-[#0B0B17] bg-opacity-65 border border-primaryPurple border-opacity-15 hover:border-opacity-35 hover:shadow-glow-purple/5 rounded-xl transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-secondaryPurple group-hover:scale-125 transition-transform" />
              <div>
                <span className="text-xs text-white font-medium">{tech.name}</span>
                <span className="block text-[8px] font-mono text-textSecondary uppercase tracking-widest mt-0.5">{tech.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutTab;
