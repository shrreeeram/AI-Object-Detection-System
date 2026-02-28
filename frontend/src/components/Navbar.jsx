import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';

const Navbar = ({ username, onLogout }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/50">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">AI Detection</span>
              <span className="text-xs text-slate-400">Object Detection Platform</span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-slate-100">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
