import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Calendar, Activity, ChevronRight, Hash, MoreHorizontal, Database, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const HistoryPanel = ({ history = [] }) => {
  const { theme } = useTheme();
  const safeHistory = Array.isArray(history) ? history : [];

  const sortedHistory = useMemo(() => {
    return [...safeHistory].reverse();
  }, [safeHistory]);

  const recentRecords = sortedHistory.slice(0, 15);

  const getConfidenceColor = (conf) => {
    if (conf > 0.75) return 'text-emerald-500';
    if (conf >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (safeHistory.length === 0) {
    return (
      <div className={`border rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px] bg-slate-900/40 border-slate-800/60`}>
        <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl border bg-slate-950 border-slate-800 text-slate-700`}>
          <Database size={32} />
        </div>
        <div className="space-y-2">
          <h3 className={`text-xl font-black uppercase tracking-tight text-white`}>Archival Database Empty</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-[200px] mx-auto leading-relaxed">
            No historical inference signatures found. Begin data ingestion to populate archives.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className={`text-sm font-black uppercase tracking-widest text-white`}>Archived Inference Logs</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-lg bg-slate-950 border-slate-800 text-slate-500`}>
            {history.length} Ingest Sessions
          </div>
        </div>
      </div>

      {/* Modernized Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentRecords.map((record, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] -m-0.5`} />

            <div className={`relative border p-6 rounded-[32px] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 bg-slate-950/60 border-slate-800/60 group-hover:border-indigo-500/30`}>
              <div className="space-y-5">
                {/* Meta Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all outline outline-indigo-500/0 outline-offset-4 group-hover:outline-indigo-500/20 bg-slate-900 border-slate-800 group-hover:bg-indigo-500/5`}>
                      <HardDrive size={18} className="text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h5 className={`text-[13px] font-black uppercase tracking-tight truncate max-w-[120px] text-white`}>
                        {record.filename || 'Stream_Frame'}
                      </h5>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                        {record.id ? `SIG: ${record.id.substring(0, 8)}` : 'SIG: RECOVERY'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-700 hover:text-indigo-500 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Core Metrics */}
                <div className={`grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50`}>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence Peak</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-black tracking-tighter ${getConfidenceColor(record.detections?.[0]?.confidence || 0.8)}`}>
                        {Math.round((record.detections?.[0]?.confidence || 0.8) * 100)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Object Count</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-black tracking-tighter text-white`}>{record.total_objects || 0}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Units</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Detections */}
                {Array.isArray(record.detections) && record.detections.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {record.detections.slice(0, 2).map((det, didx) => (
                      <div key={didx} className={`px-3 py-1 border rounded-full flex items-center gap-2 bg-slate-900/50 border-slate-800`}>
                        <div className={`w-1 h-1 rounded-full ${getConfidenceColor(det.confidence).replace('text-', 'bg-')}`} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{det.object}</span>
                      </div>
                    ))}
                    {record.detections.length > 2 && (
                      <div className={`px-3 py-1 rounded-full bg-slate-900/50`}>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">+{record.detections.length - 2} More</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Temporal Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00 UTC'}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-all">
                    View Matrix
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Action */}
      {history.length > 15 && (
        <div className="flex justify-center pt-8">
          <button className={`flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl transition-all border bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500`}>
            <span className="text-[10px] font-black uppercase tracking-widest">Request Extended Logs</span>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center border-slate-800`}>
              <ChevronRight size={12} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
