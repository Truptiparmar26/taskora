import React from 'react';

const TaskoraLogo = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Gradient matching your theme (Indigo to Purple) */}
        <linearGradient id="taskoraGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" /> {/* Indigo */}
          <stop offset="100%" stopColor="#9333EA" /> {/* Purple */}
        </linearGradient>
      </defs>
      
      {/* Background Rounded Square */}
      <rect width="100" height="100" rx="24" fill="url(#taskoraGradient)" />
      
      {/* Abstract Task List Lines (Background of icon) */}
      <path d="M28 32 H72 M28 50 H55 M28 68 H45" stroke="white" strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" />
      
      {/* The Checkmark (Foreground) */}
      <path d="M35 50 L45 60 L75 30" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default TaskoraLogo;

