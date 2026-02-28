import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Sparkles, AlertCircle, BarChart, ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DetectionResults = ({ result, isLoading }) => {
  const { theme } = useTheme();
  const detections = result?.detections || [];
  const totalObjects = result?.total_objects ?? 0;

  const highestConfidence = useMemo(() => {
    if (!detections || detections.length === 0) return null;
    return detections.reduce((max, curr) =>
      curr.confidence > (max?.confidence || 0) ? curr : max
    );
  }, [detections]);

  const statsData = useMemo(() => {
    const stats = {};
    detections.forEach((det) => {
      const name = det.object || 'Unknown';
      stats[name] = (stats[name] || 0) + 1;
    });
    return Object.entries(stats);
  }, [detections]);

  const getConfidenceLevel = (conf) => {
    if (conf > 0.75) return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'High Confidence', bar: 'bg-emerald-500' };
    if (conf >= 0.5) return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Stable Match', bar: 'bg-yellow-500' };
    return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Low Precision', bar: 'bg-red-500' };
  };

  if (!result && !isLoading) {
    return (
      <div className="border rounded-[32px] p-12 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center h-full min-h-[500px] relative overflow-hidden transition-colors bg-slate-900/40 border-slate-800/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full bg-indigo-500/5" />
        <div className="relative space-y-6 text-center max-w-sm">
          <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl border bg-slate-950 border-slate-800">
            <Activity className="text-slate-700 w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">System Operational</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed font-medium">
              Awaiting localized image stream for real-time meta-analysis and object classification.
            </p>
          </div>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-slate-950 border-slate-800 text-slate-500">
              <ShieldCheck size={14} className="text-indigo-500" />
              Engine Awaiting Data
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border rounded-[32px] p-12 flex flex-col items-center justify-center h-full min-h-[500px] bg-slate-900/40 border-slate-800/60">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Processing Stream Ingest...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Result Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border p-6 rounded-3xl relative overflow-hidden group bg-slate-900/40 border-slate-800/60"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inference Yield</p>
              <h4 className="text-4xl font-black mt-1 uppercase tracking-tight text-white">
                {totalObjects} Entities
              </h4>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <BarChart className="text-indigo-400" size={24} />
            </div>
          </div>
        </motion.div>

        {highestConfidence && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border p-6 rounded-3xl relative overflow-hidden group bg-slate-900/40 border-slate-800/60"
          >
            {(() => {
              const level = getConfidenceLevel(highestConfidence.confidence);
              return (
                <>
                  <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl group-hover:opacity-30 transition-all ${level.bg}`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Peak Confidence</p>
                      <h4 className="text-2xl font-black mt-1 uppercase tracking-tight truncate max-w-[150px] text-white">
                        {highestConfidence.object}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${level.bg.replace('/10', '')}`} />
                        <span className={`${level.color} text-[10px] font-bold uppercase tracking-widest`}>
                          {(highestConfidence.confidence * 100).toFixed(1)}% {level.label}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${level.bg} ${level.border}`}>
                      <Trophy className={level.color} size={24} />
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>

      {/* Detection Cards */}
      {detections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Zap className="text-indigo-500 fill-indigo-500" size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Inference Roster</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter px-3 py-1 border rounded-lg bg-slate-950 border-slate-800 text-slate-500">
              {detections.length} Classified Elements
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {detections.map((detection, idx) => {
              const level = getConfidenceLevel(detection.confidence);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-[1px] rounded-[24px] transition-all duration-300 ${detection === highestConfidence
                    ? 'bg-gradient-to-r from-indigo-500 via-transparent to-transparent'
                    : 'bg-slate-800'
                    }`}
                >
                  <div className="rounded-[23px] p-5 flex items-center gap-6 bg-slate-950/80">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${detection === highestConfidence ? 'scale-110 shadow-lg' : ''} bg-slate-900 border-slate-800`}>
                      <Sparkles className={level.color} size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-lg font-black uppercase tracking-tight truncate text-white">
                          {detection.object}
                        </h5>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${level.bg} ${level.color} ${level.border}`}>
                          {level.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden border bg-slate-900 border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${detection.confidence * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${level.bar}`}
                          />
                        </div>
                        <span className={`text-xs font-black tabular-nums ${level.color}`}>
                          {(detection.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Summary Widget */}
      {statsData.length > 0 && (
        <div className="border rounded-3xl p-6 bg-slate-900/40 border-slate-800/60">
          <div className="flex items-center gap-2 mb-6">
            <BarChart className="text-slate-500" size={16} />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregated Distribution</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map(([name, count]) => (
              <div key={name} className="p-4 border rounded-2xl text-center group transition-all hover:border-indigo-500/30 bg-slate-950 border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{name}</p>
                <p className="text-2xl font-black group-hover:text-indigo-500 transition-colors uppercase text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalObjects === 0 && !isLoading && (
        <div className="py-20 border border-dashed rounded-[32px] text-center space-y-4 bg-slate-950/40 border-slate-800">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border bg-slate-900 border-slate-800 text-slate-700">
            <AlertCircle size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-300">Zero Records</h4>
            <p className="text-slate-500 text-sm max-w-[240px] mx-auto mt-1">
              Neural engine failed to resolve recognizable object signatures in ingest.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionResults;
