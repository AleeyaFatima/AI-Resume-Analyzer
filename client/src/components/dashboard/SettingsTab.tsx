import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Link as LinkIcon, Check } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const SettingsTab: React.FC = () => {
  const { addToast } = useAnalysis();
  const [apiUrl, setApiUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('resumeiq_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:8080';
    }
    return 'http://localhost:8080';
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeiq_api_url', apiUrl);
    }
    setSaved(true);
    addToast('Configuration Saved', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const themeTokens = [
    { name: 'Background Theme', hex: '#111827', css: 'bg-[#111827]' },
    { name: 'Card Background', hex: '#1f2937', css: 'bg-[#1f2937]' },
    { name: 'Primary Purple', hex: '#8B5CF6', css: 'bg-[#8B5CF6]' },
    { name: 'Secondary Purple', hex: '#C4B5FD', css: 'bg-[#C4B5FD]' },
    { name: 'Hover Purple', hex: '#A78BFA', css: 'bg-[#A78BFA]' },
    { name: 'Secondary Text', hex: '#D1D5DB', css: 'bg-[#D1D5DB]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
    >
      {/* 1. API Configuration */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <LinkIcon size={18} className="text-primaryPurple" />
          <span>Local Engine URL</span>
        </h3>
        <p className="text-xs text-textSecondary leading-relaxed">
          Modify the server port if you deploy the FastAPI backend to a different local host domain or online platform.
        </p>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-textSecondary font-heading">Backend Base URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-[#0B0B17] border border-primaryPurple border-opacity-15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-secondaryPurple font-mono transition-colors"
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white px-4 py-3.5 rounded-full text-xs font-bold transition-all shadow-glow-purple duration-300 transform hover:-translate-y-0.5"
          >
            {saved ? (
              <>
                <Check size={14} />
                <span>Configuration Saved</span>
              </>
            ) : (
              <span>Save Connection</span>
            )}
          </button>
        </form>
      </div>

      {/* 2. Theme Details */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <Paintbrush size={18} className="text-secondaryPurple" />
          <span>ResumeIQ Style Tokens</span>
        </h3>
        <p className="text-xs text-textSecondary leading-relaxed">
          Visual styling tokens specified in tailwind and index.css configurations.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {themeTokens.map((theme, idx) => (
            <div key={idx} className="p-3 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-2xl flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg shrink-0 ${theme.css} border border-white border-opacity-10`} />
              <div className="overflow-hidden">
                <h6 className="font-heading font-bold text-[10px] text-white truncate">{theme.name}</h6>
                <p className="text-[8px] font-mono text-textSecondary mt-0.5">{theme.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
