import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Activity, Zap, ShieldCheck } from 'lucide-react';

const AnalyticsDashboard = ({ history = [] }) => {
  const { theme } = useTheme();

  const objectFrequency = useMemo(() => {
    const counts = {};
    history.forEach((record) => {
      record.detections?.forEach((det) => {
        counts[det.object] = (counts[det.object] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const radarData = useMemo(() => {
    // Top 6 objects for the radar
    return objectFrequency.slice(0, 6);
  }, [objectFrequency]);

  const confidenceTrend = useMemo(() => {
    return history.slice(-20).map((record, index) => ({
      index: index + 1,
      confidence: (record.detections?.[0]?.confidence || 0.8) * 100,
      objects: record.total_objects || 0
    }));
  }, [history]);

  const COLORS = theme === 'cyber' ? ['#6366f1', '#10b981', '#22d3ee', '#f59e0b', '#ef4444', '#ec4899'] : ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${theme === 'cyber' ? 'bg-slate-950/80 border-indigo-500/30' : 'bg-slate-900 border-slate-800'
          }`}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{payload[0].name || 'Metric'}</p>
          <p className="text-xl font-black text-white tracking-tighter mt-1">
            {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Radar Chart: Object Frequency Radar */}
      <div className={`p-8 rounded-[40px] border flex flex-col items-center ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-slate-950/40 border-slate-800/60'
        }`}>
        <div className="flex items-center gap-2 mb-8 self-start">
          <Zap size={16} className="text-indigo-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Object Frequency Radar</span>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke={theme === 'cyber' ? '#1e293b' : '#334155'} />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
              <Radar
                name="Frequency"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Confidence Matrix */}
      <div className={`p-8 rounded-[40px] border ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-slate-950/40 border-slate-800/60'
        }`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Flow Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black text-emerald-400 uppercase">Stable</span>
          </div>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceTrend}>
              <defs>
                <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'cyber' ? '#1e293b' : '#334155'} />
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorConf)"
              />
              <Area
                type="monotone"
                dataKey="objects"
                stroke="#10b981"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Entity Distribution */}
      <div className={`p-8 rounded-[40px] border col-span-1 md:col-span-2 ${theme === 'cyber' ? 'bg-slate-950/40 border-indigo-500/10' : 'bg-slate-950/40 border-slate-800/60'
        }`}>
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck size={16} className="text-indigo-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Entity Distribution</span>
        </div>
        <div className="w-full h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={objectFrequency}
                innerRadius={40}
                outerRadius={60}
                paddingAngle={8}
                dataKey="value"
              >
                {objectFrequency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
