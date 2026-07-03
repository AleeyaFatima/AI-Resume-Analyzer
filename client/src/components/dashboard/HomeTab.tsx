import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { Interactive3DObject } from '../ui/Interactive3DObject';
import LoadingStages from '../ui/LoadingStages';

export const HomeTab: React.FC = () => {
  const { uploadAndAnalyze, loading, error, resumeFileName, resumeFileSize, setActiveTab } = useAnalysis();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        await uploadAndAnalyze(file);
      } catch (err) {
        console.error(err);
      }
    }
  }, [uploadAndAnalyze]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await uploadAndAnalyze(file);
      } catch (err) {
        console.error(err);
      }
    }
  }, [uploadAndAnalyze]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="glass-card rounded-glass-card p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden relative">
        {/* Subtle purple background glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-primaryPurple opacity-5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-4 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primaryPurple bg-opacity-10 border border-primaryPurple border-opacity-25 rounded-full text-xs font-semibold text-secondaryPurple tracking-wide">
            <Sparkles size={14} className="animate-pulse" />
            <span>Empowered with Local AI Core</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight text-white">
            Welcome Back
          </h1>
          <p className="text-lg md:text-xl text-textSecondary font-body font-light">
            Ready to analyze your resume with AI?
          </p>
        </div>

        {/* Elegant 3D Interactive Object */}
        <Interactive3DObject />
      </div>

      {/* Upload Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-white">Upload Resume</h2>
          <p className="text-sm text-textSecondary">Drag & Drop PDF or DOCX to analyze key skills and ATS score</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full relative"
        >
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-glass-card p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[300px] ${
              isDragActive 
                ? 'bg-primaryPurple bg-opacity-5 border border-primaryPurple shadow-glow-purple' 
                : 'glass-card'
            }`}
          >


            <input
              type="file"
              id="resume-file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              disabled={loading}
            />
            
            {loading ? (
              <LoadingStages />
            ) : resumeFileName ? (
              <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
                <div className="w-16 h-16 bg-primaryPurple bg-opacity-10 border border-primaryPurple border-opacity-20 rounded-2xl flex items-center justify-center text-successGreen">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white">
                    {resumeFileName}
                  </h3>
                  <p className="text-sm text-textSecondary mt-1">
                    Uploaded successfully ({resumeFileSize})
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white rounded-full font-heading font-bold text-xs shadow-glow-purple hover:-translate-y-0.5 hover:shadow-glow-purple-strong transition-all duration-300"
                  >
                    View Report
                  </button>
                  <label
                    htmlFor="resume-file-input"
                    className="flex-1 px-6 py-3.5 bg-white bg-opacity-5 hover:bg-opacity-10 border border-primaryPurple border-opacity-30 hover:border-opacity-50 text-white rounded-full font-heading font-bold text-xs text-center flex items-center justify-center transition-all duration-300 cursor-pointer"
                  >
                    Upload Another File
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
                <div className="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-primaryPurple animate-float-slow">
                  <Upload size={30} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white">
                    Drag & Drop Resume File
                  </h3>
                  <p className="text-sm text-textSecondary mt-1.5">
                    or click to Browse Files (PDF, DOCX, JPG, PNG)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-textSecondary bg-[#0B0B17] bg-opacity-60 px-4 py-2 rounded-xl border border-white border-opacity-5">
                  <span className="flex items-center gap-1.5"><FileText size={12} className="text-primaryPurple" /> PDF</span>
                  <span className="flex items-center gap-1.5"><FileText size={12} className="text-secondaryPurple" /> DOCX</span>
                  <span className="flex items-center gap-1.5"><FileText size={12} className="text-secondaryPurple" /> JPG/PNG</span>
                  <span className="flex items-center gap-1.5"><Shield size={12} className="text-successGreen" /> Secure</span>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-errorCoral bg-opacity-10 border border-errorCoral border-opacity-30 rounded-2xl text-errorCoral text-sm flex items-center gap-2">
              <Upload size={16} />
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
        {[
          { num: "01", title: "Upload", desc: "Drag & drop your resume file in PDF or DOCX format." },
          { num: "02", title: "Extract", desc: "Our local AI parses skills and structural headers." },
          { num: "03", title: "Analyze", desc: "Checks formatting, layout style, and keyword density." },
          { num: "04", title: "Improve", desc: "Generates custom suggestions and tailored interview coach prep." }
        ].map((step, idx) => (
          <div key={idx} className="glass-card rounded-glass-card p-6 flex flex-col items-center text-center space-y-3">
            <span className="text-lg font-mono font-bold text-secondaryPurple bg-primaryPurple bg-opacity-10 w-10 h-10 rounded-xl flex items-center justify-center border border-primaryPurple border-opacity-20 shadow-glow-purple/5">
              {step.num}
            </span>
            <h4 className="font-heading font-bold text-white text-sm">{step.title}</h4>
            <p className="text-xs text-textSecondary">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTab;
