import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronDown, Check, X, Shield, FileText, Cpu, CheckCircle, Sparkles } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const LandingPage: React.FC = () => {
  const { uploadAndAnalyze, loading, error } = useAnalysis();
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Drag and Drop Handlers
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

  const faqs = [
    {
      q: "How does the AI analyze my resume?",
      a: "ResumeIQ AI uses state-of-the-art Natural Language Processing (NLP) to parse your resume. It analyzes word patterns, extracts structural elements, matches keywords against a rich tech skill taxonomy, checks formatting details, and computes similarity scores against your targeted job descriptions."
    },
    {
      q: "What file formats are supported?",
      a: "We currently support standard PDF (.pdf) and Microsoft Word (.docx / .doc) documents. For best results, ensure your document is text-searchable (not a flattened screenshot PDF)."
    },
    {
      q: "Is my personal data secure?",
      a: "Yes. All resume parsing and calculation happen temporarily in-memory. We do not store your physical files or sell your personal details to third parties."
    },
    {
      q: "What is an ATS and why does it matter?",
      a: "An Applicant Tracking System (ATS) is software recruiters use to filter applications. If your resume lacks the correct keyword density, standard sections, or contact links, the ATS might filter you out before a human recruiter ever sees your CV."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col font-body relative overflow-hidden">
      {/* Background Aurora Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1"></div>
        <div className="aurora-blob aurora-blob-2"></div>
        <div className="aurora-blob aurora-blob-3"></div>
      </div>

      {/* Top Header/Navigation */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-white border-opacity-10 bg-navy-deep bg-opacity-70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyanAccent to-purpleAccent flex items-center justify-center rounded-xl text-white font-heading font-extrabold text-xl shadow-glow-cyan">
              IQ
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-white select-none">
              Resume<span className="text-cyanAccent font-extrabold">IQ</span>
            </span>
          </div>
          
          {/* Floating pill navigation links */}
          <nav className="flex items-center gap-1 bg-white bg-opacity-[0.03] border border-white border-opacity-5 p-1 rounded-full backdrop-blur-md">
            <a href="#features" className="text-xs font-semibold px-4 py-2 rounded-full text-secText hover:text-white hover:bg-white hover:bg-opacity-5 transition-all">Features</a>
            <a href="#pricing" className="text-xs font-semibold px-4 py-2 rounded-full text-secText hover:text-white hover:bg-white hover:bg-opacity-5 transition-all">Compare</a>
            <a href="#faq" className="text-xs font-semibold px-4 py-2 rounded-full text-secText hover:text-white hover:bg-white hover:bg-opacity-5 transition-all">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white bg-opacity-[0.05] border border-white border-opacity-10 rounded-full text-xs font-semibold tracking-wide text-cyanAccent mb-4 shadow-glow-cyan/5">
            <Sparkles size={13} className="animate-pulse text-cyanAccent" />
            Empowered with Local AI Core
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
            Analyze Your Resume Like A <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyanAccent to-purpleAccent">Professional Recruiter</span>
          </h1>
          <p className="text-base md:text-xl text-secText max-w-2xl mx-auto font-light leading-relaxed">
            Upload. Analyze. Improve. Get Hired. ResumeIQ operates as your offline AI career coach to optimize keywords, format layouts, and estimate ATS matches.
          </p>
        </motion.div>

        {/* Drag and Drop Upload Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-2xl mt-12 relative z-10"
        >
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-glass-card p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
              isDragActive 
                ? 'bg-cyanAccent bg-opacity-5 border border-cyanAccent shadow-glow-cyan' 
                : 'glass-card'
            }`}
          >


            <input
              type="file"
              id="resume-file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileInput}
              disabled={loading}
            />
            
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-cyanAccent border-t-transparent rounded-full animate-spin"></div>
                <p className="font-heading font-bold text-lg text-cyanAccent animate-pulse">
                  AI is reading your resume...
                </p>
                <p className="text-sm text-secText">
                  Checking formats, extracting skills, grading ATS score
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6 text-center z-10">
                <div className="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-cyanAccent animate-float-slow">
                  <Upload size={30} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white">
                    Drop Resume Here
                  </h3>
                  <p className="text-sm text-secText mt-1.5">
                    or click to browse from computer
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-secText bg-navy-midnight bg-opacity-60 px-4 py-2 rounded-xl border border-white border-opacity-5">
                  <span className="flex items-center gap-1.5"><FileText size={12} className="text-cyanAccent" /> PDF</span>
                  <span className="flex items-center gap-1.5"><FileText size={12} className="text-purpleAccent" /> DOCX</span>
                  <span className="flex items-center gap-1.5"><Shield size={12} className="text-successGreen" /> Secure</span>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-errorCoral bg-opacity-10 border border-errorCoral border-opacity-30 rounded-2xl text-errorCoral text-sm flex items-center gap-2"
            >
              <X size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* How it Works Timeline Section */}
      <section className="bg-navy-midnight bg-opacity-[0.02] py-24 border-t border-b border-white border-opacity-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
              How Resume<span className="text-cyanAccent">IQ</span> Works
            </h2>
            <p className="text-secText max-w-lg mx-auto text-sm">
              Our automated NLP pipeline scores and enhances your resume in 5 simple phases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {/* Horizontal timeline guide line for desktop */}
            <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-white bg-opacity-5 z-0"></div>
            
            {[
              { num: "01", title: "Upload Resume", desc: "Upload your PDF or DOCX file. Our engine parses raw text in seconds." },
              { num: "02", title: "AI Skill Extraction", desc: "AI maps terms against languages, frameworks, cloud platforms, and soft skills." },
              { num: "03", title: "Format & Grammar", desc: "Checks layout consistency, email links, section structure, and double spaces." },
              { num: "04", title: "ATS Check", desc: "Estimates how system search bots classify your profile and gives a score." },
              { num: "05", title: "Improvement Plan", desc: "Generates project suggestions, missing certificates, and custom interview prep." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-navy-deep border border-white border-opacity-10 flex items-center justify-center font-mono text-cyanAccent font-extrabold text-lg shadow-glass transition-all group-hover:border-cyanAccent group-hover:shadow-glow-cyan/10">
                  {step.num}
                </div>
                <h4 className="font-heading font-bold text-white text-sm">{step.title}</h4>
                <p className="text-xs text-secText px-4 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Showcase */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
            Engineered For Job Seekers
          </h2>
          <p className="text-secText max-w-lg mx-auto text-sm">
            Packed with premium tools built specifically to beat modern recruitment software.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { t: "AI Resume Review", d: "Performs full structure mapping to scan for required contacts, achievements, and section headers.", icon: <CheckCircle className="text-cyanAccent" /> },
            { t: "ATS Score Estimator", d: "Pre-calculates ATS search algorithms based on formatting consistency, word density, and sections.", icon: <Cpu className="text-cyanAccent" /> },
            { t: "Formatting Checker", d: "Instantly flags double spaces, buzzword stuffing, short writeups, or missing portfolio URLs.", icon: <FileText className="text-cyanAccent" /> },
            { t: "Job Description Matcher", d: "Paste target job descriptions to analyze matching keyword density, missing stacks, and suggestions.", icon: <Upload className="text-cyanAccent" /> },
            { t: "Interview Prep Coach", d: "Generates 15 customized technical, behavioral, and HR interview questions backed by sample answers.", icon: <Cpu className="text-cyanAccent" /> },
            { t: "Career Path Suggestions", d: "Recommends missing certification paths and hands-on repository projects tailored to your tech stack gaps.", icon: <CheckCircle className="text-cyanAccent" /> }
          ].map((feat, idx) => (
            <div key={idx} className="glass-card rounded-glass-card p-8 flex flex-col space-y-4 hover:border-cyanAccent hover:border-opacity-30">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-white">{feat.t}</h3>
              <p className="text-xs text-secText leading-relaxed">{feat.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Comparison Table */}
      <section id="pricing" className="bg-navy-midnight bg-opacity-[0.02] py-24 border-t border-b border-white border-opacity-5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
              Why Resume<span className="text-cyanAccent">IQ</span> AI?
            </h2>
            <p className="text-secText max-w-lg mx-auto text-sm">
              Compare with standard online grammar spell-checkers.
            </p>
          </div>
          
          <div className="rounded-glass-card border border-white border-opacity-10 overflow-hidden shadow-glass bg-navy-deep bg-opacity-50 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white border-opacity-10 bg-white bg-opacity-[0.02]">
                  <th className="p-6 font-heading font-bold text-white text-sm">Core Features</th>
                  <th className="p-6 font-heading font-bold text-secText text-sm">Traditional Checkers</th>
                  <th className="p-6 font-heading font-bold text-cyanAccent text-sm">ResumeIQ AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-[0.07] text-xs text-secText">
                {[
                  { name: "Grammar & Formatting Scan", oldVal: true, newVal: true },
                  { name: "Skill Taxonomy Extraction", oldVal: false, newVal: true },
                  { name: "ATS Compatibility Scoring", oldVal: false, newVal: true },
                  { name: "Pasted Job JD Comparison", oldVal: false, newVal: true },
                  { name: "Custom Project/Certificate Advice", oldVal: false, newVal: true },
                  { name: "Custom Interview prep questions", oldVal: false, newVal: true }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="p-6 font-medium text-white">{row.name}</td>
                    <td className="p-6">
                      {row.oldVal ? (
                        <Check size={18} className="text-secText" />
                      ) : (
                        <X size={18} className="text-errorCoral" />
                      )}
                    </td>
                    <td className="p-6">
                      {row.newVal ? (
                        <Check size={18} className="text-cyanAccent shadow-glow-cyan" />
                      ) : (
                        <X size={18} className="text-errorCoral" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-secText text-sm">
            Everything you need to know about the parsing pipeline.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-[0.02] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center font-heading font-bold text-white hover:text-cyanAccent transition-colors text-sm"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-secText"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-xs text-secText leading-relaxed border-t border-white border-opacity-5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Glass Cards */}
      <section className="bg-navy-midnight bg-opacity-[0.02] py-24 border-t border-white border-opacity-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">
              Job Seeker Evaluations
            </h2>
            <p className="text-secText text-xs uppercase tracking-widest font-heading font-bold">
              (Sample evaluations representing standard user experiences)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "ResumeIQ helped me identify that my machine learning resume completely lacked cloud-based keywords like AWS or Docker. Once I added container projects, my callback rate doubled!", name: "Sara K.", role: "Software Engineer" },
              { q: "The job matching score is extremely accurate. I pasted a senior engineer role and got a 62%. Adding the missing TensorFlow keywords boosted my score and got me an interview.", name: "James L.", role: "ML Engineer" },
              { q: "Having the interview prep coach generate questions based on my skills was incredibly valuable. The sample answers gave me perfect talking points.", name: "Aleeya M.", role: "Data Scientist" }
            ].map((test, idx) => (
              <div key={idx} className="glass-card rounded-glass-card p-8 flex flex-col justify-between space-y-6 hover:border-cyanAccent hover:border-opacity-20">
                <p className="text-xs text-secText italic leading-relaxed">
                  "{test.q}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyanAccent to-purpleAccent flex items-center justify-center font-bold text-navy-deep text-sm">
                    {test.name[0]}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-xs text-white">{test.name}</h5>
                    <p className="text-[9px] text-secText font-medium">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-5 bg-navy-deep bg-opacity-95 py-12 text-center text-xs text-secText">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-cyanAccent to-purpleAccent rounded-lg text-white font-heading font-black text-sm flex items-center justify-center select-none shadow-glow-cyan">
              IQ
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-white">
              ResumeIQ AI
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} ResumeIQ AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;

