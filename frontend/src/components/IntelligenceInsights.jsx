import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, AlertTriangle, TrendingUp, Info, Activity, Fingerprint } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const IntelligenceInsights = ({ detections = [] }) => {
    const { theme } = useTheme();

    const insights = [
        {
            type: 'risk',
            label: 'High-Frequency Anomaly',
            value: 'Detected in Sector-7',
            desc: 'Unusual density of "Unknown" objects detected in the last session. Potential sensor interference or high-risk intrusion.',
            icon: ShieldAlert,
            color: 'text-red-500',
            bg: 'bg-red-500/10'
        },
        {
            type: 'stability',
            label: 'Model Confidence Drift',
            value: '-4.2%',
            desc: 'Inference precision dropped slightly. Recommend recalibrating the neural weights for low-light conditions.',
            icon: TrendingUp,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            type: 'recommendation',
            label: 'Optimized Ingestion',
            value: 'Active',
            desc: 'System suggests switching to 60 FPS stream for the next 15 minutes to capture high-velocity movement.',
            icon: Zap,
            color: 'text-indigo-400',
            bg: 'bg-indigo-400/10'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Risk Assessment Header */}
            <div className={`p-8 rounded-[40px] border relative overflow-hidden bg-slate-900/60 border-indigo-500/20`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Fingerprint size={120} className="text-indigo-500" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Critical Alert Engine</span>
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter">System Intelligence Signature</h3>
                        <p className="text-slate-500 text-sm font-medium">Automated analysis of current detection telemetry across all nodes.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-4 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-w-[120px]">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Risk Score</span>
                            <span className="text-2xl font-black text-emerald-500 tracking-tighter">0.12</span>
                        </div>
                        <div className="px-6 py-4 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-w-[120px]">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Threat Level</span>
                            <span className="text-2xl font-black text-white tracking-tighter">LOW</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {insights.map((insight, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-[32px] border group transition-all duration-500 bg-slate-950/40 border-indigo-500/10 hover:border-indigo-500/40`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${insight.bg} ${insight.color}`}>
                                <insight.icon size={24} />
                            </div>
                            <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Activity size={14} className="text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-indigo-500/20 underline-offset-4">{insight.label}</p>
                            <h4 className="text-xl font-black text-white tracking-tighter">{insight.value}</h4>
                        </div>

                        <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed">
                            {insight.desc}
                        </p>

                        <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                            <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Acknowledge</button>
                            <Info size={14} className="text-slate-700" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Summary Section */}
            <div className={`p-8 rounded-[40px] border border-dashed text-center space-y-4 bg-indigo-500/5 border-indigo-500/20`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 mb-2">
                    <Zap size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Intelligence Summary</span>
                </div>
                <p className="text-xl font-medium text-slate-300 italic max-w-3xl mx-auto leading-relaxed underline decoration-slate-800 underline-offset-8">
                    "The tactical environment remains stable with a baseline detection rate of 12 units/sec. All security protocols are optimal, though neural drift in Sector-7 warrants periodic verification."
                </p>
                <div className="pt-4 flex items-center justify-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                                <User size={12} className="text-slate-500" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Verified by Agent Cluster</span>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceInsights;

const User = ({ size, className }) => (
    <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
