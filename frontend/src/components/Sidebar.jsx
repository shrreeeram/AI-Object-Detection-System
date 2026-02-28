import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Zap,
    BarChart3,
    History,
    Settings,
    HelpCircle,
    Menu,
    ChevronLeft,
    LogOut,
    Eye,
    User,
    Sun,
    Moon,
    Shield,
    Terminal,
    Command
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ username, onLogout, activeTab, setActiveTab }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'dashboard', label: 'Command Deck', icon: LayoutDashboard },
        { id: 'upload', label: 'Neural Engine', icon: Zap },
        { id: 'analytics', label: 'Intelligence Matrix', icon: BarChart3 },
        { id: 'history', label: 'Archival Logs', icon: History },
    ];

    const bottomItems = [
        { id: 'security', label: 'Security Portal', icon: Shield },
        { id: 'settings', label: 'System Config', icon: Settings },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? '80px' : '280px' }}
            className={`h-screen border-r flex flex-col sticky top-0 z-50 transition-all duration-500 ease-in-out ${theme === 'cyber'
                ? 'bg-slate-950/80 backdrop-blur-3xl border-indigo-500/20 shadow-[10px_0_30px_rgba(0,0,0,0.4)]'
                : 'bg-slate-950/50 backdrop-blur-xl border-slate-800/50'
                }`}
        >
            {/* Brand Header */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className={`p-2 rounded-xl shadow-lg transition-all ${theme === 'cyber' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-indigo-600 shadow-indigo-500/10'
                            }`}>
                            <Eye className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-black tracking-tighter leading-none text-white`}>VisionGuard AI</h1>
                            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Tactical Object Intel</p>
                        </div>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`p-2 rounded-xl transition-colors hover:bg-slate-800/50 text-slate-400`}
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${activeTab === item.id
                            ? (theme === 'cyber' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20')
                            : `hover:bg-indigo-50/5 text-slate-500 hover:text-slate-300`
                            }`}
                    >
                        <item.icon size={22} className={activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-indigo-500'} />
                        {!isCollapsed && (
                            <span className="text-[11px] font-black tracking-widest uppercase whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                        {!isCollapsed && activeTab === item.id && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute left-0 w-1 h-6 rounded-r-full ${theme === 'cyber' ? 'bg-indigo-400 cyber-glow' : 'bg-indigo-600'}`}
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className={`px-4 py-6 border-t font-black space-y-2 border-slate-800/50`}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-900 hover:text-yellow-400`}
                >
                    {theme === 'light' ? <Moon size={20} /> : theme === 'dark' ? <Menu size={20} /> : <Sun size={20} />}
                    {!isCollapsed && (
                        <span className="text-[10px] uppercase tracking-widest">
                            {theme === 'dark' ? 'Cyber Mode' : 'Dark Mode'}
                        </span>
                    )}
                </button>

                {bottomItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === item.id
                            ? 'bg-slate-800 text-white'
                            : `text-slate-500 hover:text-slate-300 hover:bg-slate-900`
                            }`}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span className="text-[10px] uppercase tracking-widest">{item.label}</span>}
                    </button>
                ))}

                <div className="pt-6">
                    {!isCollapsed ? (
                        <div className={`rounded-[24px] p-4 border transition-all ${theme === 'cyber' ? 'bg-slate-900/40 border-indigo-500/20 shadow-inner' :
                            'bg-slate-900/50 border-slate-800/50'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-slate-800 border-slate-700`}>
                                    <User className="text-slate-400" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-xs font-black truncate uppercase tracking-tighter text-white`}>
                                        {username || 'Root Admin'}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Operator-01</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className={`w-full border py-3 rounded-xl transition-all flex items-center justify-center gap-2 group bg-slate-950 border-slate-800 hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400 text-slate-500`}
                            >
                                <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Terminate Session</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center p-3 text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between group cursor-help transition-colors hover:border-indigo-500/30">
                        <div className="flex items-center gap-2">
                            <Command size={12} className="text-slate-600 group-hover:text-indigo-400" />
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Directives</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700 group-hover:text-slate-500">Ctrl+K</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Sidebar;
