import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Shield, Settings, History, BarChart3, Terminal, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CommandPalette = ({ isOpen, setIsOpen, onNavigate }) => {
    const [query, setQuery] = useState('');
    const { theme } = useTheme();

    const commands = [
        { id: 'dashboard', label: 'Go to Control Center', icon: LayoutDashboard, category: 'Navigation' },
        { id: 'upload', label: 'Launch Detection Engine', icon: Zap, category: 'Navigation' },
        { id: 'analytics', label: 'View Intelligence Matrix', icon: BarChart3, category: 'Navigation' },
        { id: 'history', label: 'Access Archived Logs', icon: History, category: 'Navigation' },
        { id: 'settings', label: 'Terminal Configuration', icon: Settings, category: 'System' },
        { id: 'security', label: 'Security Portal', icon: Shield, category: 'System' },
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border ${theme === 'cyber' ? 'bg-slate-950 border-indigo-500/30' : 'bg-slate-900 border-slate-800'
                        }`}
                >
                    <div className="p-6 border-b border-slate-800/50 flex items-center gap-4">
                        <Search className="text-slate-500" size={24} />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type a command or search telemetry..."
                            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-white placeholder-slate-600"
                        />
                        <div className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            ESC
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-4 no-scrollbar">
                        {filteredCommands.length > 0 ? (
                            <div className="space-y-6">
                                {['Navigation', 'System'].map((cat) => (
                                    <div key={cat} className="space-y-2">
                                        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{cat}</p>
                                        {filteredCommands.filter(c => c.category === cat).map((cmd) => (
                                            <button
                                                key={cmd.id}
                                                onClick={() => {
                                                    onNavigate(cmd.id);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${theme === 'cyber' ? 'hover:bg-indigo-500/10 hover:border-indigo-500/30' : 'hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl border ${theme === 'cyber' ? 'bg-slate-900 border-indigo-500/20 group-hover:border-indigo-500' : 'bg-slate-950 border-slate-700'
                                                    }`}>
                                                    <cmd.icon size={18} className="text-slate-400 group-hover:text-white" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white uppercase tracking-tight">{cmd.label}</span>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Terminal size={14} className="text-indigo-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No matching system directives found</p>
                            </div>
                        )}
                    </div>

                    <div className={`p-4 border-t flex items-center justify-between ${theme === 'cyber' ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-slate-950 border-slate-800'}`}>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Navigate</span>
                                <div className="flex gap-1">
                                    <div className="w-5 h-5 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500">↑</div>
                                    <div className="w-5 h-5 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500">↓</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Execute</span>
                                <div className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[8px] text-slate-500">ENTER</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={12} className="text-indigo-500" />
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Admin Authorization Required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommandPalette;
