import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Settings as SettingsIcon, 
  User, 
  Home, 
  Sparkles, 
  BarChart3, 
  Bell, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  XCircle, 
  CheckCircle, 
  Info,
  LogOut,
  FileCheck
} from 'lucide-react';
import { useAnalysis, type DashboardTab } from '../../context/AnalysisContext';

// Import our tabs
import HomeTab from './HomeTab';
import AnalysisTab from './AnalysisTab';
import OverviewTab from './OverviewTab';
import AnalyticsTab from './AnalyticsTab';
import HistoryTab from './HistoryTab';
import AboutTab from './AboutTab';
import SettingsTab from './SettingsTab';
import ProfileTab from './ProfileTab';
import ComparisonTab from './ComparisonTab';

export const DashboardLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    resumeFileName, 
    resumeFileSize, 
    resetState,
    toasts,
    removeToast,
    addToast
  } = useAnalysis();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('resumeiq_theme') !== 'light';
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigationItems = [
    { id: 'home' as DashboardTab, name: 'Home', icon: <Home size={15} /> },
    { id: 'resume-analyzer' as DashboardTab, name: 'Resume Analyzer', icon: <FileText size={15} /> },
    { id: 'comparison' as DashboardTab, name: 'Compare', icon: <Sparkles size={15} /> },
    { id: 'dashboard' as DashboardTab, name: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'analytics' as DashboardTab, name: 'Analytics', icon: <BarChart3 size={15} /> },
    { id: 'history' as DashboardTab, name: 'History', icon: <Clock size={15} /> },
    { id: 'about' as DashboardTab, name: 'About Project', icon: <Sparkles size={15} /> },
    { id: 'settings' as DashboardTab, name: 'Settings', icon: <SettingsIcon size={15} /> },
    { id: 'profile' as DashboardTab, name: 'Profile', icon: <User size={15} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'resume-analyzer':
        return <AnalysisTab />;
      case 'comparison':
        return <ComparisonTab />;
      case 'dashboard':
        return <OverviewTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'history':
        return <HistoryTab />;
      case 'about':
        return <AboutTab />;
      case 'settings':
        return <SettingsTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('resumeiq_theme', nextDark ? 'dark' : 'light');
    addToast(nextDark ? 'Dark mode active' : 'Light mode active', 'info');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-bgDark text-white' : 'bg-gray-100 text-gray-800 light-mode'} flex flex-col font-body relative overflow-hidden transition-colors duration-300`}>
      {/* Background Aurora Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1"></div>
        <div className="aurora-blob aurora-blob-2"></div>
        <div className="aurora-blob aurora-blob-3"></div>
      </div>

      {/* Floating Top Navigation Bar */}
      <header className="sticky top-0 z-40 px-6 py-4 transition-all w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-cardBg bg-opacity-70 border border-primaryPurple border-opacity-15 p-2 rounded-2xl backdrop-blur-xl shadow-glass">
          {/* Logo block */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 pl-2 select-none cursor-pointer"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-primaryPurple to-secondaryPurple flex items-center justify-center rounded-xl text-white font-heading font-extrabold text-lg shadow-glow-purple">
              IQ
            </div>
            <span className="font-heading font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-textSecondary">
              Resume<span className="text-secondaryPurple font-extrabold">IQ</span>
            </span>
          </div>

          {/* Desktop Navigation (Floating Pill Buttons) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.05, filter: 'brightness(1.25)' }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'text-white z-10 font-bold' 
                      : 'text-textSecondary hover:text-white hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-primaryPurple to-secondaryPurple rounded-full -z-10 shadow-glow-purple"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  {item.icon}
                  <span>{item.name}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Right Header Controls (Notifications, Dark Mode, Profile) */}
          <div className="flex items-center gap-2 pr-1">
            
            {/* Notification Icon */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-5 border border-transparent hover:border-primaryPurple hover:border-opacity-10 text-textSecondary hover:text-white transition-all relative"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondaryPurple rounded-full shadow-glow-purple" />
              </button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-64 glass-card rounded-xl p-4 space-y-3 z-50 text-xs shadow-glass"
                  >
                    <div className="flex justify-between items-center border-b border-white border-opacity-5 pb-2">
                      <span className="font-heading font-bold text-white">Notifications</span>
                      <button onClick={() => setNotificationsOpen(false)} className="text-[10px] text-secondaryPurple font-semibold hover:underline">Clear</button>
                    </div>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      <div className="p-2 bg-white bg-opacity-[0.02] border border-white border-opacity-5 rounded-lg">
                        <p className="font-semibold text-white">Gemini Engine Online</p>
                        <p className="text-[10px] text-textSecondary mt-0.5">NLP processing systems are ready.</p>
                      </div>
                      {resumeFileName && (
                        <div className="p-2 bg-white bg-opacity-[0.02] border border-white border-opacity-5 rounded-lg">
                          <p className="font-semibold text-[#10B981]">Resume Scanned</p>
                          <p className="text-[10px] text-textSecondary mt-0.5">{resumeFileName} parsed successfully.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={handleToggleDarkMode}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-5 border border-transparent hover:border-primaryPurple hover:border-opacity-10 text-textSecondary hover:text-white transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Moon size={16} className="text-secondaryPurple" /> : <Sun size={16} />}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-primaryPurple to-secondaryPurple flex items-center justify-center font-heading font-extrabold text-[10px] text-white transition-all shadow-glow-purple/20 hover:shadow-glow-purple border ${
                activeTab === 'profile' ? 'border-white' : 'border-transparent'
              }`}
              title="View Profile"
            >
              AF
            </button>

            {/* Mobile menu trigger button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white hover:bg-opacity-5 border border-transparent text-textSecondary hover:text-white transition-all"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drop-down navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="lg:hidden fixed inset-x-0 top-[80px] bg-cardBg bg-opacity-95 backdrop-blur-2xl border border-primaryPurple border-opacity-15 z-30 m-6 p-5 rounded-2xl flex flex-col gap-4 shadow-glass"
          >
            <div className="flex flex-col gap-1.5">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                      isActive 
                        ? 'bg-gradient-to-r from-primaryPurple to-secondaryPurple text-white border-transparent font-bold shadow-glow-purple' 
                        : 'text-textSecondary border-transparent hover:bg-white hover:bg-opacity-5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white border-opacity-5 pt-3.5 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primaryPurple to-secondaryPurple flex items-center justify-center font-bold text-white text-xs shadow-glow-purple/20">
                  AF
                </div>
                <div>
                  <h5 className="font-heading font-bold text-xs text-white">Aleeya Fatima</h5>
                  <p className="text-[10px] text-textSecondary font-mono">aleeyaali567@gmail.com</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  resetState();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white bg-opacity-5 border border-white border-opacity-5 hover:border-primaryPurple hover:border-opacity-15 text-textSecondary hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition-all"
              >
                <LogOut size={13} />
                <span>Start New Scan</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main dashboard content container */}
      <main className="flex-1 flex flex-col min-w-0 max-w-7xl w-full mx-auto p-6 space-y-6 z-10 relative">
        {/* Session context bar - only visible if resume is uploaded */}
        {resumeFileName && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-[#181828] bg-opacity-40 border border-primaryPurple border-opacity-10 backdrop-blur-md gap-4"
          >
            <div className="flex items-center gap-3">
              <FileCheck size={18} className="text-secondaryPurple animate-pulse" />
              <div>
                <p className="text-[9px] uppercase font-bold tracking-widest text-textSecondary font-heading">Analyzing Resume</p>
                <h4 className="font-heading font-bold text-xs text-white truncate max-w-xs md:max-w-md mt-0.5">
                  {resumeFileName}
                </h4>
              </div>
              {resumeFileSize && (
                <span className="text-[9px] font-mono px-2 py-0.5 bg-white bg-opacity-5 border border-white border-opacity-5 text-textSecondary rounded-md">
                  {resumeFileSize}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-textSecondary">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span>Local Core Server: <span className="text-white font-bold uppercase">Online</span></span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Dynamic tab contents rendering */}
        <div className="flex-1 min-w-0">
          {renderTabContent()}
        </div>
      </main>

      {/* Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: 0, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between gap-3 shadow-glass min-w-[280px] max-w-sm ${
                toast.type === 'success' 
                  ? 'bg-[#181828] border-[#10B981] border-opacity-30 text-white' 
                  : toast.type === 'error'
                    ? 'bg-[#181828] border-errorCoral border-opacity-30 text-white'
                    : 'bg-[#181828] border-primaryPurple border-opacity-30 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle size={16} className="text-[#10B981]" />}
                {toast.type === 'error' && <XCircle size={16} className="text-errorCoral" />}
                {toast.type === 'info' && <Info size={16} className="text-primaryPurple animate-pulse" />}
                <span className="text-xs font-semibold">{toast.message}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="text-textSecondary hover:text-white transition-colors p-0.5 rounded hover:bg-white hover:bg-opacity-5"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-5 bg-[#181828] bg-opacity-40 py-12 text-xs text-textSecondary mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-primaryPurple to-secondaryPurple rounded-lg text-white font-heading font-black text-xs flex items-center justify-center select-none shadow-glow-purple">
                IQ
              </div>
              <span className="font-heading font-bold text-sm tracking-tight text-white select-none">
                Resume<span className="text-secondaryPurple font-extrabold">IQ</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-textMuted max-w-sm">
              An intelligent resume analysis and career optimization platform designed to align resumes with ATS guidelines and recruitments standard.
            </p>
            <span className="text-[10px] text-textMuted mt-1">Version 2.0.0</span>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="font-heading font-bold text-white uppercase tracking-wider text-[10px]">Developer</h5>
            <div className="space-y-1.5 text-textSecondary">
              <p className="font-semibold text-white">Aleeya Fatima</p>
              <p className="text-[11px] text-textMuted">BS Artificial Intelligence Student</p>
              <div className="flex flex-col gap-1 mt-2 text-[11px]">
                <a href="mailto:aleeyaali567@gmail.com" className="hover:text-primaryPurple transition-colors">Email: aleeyaali567@gmail.com</a>
                <a href="tel:+923016668865" className="hover:text-secondaryPurple transition-colors">Phone: +92 301 6668865</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="font-heading font-bold text-white uppercase tracking-wider text-[10px]">Links & Socials</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }} className="hover:text-white transition-colors">About Project</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }} className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-[10px] text-textMuted mt-4">
              ResumeIQ AI © 2026. Built with Artificial Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
