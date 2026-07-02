import React from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Trash2, 
  Eye, 
  Download,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const HistoryTab: React.FC = () => {
  const { history, deleteHistoryItem, loadHistoryItem, addToast } = useAnalysis();

  const handleDownload = (item: typeof history[0]) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ResumeIQ_Report_${item.fileName.replace(/\.[^/.]+$/, "")}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      addToast('Export Finished', 'success');
    } catch (e) {
      console.error(e);
      addToast('Error Exporting File', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="glass-card rounded-glass-card p-6 md:p-8 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <HistoryIcon size={18} className="text-secondaryPurple animate-spin-reverse" style={{ animationDuration: '8s' }} />
            <span>Scan History</span>
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Review and manage your past resume analyses. Your scans are stored securely inside your browser's local cache.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center border border-white border-opacity-5 rounded-3xl flex flex-col items-center justify-center space-y-3 bg-[#0B0B17] bg-opacity-25">
            <div className="w-12 h-12 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl flex items-center justify-center text-textSecondary">
              <FileCheck size={24} />
            </div>
            <h4 className="font-heading font-bold text-white">No scans recorded yet</h4>
            <p className="text-xs text-textSecondary">Go back to the Home tab and upload a resume file to start the analysis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white border-opacity-[0.07] pb-3 text-textSecondary text-[10px] uppercase font-bold tracking-widest font-heading">
                  <th className="pb-4">Resume Name</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-center">ATS Score</th>
                  <th className="pb-4 text-center">Overall Score</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-[0.05] text-xs text-white">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors">
                    <td className="py-4 pr-3 font-semibold max-w-[200px] truncate">
                      {item.fileName}
                    </td>
                    <td className="py-4 text-textSecondary text-[11px]">
                      {item.timestamp}
                    </td>
                    <td className="py-4 text-center font-number text-secondaryPurple font-semibold">
                      {item.data.ats_score}%
                    </td>
                    <td className="py-4 text-center font-number text-primaryPurple font-semibold">
                      {item.data.resume_score}%
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 bg-[#10B981] bg-opacity-10 border border-[#10B981] border-opacity-20 text-[#10B981] rounded-full">
                        <CheckCircle2 size={10} />
                        Completed
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Action */}
                        <button
                          onClick={() => loadHistoryItem(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primaryPurple to-secondaryPurple hover:from-hoverPurple hover:to-secondaryPurple text-white text-[11px] font-bold rounded-lg transition-all shadow-glow-purple/10"
                          title="Load & View Report"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        
                        {/* Download Action */}
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-2 bg-white bg-opacity-5 border border-primaryPurple border-opacity-25 hover:bg-primaryPurple hover:text-white rounded-lg text-textSecondary transition-all"
                          title="Download JSON Report"
                        >
                          <Download size={12} />
                        </button>
                        
                        {/* Delete Action */}
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-2 bg-white bg-opacity-5 border border-errorCoral border-opacity-20 hover:bg-errorCoral hover:text-white rounded-lg text-textSecondary transition-all"
                          title="Delete Scan Record"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HistoryTab;
