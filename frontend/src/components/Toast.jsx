import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toasts, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-100';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-100';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-100';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 400 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md pointer-events-auto ${getColors(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-auto hover:opacity-75 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default Toast;
