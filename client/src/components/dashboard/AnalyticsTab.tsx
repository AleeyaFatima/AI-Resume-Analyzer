import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAnalysis } from '../../context/AnalysisContext';
import ProgressRing from '../ui/ProgressRing';
import { Award, BarChart3, LineChart as LineIcon } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { analysisData, history } = useAnalysis();

  if (!analysisData) {
    return (
      <div className="glass-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[380px] mt-10">
        <div className="w-16 h-16 bg-white bg-opacity-5 border border-primaryPurple border-opacity-10 rounded-2xl flex items-center justify-center text-primaryPurple animate-float-slow">
          <BarChart3 size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-white">Interactive Analytics Dashboard</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Please upload a resume on the Home page first to see interactive charts mapping your keyword density, skill distribution, and ATS compatibility.
          </p>
        </div>
      </div>
    );
  }

  // 1. Calculations for Radar Chart
  const skillsCount = Object.values(analysisData.skills).reduce((acc, curr) => acc + curr.length, 0);
  const sectionsCount = Object.values(analysisData.sections_found).filter(Boolean).length;
  const contactsCount = Object.values(analysisData.contact_info).filter(Boolean).length;
  const formattingDeductions = analysisData.grammar_issues.length;

  const keywordDensityScore = Math.min(100, skillsCount * 12);
  const contactScore = Math.min(100, contactsCount * 25);
  const sectionsCoverageScore = Math.min(100, sectionsCount * 20);
  const formatQualityScore = Math.max(30, 100 - (formattingDeductions * 8));

  const radarData = [
    { subject: 'Keyword Density', score: keywordDensityScore },
    { subject: 'Contact Reach', score: contactScore },
    { subject: 'Section Coverage', score: sectionsCoverageScore },
    { subject: 'Formatting Quality', score: formatQualityScore },
    { subject: 'Interview Readiness', score: analysisData.interview_readiness },
  ];

  // 2. Calculations for Bar Chart
  const barData = Object.entries(analysisData.skills).map(([category, list]) => ({
    name: category.split(' ')[0],
    count: list.length
  }));

  // 3. Historical line chart data
  const lineData = history.slice(0, 6).reverse().map((item, idx) => ({
    name: `Scan ${idx + 1}`,
    ATS: item.data.ats_score,
    Overall: item.data.resume_score,
  }));

  // Fallback line data if history is empty
  const displayLineData = lineData.length > 0 ? lineData : [
    { name: 'Scan 1', ATS: analysisData.ats_score, Overall: analysisData.resume_score }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Overview & Circular Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ATS compatibility circular progress */}
        <div className="glass-card rounded-glass-card p-6 flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
            <Award className="text-primaryPurple" size={18} />
            <span>ATS Compatibility</span>
          </h3>
          <div className="py-2">
            <ProgressRing percentage={analysisData.ats_score} color="purple" size={130} strokeWidth={9} />
          </div>
          <p className="text-xs text-textSecondary px-2">
            Estimated parsing efficiency score calculated by matching your text density, structure, and social credentials against standard search bots.
          </p>
        </div>

        {/* Skill density explanation */}
        <div className="glass-card rounded-glass-card p-6 flex flex-col justify-between lg:col-span-2">
          <div className="space-y-3">
            <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="text-secondaryPurple" size={20} />
              <span>Keyword Density Breakdown</span>
            </h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              We parsed your CV contents against 150+ technology keywords. The charts below display the distribution of technical terminology (languages, framework stacks, databases, and DevOps tools) extracted from your resume profiles.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white border-opacity-5 mt-4">
            <div>
              <span className="text-[10px] text-textSecondary uppercase font-bold font-heading">Total Skills</span>
              <p className="font-number text-2xl font-extrabold text-white mt-1">{skillsCount}</p>
            </div>
            <div>
              <span className="text-[10px] text-textSecondary uppercase font-bold font-heading">Format Issues</span>
              <p className="font-number text-2xl font-extrabold text-errorCoral mt-1">{formattingDeductions}</p>
            </div>
            <div>
              <span className="text-[10px] text-textSecondary uppercase font-bold font-heading">Sections Found</span>
              <p className="font-number text-2xl font-extrabold text-[#10B981] mt-1">{sectionsCount}/5</p>
            </div>
            <div>
              <span className="text-[10px] text-textSecondary uppercase font-bold font-heading">Grammar Score</span>
              <p className="font-number text-2xl font-extrabold text-secondaryPurple mt-1">
                {Math.max(40, 100 - (formattingDeductions * 6))}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Matrix & Bar Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Matrix */}
        <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <LineIcon className="text-secondaryPurple" size={16} />
            <span>Keyword Vector Radar</span>
          </h3>
          <p className="text-xs text-textSecondary">Multi-dimensional semantic rating of parsed attributes.</p>
          <div className="h-64 mt-4 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(139, 92, 246, 0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#D1D5DB', fontSize: 9, fontFamily: 'Inter' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 8 }} />
                <Radar
                  name="Rating"
                  dataKey="score"
                  stroke="#8B5CF6"
                  fill="#C4B5FD"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Skill Distribution */}
        <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-primaryPurple" size={16} />
            <span>Parsed Skills Distribution</span>
          </h3>
          <p className="text-xs text-textSecondary">Count of matching keywords grouped by tech category.</p>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} width={15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181828', borderColor: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="url(#purpleGradientBar)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="purpleGradientBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart: Historical Trends */}
      <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
          <LineIcon className="text-secondaryPurple" size={16} />
          <span>Historical Scan Performance</span>
        </h3>
        <p className="text-xs text-textSecondary">Progress tracking of ATS and Quality Scores over consecutive scanning operations.</p>
        <div className="h-64 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
              <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.25)" fontSize={9} />
              <YAxis stroke="rgba(255, 255, 255, 0.25)" fontSize={9} width={20} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181828', borderColor: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px' }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="ATS" stroke="#C4B5FD" activeDot={{ r: 6 }} strokeWidth={2} />
              <Line type="monotone" dataKey="Overall" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
