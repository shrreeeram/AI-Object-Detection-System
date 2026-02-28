import React from 'react';
import { motion } from 'framer-motion';

const BoundingBoxOverlay = ({ detections, imageWidth, imageHeight }) => {
    if (!detections || detections.length === 0) return null;

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${imageWidth} ${imageHeight}`}
            preserveAspectRatio="none"
        >
            {detections.map((det, idx) => {
                // Adjust these keys based on backend response (e.g., det.box: [x, y, w, h])
                const [x, y, w, h] = det.box || [0, 0, 0, 0];

                const getConfidenceColor = (conf) => {
                    if (conf > 0.75) return '#22c55e'; // Green
                    if (conf >= 0.5) return '#eab308'; // Yellow
                    return '#ef4444'; // Red
                };

                const color = getConfidenceColor(det.confidence);

                return (
                    <g key={idx}>
                        <motion.rect
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1, pathLength: 1 }}
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            className="drop-shadow-lg"
                        />
                        <motion.g
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <rect
                                x={x}
                                y={y - 20}
                                width={det.object.length * 8 + 40}
                                height={20}
                                fill={color}
                                className="rounded-t-sm"
                            />
                            <text
                                x={x + 5}
                                y={y - 6}
                                fill="white"
                                className="text-[10px] font-black uppercase tracking-widest"
                            >
                                {det.object} {Math.round(det.confidence * 100)}%
                            </text>
                        </motion.g>
                    </g>
                );
            })}
        </svg>
    );
};

export default BoundingBoxOverlay;
