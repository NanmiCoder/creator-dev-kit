import React from 'react';

// 自定义SVG图标
export const BotIcon = ({ className, size = 48 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="8" width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.2"/>
    <path d="M16 20H32M16 28H32M16 36H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="16" r="2" fill="currentColor"/>
    <circle cx="28" cy="16" r="2" fill="currentColor"/>
  </svg>
);

export const PresentationIcon = ({ className, size = 48 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="40" height="28" rx="4" fill="currentColor" fillOpacity="0.2"/>
    <rect x="8" y="8" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 32V40M16 40H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
