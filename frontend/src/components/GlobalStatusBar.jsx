import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Zap, Globe, Clock, ShieldCheck, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GlobalStatusBar = ({ modelHealth = {}, systemMetrics = {} }) => {
    const { theme } = useTheme();
    const [uptime, setUptime] = useState('00:00:00');

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const diff = Date.now() - start;
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
            setUptime(`${h}:${m}:${s}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const metrics = [
        { label: 'Model Core', value: 'YOLOv8-Ent', icon: Database, color: 'text-indigo-400' },
        { label: 'Avg Confidence', value: '0.942', icon: Zap, color: 'text-emerald-400' },
        { label: 'Latency Pulse', value: '28ms', icon: Activity, color: 'text-cyan-400' },
        { label: 'Memory Load', value: '0.42 GB', icon: Cpu, color: 'text-amber-400' },
        { label: 'Ingest Rate', value: '30 FPS', icon: Globe, color: 'text-blue-400' },
    ];

    return (
        <footer className={`h-12 border-t px-6 flex items-center justify-between z-50 transition-all duration-500 overflow-hidden ${theme === 'cyber' ? 'bg-slate-950 border-indigo-500/20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100'
            }`}>
            {/* Left: System Status */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'cyber' ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme === 'cyber' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        System Stream Locked
                    </span>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-500" />
                    <span className="text-[9px] font-bold tabular-nums text-slate-500 uppercase tracking-widest">
                        Uptime {uptime}
                    </span>
                </div>
            </div>

            {/* Center: Live Metrics */}
            <div className="hidden lg:flex items-center gap-8">
                {metrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <m.icon size={12} className="text-slate-600" />
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{m.label}:</span>
                        <span className={`text-[10px] font-black tabular-nums tracking-tighter ${m.color}`}>{m.value}</span>
                    </div>
                ))}
            </div>

            {/* Right: Health Badge */}
            <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${theme === 'cyber' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'cyber' ? 'text-indigo-100' : 'text-slate-600'}`}>
                        Node-01 Verified
                    </span>
                </div>
                <div className={`text-[8px] font-black uppercase tracking-[0.3em] ${theme === 'cyber' ? 'text-slate-500' : 'text-slate-300'}`}>
                    Visual Engineering Unit
                </div>
            </div>
        </footer>
    );
};

export default GlobalStatusBar;
