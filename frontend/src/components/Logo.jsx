import React from 'react';

const Logo = ({ size = 'medium', showTagline = true, className = '' }) => {
  const sizeMap = {
    small: { icon: 28, title: 'text-lg', tagline: 'text-xs' },
    medium: { icon: 36, title: 'text-xl', tagline: 'text-xs' },
    large: { icon: 48, title: 'text-3xl', tagline: 'text-sm' },
  };

  const { icon, title, tagline } = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Glowing Heart with Embedded Dynamic ECG Pulse Wave */}
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            <linearGradient id="beatHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="pulseGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Red Heart Shape */}
          <path
            d="M50 88C50 88 12 62 12 34C12 21 21.5 12 33.5 12C41.5 12 47 16.5 50 21C53 16.5 58.5 12 66.5 12C78.5 12 88 21 88 34C88 62 50 88 50 88Z"
            fill="url(#beatHeartGrad)"
            className="animate-heart-beat"
          />

          {/* Dynamic ECG/Pulse Wave Line Running Seamlessly Across Heart */}
          <path
            d="M 5 48 L 26 48 L 32 38 L 40 62 L 48 20 L 56 76 L 64 42 L 72 50 L 95 50"
            stroke="url(#pulseGlowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-sm"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 ${title}`}>
            Beat
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </div>
        {showTagline && (
          <span className={`text-slate-500 font-medium italic ${tagline}`}>
            Your Health, Our Pulse
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
