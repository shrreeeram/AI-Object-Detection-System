import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Search,
  Bell,
  Settings,
  Activity,
  Shield,
  Cpu,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  List,
  AlertCircle,
  Command,
  Plus,
  Terminal,
  Activity as ActivityIcon,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import UploadPanel from './components/UploadPanel';
import DetectionResults from './components/DetectionResults';
import HistoryPanel from './components/HistoryPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import GlobalStatusBar from './components/GlobalStatusBar';
import CommandPalette from './components/CommandPalette';
import IntelligenceInsights from './components/IntelligenceInsights';
import SecurityControl from './components/SecurityControl';
import Toast from './components/Toast';
import useToast from './hooks/useToast';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const [file, setFile] = useState(null);
  const [confidence, setConfidence] = useState(0.25);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const { toasts, showToast, removeToast } = useToast();
  const logoutTimerRef = useRef(null);

  // Auto-logout security logic (30 mins)
  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      showToast('Session expired for security', 'info');
      logout();
      navigate('/auth');
    }, 30 * 60 * 1000);
  }, [logout, navigate, showToast]);

  useEffect(() => {
    window.addEventListener('mousemove', resetLogoutTimer);
    window.addEventListener('keydown', resetLogoutTimer);
    resetLogoutTimer();
    return () => {
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keydown', resetLogoutTimer);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [resetLogoutTimer]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const response = await api.get('/history');
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        // Silently fallback
      } finally {
        setTimeout(() => setIsInitializing(false), 1200);
      }
    };
    initializeApp();
  }, []);

  const handleDetect = useCallback(async () => {
    if (!file) {
      showToast('Select image stream source', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence', confidence);

    setIsLoading(true);

    try {
      const response = await api.post('/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      setHistory((prev) => [...prev, response.data]);
      showToast(`Inference successful: ${response.data.total_objects} objects found`, 'success');
      setActiveTab('upload');
    } catch (err) {
      if (err.response?.status === 401) {
        showToast('Unauthorized session access', 'error');
        logout();
        navigate('/auth');
      } else {
        showToast(err.response?.data?.detail || 'Neural inference engine error', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [file, confidence, showToast, logout, navigate]);

  const statsData = useMemo(() => {
    const safeHistory = Array.isArray(history) ? history : [];
    const totalDetections = safeHistory.reduce((sum, r) => sum + (r.total_objects || 0), 0);
    const avgConfidence = safeHistory.length > 0
      ? (safeHistory.reduce((sum, r) => sum + (r.detections?.[0]?.confidence || 0.8), 0) / safeHistory.length).toFixed(4)
      : 0;
    return { totalDetections, avgConfidence };
  }, [history]);

  if (isInitializing) {
    return (
      <div className={`w-full h-screen flex flex-col items-center justify-center transition-colors duration-1000 ${theme === 'cyber' ? 'bg-[#010409]' : 'bg-slate-950'
        }`}>
        <div className="flex flex-col items-center gap-12">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className={`w-32 h-32 border-2 rounded-[40px] ${theme === 'cyber' ? 'border-indigo-500/10 border-t-indigo-500' : 'border-slate-800 border-t-indigo-500'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Terminal className="text-indigo-500 w-10 h-10 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className={`text-3xl font-black uppercase tracking-[0.8em] text-white neon-text`}>VisionGuard</h1>
            <div className="h-1 w-48 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2 }}
                className="h-full bg-indigo-500"
              />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initializing Tactical Intelligence Engine</p>
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Analytic Events', value: statsData.totalDetections, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Avg Confidence', value: `${(statsData.avgConfidence * 100).toFixed(1)}%`, icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Latency Pulse', value: '42ms', icon: Cpu, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Node Resilience', value: 'Optimal', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className={`flex flex-col h-screen font-sans selection:bg-indigo-500/40 selection:text-white overflow-hidden transition-colors duration-700 bg-[#020617] text-slate-200`}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          username={user?.username}
          onLogout={() => { logout(); navigate('/auth'); }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Main Action Bar */}
          <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-3xl ${theme === 'cyber' ? 'border-indigo-500/20 bg-slate-950/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' :
            'border-slate-800/50 bg-slate-950/20'
            }`}>
            <div className="flex items-center gap-8 flex-1">
              <div
                className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-2.5 rounded-2xl group hover:border-indigo-500/60 transition-all cursor-pointer shadow-lg active:scale-95"
                onClick={() => setIsPaletteOpen(true)}
              >
                <div className="bg-indigo-600/10 p-1.5 rounded-lg border border-indigo-500/20 shadow-inner">
                  <Command size={14} className="text-indigo-400" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden lg:inline">Directive Terminal</span>
                <div className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-600 font-black tracking-widest">CTRL+K</div>
              </div>

              <div className="hidden xl:flex items-center gap-6 text-slate-500 font-black uppercase tracking-[0.2em] text-[9px]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Inference Active</span>
                </div>
                <div className="h-4 w-px bg-slate-800/50" />
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-indigo-500" />
                  <span>Clearance S-Tier</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className={`p-3 rounded-2xl transition-all relative group ${theme === 'cyber' ? 'text-indigo-400 hover:bg-indigo-500/10' :
                'text-slate-500 hover:bg-slate-100'
                }`}>
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </button>

              <div className={`h-10 w-px ${theme === 'dark' || theme === 'cyber' ? 'bg-slate-800/50' : 'bg-slate-200'}`} />

              <div className={`flex items-center gap-3 p-1.5 rounded-2xl pl-4 border group transition-all cursor-help ${theme === 'cyber' ? 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40' :
                'bg-slate-900/40 border-slate-800/50 hover:border-indigo-500/30'
                }`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cluster</span>
                <div className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">STATION-ALPHA</div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar scroll-smooth">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-12"
                >
                  {/* Dashboard Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-[20px] border border-indigo-500/30 flex items-center justify-center shadow-inner">
                          <LayoutDashboard className="text-indigo-500 shadow-indigo-500/20" size={24} />
                        </div>
                        <div>
                          <h2 className={`text-5xl font-black tracking-tighter text-white`}>Control Deck</h2>
                          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                            VisionGuard Enterprise <span className="w-1 h-1 rounded-full bg-slate-800" /> v8.2.0-STABLE
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${theme === 'cyber' ? 'bg-slate-950 border-indigo-500/20 text-indigo-100 hover:bg-slate-900 hover:border-indigo-500/40 shadow-xl' :
                        'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                        }`}>Sync Archives</button>
                      <button onClick={() => setActiveTab('upload')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                        <Plus size={18} className="stroke-[3]" />
                        Initiate Sequence
                      </button>
                    </div>
                  </div>

                  {/* High-Fidelity Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {kpiCards.map((card, i) => (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-8 rounded-[40px] border group relative transition-all duration-700 overflow-hidden ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10 hover:border-indigo-500/40 shadow-2xl' :
                          'bg-slate-900/40 border-slate-800/50 hover:border-indigo-500/20 shadow-xl'
                          }`}
                      >
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className={`p-4 rounded-[24px] ${card.bg} ${card.color} transition-transform group-hover:scale-110 duration-700 shadow-inner`}>
                            <card.icon size={28} />
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3].map(x => <div key={x} className={`w-1 h-4 rounded-full transition-all duration-500 ${theme === 'cyber' ? 'bg-indigo-500/10 group-hover:bg-indigo-500' : 'bg-slate-100 group-hover:bg-indigo-600'}`} style={{ transitionDelay: `${x * 0.1}s` }} />)}
                          </div>
                        </div>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] relative z-10">{card.label}</p>
                        <p className={`text-5xl font-black mt-2 tracking-tighter tabular-nums relative z-10 text-white`}>{card.value}</p>

                        <div className="mt-8 relative z-10">
                          <div className="w-full h-1 bg-slate-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '82%' }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className={`h-full ${theme === 'cyber' ? 'bg-indigo-400 cyber-glow' : 'bg-indigo-600'}`}
                            />
                          </div>
                          <div className="flex justify-between mt-3">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Dynamic Load</span>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Optimized</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-10">
                      {/* Intelligence Widget (Analytics Dashboard) */}
                      <div className={`border rounded-[50px] p-10 min-h-[580px] flex flex-col relative overflow-hidden group/chart ${theme === 'cyber' ? 'bg-slate-950/60 border-indigo-500/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]' :
                        'bg-slate-900/60 border-slate-800/50 shadow-2xl'
                        }`}>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -mr-80 -mt-80 pointer-events-none" />
                        <div className="flex items-center justify-between mb-12 relative z-10">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="text-indigo-400 shadow-glow" size={18} />
                              <h3 className={`text-3xl font-black tracking-tighter text-white`}>Intelligence Matrix</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] pl-7">Advanced Neural Telemetry Streams</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2.5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${theme === 'cyber' ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20' : 'text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/5'
                              }`}>Full Reports</button>
                            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                              <ActivityIcon size={18} className="text-indigo-500" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden relative z-10 no-scrollbar">
                          <AnalyticsDashboard history={history} />
                        </div>
                      </div>

                      {/* AI Intelligence Insights (The New Section) */}
                      <IntelligenceInsights detections={result?.detections} />
                    </div>

                    <div className="space-y-10">
                      {/* Operational Status (Heartbeat) */}
                      <div className={`border rounded-[50px] p-10 relative overflow-hidden group ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10 shadow-2xl' :
                        'bg-slate-900/40 border-slate-800/50 shadow-2xl'
                        }`}>
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/5 blur-[80px] pointer-events-none" />
                        <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-4">
                            <Terminal className="text-indigo-500" size={20} />
                            <h4 className={`text-sm font-black uppercase tracking-[0.3em] ${theme === 'dark' || theme === 'cyber' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                              Neural Pulse
                            </h4>
                          </div>
                          <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                          </div>
                        </div>
                        <div className="space-y-8">
                          {[
                            { label: 'Ingest Engine v8', status: 'LOCKED', load: '14%', color: 'bg-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]' },
                            { label: 'Cluster Bandwidth', status: 'ACTIVE', load: '92%', color: 'bg-cyan-500', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' },
                            { label: 'AI Inference Node', status: 'OPTIMAL', load: '28ms', color: 'bg-indigo-500', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]' },
                            { label: 'Database Flux', status: 'SYNCED', load: '0.4 GB', color: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]' }
                          ].map((node) => (
                            <div key={node.label} className={`p-6 rounded-[32px] border transition-all duration-500 hover:-translate-y-1.5 ${theme === 'dark' || theme === 'cyber' ? 'bg-slate-900/50 border-slate-800/50 hover:border-indigo-500/40 hover:bg-slate-900/80 shadow-inner' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                              }`}>
                              <div className="flex items-center justify-between mb-4">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' || theme === 'cyber' ? 'text-slate-400' : 'text-slate-500'}`}>{node.label}</span>
                                <span className="text-[9px] font-black tabular-nums text-indigo-400">{node.load}</span>
                              </div>
                              <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' || theme === 'cyber' ? 'bg-slate-950' : 'bg-slate-200'}`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: node.load.includes('%') ? node.load : '100%' }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`h-full ${node.color} ${node.glow}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* History Quick View */}
                      <div className={`border rounded-[50px] p-10 ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' :
                        'bg-slate-900/40 border-slate-800/50 shadow-2xl'
                        }`}>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-600/30">
                              <List size={22} className="text-white" />
                            </div>
                            <h3 className={`text-xl font-black uppercase tracking-tight text-white`}>Recent Logs</h3>
                          </div>
                        </div>
                        <HistoryPanel history={history.slice(-3)} />
                        <button onClick={() => setActiveTab('history')} className="w-full mt-8 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:border-indigo-500/40 transition-all">Archival Sovereignty Access</button>
                      </div>

                      {/* Floating Security Banner */}
                      <div className={`border rounded-[50px] p-10 overflow-hidden relative group cursor-pointer ${theme === 'cyber' ? 'bg-indigo-600 border-indigo-500 shadow-[0_25px_50px_rgba(79,70,229,0.4)]' :
                        'bg-slate-950 border-slate-800 shadow-2xl'
                        }`} onClick={() => setActiveTab('security')}>
                        <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" style={{
                          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                          backgroundSize: '16px 16px'
                        }} />
                        <div className="relative z-10 flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-[360deg] duration-1000 ${theme === 'cyber' ? 'bg-white shadow-white/20' : 'bg-indigo-600 shadow-indigo-600/30'
                            }`}>
                            <Shield size={28} className={theme === 'cyber' ? 'text-indigo-600' : 'text-white'} />
                          </div>
                          <div>
                            <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${theme === 'cyber' ? 'text-indigo-200' : 'text-slate-500'}`}>Security Gateway</p>
                            <p className={`text-2xl font-black mt-1 tracking-tighter ${theme === 'cyber' ? 'text-white' : 'text-white'}`}>Military-Grade Enc-V2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                  <div className="xl:col-span-2">
                    <UploadPanel
                      onFileSelect={setFile}
                      confidence={confidence}
                      onConfidenceChange={setConfidence}
                      onDetect={handleDetect}
                      isLoading={isLoading}
                      detections={result?.detections}
                    />
                  </div>
                  <div className="xl:col-span-3">
                    <DetectionResults result={result} isLoading={isLoading} />
                  </div>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <div className="mb-14 px-2">
                    <h2 className={`text-6xl font-black tracking-tighter text-white`}>Global Intelligence</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.8em] mt-4 ml-1 pl-4 border-l-4 border-indigo-600">Archival Verification Data Matrix</p>
                  </div>
                  <AnalyticsDashboard history={history} />
                </motion.div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                  <div className="mb-14 px-2">
                    <h2 className={`text-6xl font-black tracking-tighter ${theme === 'dark' || theme === 'cyber' ? 'text-white' : 'text-slate-900'}`}>Archival Trajectory</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.8em] mt-4 ml-1 pl-4 border-l-4 border-indigo-600">Historical Ingest & Retrieval Protocols</p>
                  </div>
                  <HistoryPanel history={history} />
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
                  <div className="mb-14 px-2">
                    <h2 className={`text-6xl font-black tracking-tighter ${theme === 'dark' || theme === 'cyber' ? 'text-white' : 'text-slate-900'}`}>Governance</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.8em] mt-4 ml-1 pl-4 border-l-4 border-indigo-600">Access Management & Authentication Audit</p>
                  </div>
                  <SecurityControl />
                </motion.div>
              )}

              {/* Other States */}
              {(activeTab === 'settings' || activeTab === 'help') && (
                <motion.div key="coming-soon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
                  <div className={`w-40 h-40 rounded-[60px] flex items-center justify-center border shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-1000 ${theme === 'cyber' ? 'bg-slate-950 border-indigo-500/40 text-indigo-500' : 'bg-white border-slate-100 text-slate-200'
                    }`}>
                    <Settings className="animate-spin-slow" size={72} />
                  </div>
                  <div className="space-y-4">
                    <h2 className={`text-4xl font-black uppercase tracking-tighter ${theme === 'dark' || theme === 'cyber' ? 'text-white' : 'text-slate-900'}`}>Subsystem Deployment</h2>
                    <p className="text-slate-500 max-w-lg mx-auto text-base font-medium leading-relaxed italic underline decoration-slate-800 underline-offset-8 decoration-2">Tactical synchronization in progress. Global availability scheduled for Q3-ALPHA release.</p>
                  </div>
                  <button onClick={() => setActiveTab('dashboard')} className="px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-all hover:-translate-y-2 active:scale-95">Return to Command Center</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <GlobalStatusBar />
        </main>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
        onNavigate={setActiveTab}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
