import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    MapPin,
    Smartphone,
    Monitor,
    Clock,
    Key,
    Fingerprint,
    Activity,
    Lock,
    Search,
    ChevronRight,
    UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SecurityControl = () => {
    const { theme } = useTheme();

    const activeSessions = [
        { id: 'sess-01', user: 'Root Admin', device: 'Terminal Console', ip: '192.168.1.104', location: 'Primary Node', status: 'Active' },
        { id: 'sess-02', user: 'Lead Analyst', device: 'Mobile Unit S-9', ip: '10.0.42.12', location: 'Remote-04', status: 'Idle' },
    ];

    const auditLogs = [
        { time: '14:22:01', event: 'Neural Calibration Override', user: 'Root Admin', level: 'Warning' },
        { time: '14:15:44', event: 'Sector-7 Access Granted', user: 'Lead Analyst', level: 'Info' },
        { time: '13:58:22', event: 'Global Purge Request Rejected', user: 'Analyst-22', level: 'Critical' },
        { time: '13:42:10', event: 'API Key Rotation Triggered', user: 'System', level: 'Info' },
    ];

    const getLevelColor = (level) => {
        if (level === 'Critical') return 'text-red-500';
        if (level === 'Warning') return 'text-amber-500';
        return 'text-indigo-400';
    };

    return (
        <div className="space-y-10">
            {/* Security Header Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 p-8 rounded-[40px] border flex flex-col justify-between overflow-hidden relative ${theme === 'cyber' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-950 border-slate-800'
                    }`}>
                    <div className="absolute right-0 bottom-0 p-8 opacity-10 pointer-events-none">
                        <ShieldCheck size={180} className="text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                <Lock className="text-white" size={20} />
                            </div>
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Protocol Architecture</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter">Security Governance Hub</h2>
                        <p className="text-white/60 mt-2 text-sm font-medium max-w-lg leading-relaxed">System-wide monitoring of access vectors, credential cycling, and multi-factor authentication statuses.</p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-4 mt-12">
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">SSL Validated</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <UserCheck className="text-white" size={16} />
                            <span className="text-xs font-black text-white uppercase tracking-widest">RBAC Active</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <Fingerprint className="text-white" size={16} />
                            <span className="text-xs font-black text-white uppercase tracking-widest">MFA Required</span>
                        </div>
                    </div>
                </div>

                <div className={`p-8 rounded-[40px] border flex flex-col items-center justify-center text-center space-y-6 ${theme === 'cyber' ? 'bg-slate-900 border-indigo-500/20' : 'bg-slate-900 border-slate-800'
                    }`}>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                            <Activity className="text-indigo-500 w-10 h-10 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin-slow" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Token Integrity</p>
                        <h4 className="text-2xl font-black text-white tracking-tighter tabular-nums">14:55:02</h4>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">Force Rotate Enabled</p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95">Purge All Active Sessions</button>
                </div>
            </div>

            {/* Sessions and Audit Logs */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Active Sessions */}
                <div className={`p-8 rounded-[40px] border ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Active Surveillance Sessions</h4>
                        <span className="text-[10px] font-black text-indigo-500 uppercase px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">02 Managed Units</span>
                    </div>

                    <div className="space-y-4">
                        {activeSessions.map((session) => (
                            <div key={session.id} className={`p-6 rounded-[28px] border transition-all hover:border-indigo-500/30 group ${theme === 'cyber' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-slate-950/60 border-slate-800'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme === 'cyber' ? 'bg-slate-950 border-indigo-500/20' : 'bg-slate-800 border-slate-700'
                                            }`}>
                                            {session.device.includes('Mobile') ? <Smartphone size={20} className="text-slate-500" /> : <Monitor size={20} className="text-slate-500" />}
                                        </div>
                                        <div>
                                            <h5 className="text-[13px] font-black text-white uppercase tracking-tight">{session.user}</h5>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={10} className="text-slate-600" />
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{session.location}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-800" />
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest tabular-nums">{session.ip}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${session.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'
                                            }`}>{session.status}</span>
                                        <button className="p-1.5 text-slate-700 hover:text-red-500 transition-colors">
                                            <Clock size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Logs */}
                <div className={`p-8 rounded-[40px] border ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-slate-900/50 border-slate-800'
                    }`}>
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Security Audit Trajectory</h4>
                        <Search className="text-slate-600" size={18} />
                    </div>

                    <div className="space-y-4">
                        {auditLogs.map((log, idx) => (
                            <div key={idx} className={`p-5 rounded-[24px] border border-transparent transition-all hover:bg-slate-900/60 hover:border-slate-800 flex items-center justify-between group`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black tabular-nums text-slate-600 border-r border-slate-800 pr-4">{log.time}</span>
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight">{log.event}</p>
                                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">{log.user}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${getLevelColor(log.level)}`}>{log.level}</span>
                                    <ChevronRight size={14} className="text-slate-800 group-hover:text-slate-500" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 border border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-700 hover:text-slate-300 transition-all">Download Full Audit History</button>
                </div>
            </div>
        </div>
    );
};

export default SecurityControl;
