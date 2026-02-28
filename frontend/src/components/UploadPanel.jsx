import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Zap, Loader2, Image as ImageIcon, Sliders, Info, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import BoundingBoxOverlay from './BoundingBoxOverlay';

const UploadPanel = ({ onFileSelect, confidence, onConfidenceChange, onDetect, isLoading, detections }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();
  const imgRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) return;
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  }, [onFileSelect]);

  const processFile = (file) => {
    onFileSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onFileSelect(null);
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgSize({ width: naturalWidth, height: naturalHeight });
  };

  return (
    <div className={`border rounded-[32px] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all duration-500 bg-slate-900/40 border-slate-800/60`}>
      {/* Decorative gradient background */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 rounded-full bg-indigo-500/10`} />

      <div className="relative space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className={`text-2xl font-black tracking-tight flex items-center gap-2 text-white`}>
              <Cpu className="text-indigo-500" size={24} />
              Inference Engine
            </h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              VisionGuard AI Core v8.2
            </p>
          </div>
          <div className={`p-2 rounded-xl border bg-slate-800/50 border-slate-700/50`}>
            <Info className="text-slate-400 hover:text-indigo-500 transition-colors cursor-help" size={16} />
          </div>
        </div>

        {/* Improved Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative h-80 border-2 border-dashed rounded-3xl transition-all duration-500 group/drop flex items-center justify-center overflow-hidden ${dragActive
            ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01]'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
            }`}
        >
          {!preview && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full h-full rounded-2xl overflow-hidden group/preview"
                >
                  <img
                    ref={imgRef}
                    src={preview}
                    alt="Preview"
                    onLoad={handleImageLoad}
                    className="w-full h-full object-contain rounded-2xl"
                  />

                  {/* Bounding Box Overlay */}
                  <BoundingBoxOverlay
                    detections={detections}
                    imageWidth={imgSize.width}
                    imageHeight={imgSize.height}
                  />

                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={handleClear}
                      className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto transition-all outline outline-offset-4 bg-slate-900 border border-slate-800 outline-indigo-500/0 group-hover/drop:outline-indigo-500/20 group-hover/drop:border-indigo-500/50`}>
                    <Upload className={`w-8 h-8 transition-colors ${dragActive ? 'text-indigo-400' : 'text-slate-400 group-hover/drop:text-indigo-500'}`} />
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-tight text-white`}>Drop Raw Stream Frame</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">or click to ingest local dataset</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-indigo-500" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Inference Sensitivity</span>
            </div>
            <span className={`text-xl font-black tabular-nums tracking-tighter text-white`}>
              {Math.round(confidence * 100)}%
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.01"
              value={confidence}
              onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-800`}
            />
            <div className="flex justify-between mt-3">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Global Scope</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Precision Locking</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              disabled={!preview || isLoading}
              className={`px-6 py-4 font-bold rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase text-[10px] tracking-widest border bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white`}
            >
              Reset Ingest
            </button>
            <button
              onClick={onDetect}
              disabled={!preview || isLoading}
              className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Inference Active...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    <span className="uppercase tracking-[0.1em] text-xs">Execute Inference</span>
                  </>
                )}
              </div>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;
