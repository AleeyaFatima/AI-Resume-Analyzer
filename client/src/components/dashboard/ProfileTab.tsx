import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Award, Clock, FileCheck, CheckCircle2 } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ProfileTab: React.FC = () => {
  const { history, analysisData } = useAnalysis();

  const totalScans = history.length;
  const highestScore = history.length > 0 
    ? Math.max(...history.map(item => item.data.ats_score)) 
    : (analysisData ? analysisData.ats_score : 0);
  
  const latestScore = analysisData ? analysisData.ats_score : (history.length > 0 ? history[0].data.ats_score : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
    >
      {/* Profile Card */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 flex flex-col items-center text-center space-y-6 md:col-span-1">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primaryPurple to-secondaryPurple flex items-center justify-center font-heading font-extrabold text-white text-3xl shadow-glow-purple">
            AF
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-successGreen border-4 border-cardBg flex items-center justify-center" title="Online" />
        </div>

        <div>
          <h3 className="text-xl font-heading font-extrabold text-white">Aleeya Fatima</h3>
          <p className="text-xs text-secondaryPurple font-mono mt-0.5">BS Artificial Intelligence</p>
        </div>

        <div className="w-full border-t border-white border-opacity-5 pt-4 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-textSecondary justify-center">
            <Mail size={14} className="text-primaryPurple" />
            <span>aleeya.fatima@example.com</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-textSecondary justify-center">
            <User size={14} className="text-secondaryPurple" />
            <span>System Administrator</span>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 md:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-bold text-white">Account Statistics</h3>
          <p className="text-xs text-textSecondary leading-normal">
            Track your ResumeIQ platform interactions and performance records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {/* Stat 1: Total Scans */}
          <div className="p-4 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5">
            <Clock size={20} className="text-secondaryPurple" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary">Total Scans</span>
            <span className="font-number text-2xl font-extrabold text-white">{totalScans}</span>
          </div>

          {/* Stat 2: Latest ATS Score */}
          <div className="p-4 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5">
            <FileCheck size={20} className="text-primaryPurple" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary">Latest Score</span>
            <span className="font-number text-2xl font-extrabold text-white">{latestScore}%</span>
          </div>

          {/* Stat 3: Highest ATS Score */}
          <div className="p-4 bg-[#0B0B17] bg-opacity-40 border border-primaryPurple border-opacity-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5">
            <Award size={20} className="text-successGreen" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary">Highest Score</span>
            <span className="font-number text-2xl font-extrabold text-white">{highestScore}%</span>
          </div>
        </div>

        <div className="p-4 bg-primaryPurple bg-opacity-5 border border-primaryPurple border-opacity-10 rounded-2xl flex items-start gap-3 mt-6">
          <CheckCircle2 size={16} className="text-successGreen shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-heading font-bold text-xs text-white">Verification Status</h5>
            <p className="text-[10px] text-textSecondary leading-relaxed">
              Your profile is verified and linked to your educational account. Free analysis features are active under academic licensing.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
