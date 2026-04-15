import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 56, text: 'text-4xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* W icon — SVG replicating the logo */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow */}
        <ellipse cx="50" cy="30" rx="18" ry="18" fill="#00d4ff" fillOpacity="0.18" />
        {/* Blue left arm */}
        <path d="M5 5 L28 70 L50 30 L28 5 Z" fill="url(#blueGrad)" />
        {/* Green right arm */}
        <path d="M95 5 L72 70 L50 30 L72 5 Z" fill="url(#greenGrad)" />
        {/* Center overlap */}
        <path d="M50 30 L38 60 L50 70 L62 60 Z" fill="url(#centerGrad)" fillOpacity="0.7" />
        <defs>
          <linearGradient id="blueGrad" x1="5" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563a8" />
            <stop offset="100%" stopColor="#1a3a6b" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="95" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5aaa2a" />
            <stop offset="100%" stopColor="#3d7a1a" />
          </linearGradient>
          <linearGradient id="centerGrad" x1="50" y1="30" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#2563a8" />
          </linearGradient>
        </defs>
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold text-brand-blue ${s.text}`} style={{ color: '#1a3a6b' }}>
            worindev
          </span>
          <span className={`font-sans text-brand-gray tracking-wider ${s.sub}`} style={{ color: '#4a5568' }}>
            trabajo en desarrollo
          </span>
        </div>
      )}
    </div>
  );
};

// Light variant for dark backgrounds
export const LogoLight: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 56, text: 'text-4xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="30" rx="18" ry="18" fill="#00d4ff" fillOpacity="0.25" />
        <path d="M5 5 L28 70 L50 30 L28 5 Z" fill="url(#blueGradL)" />
        <path d="M95 5 L72 70 L50 30 L72 5 Z" fill="url(#greenGradL)" />
        <path d="M50 30 L38 60 L50 70 L62 60 Z" fill="url(#centerGradL)" fillOpacity="0.8" />
        <defs>
          <linearGradient id="blueGradL" x1="5" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563a8" />
          </linearGradient>
          <linearGradient id="greenGradL" x1="95" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#5aaa2a" />
          </linearGradient>
          <linearGradient id="centerGradL" x1="50" y1="30" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold text-white ${s.text}`}>worindev</span>
          <span className={`font-sans text-slate-400 tracking-wider ${s.sub}`}>trabajo en desarrollo</span>
        </div>
      )}
    </div>
  );
};
