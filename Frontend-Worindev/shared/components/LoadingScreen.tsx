import React from 'react';
import { LogoLight } from './Logo';

export const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50">
    <div className="animate-float">
      <LogoLight size="lg" />
    </div>
    <div className="mt-8 flex gap-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-500 animate-pulse2"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
    <p className="mt-4 text-slate-500 text-sm">Cargando plataforma...</p>
  </div>
);
