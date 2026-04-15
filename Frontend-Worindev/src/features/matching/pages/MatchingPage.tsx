import React, { useState } from 'react';
import { Star, Zap, Brain, MapPin, Shield, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const DIMENSIONES = [
  { key: 'hard',    label: 'Hard Skills',          pct: 40, score: 85, icon: '🎓', color: 'from-primary-500 to-primary-700',  desc: 'Títulos, certificaciones y experiencia técnica' },
  { key: 'soft',    label: 'Soft Skills & Psico',  pct: 20, score: 72, icon: '🧠', color: 'from-accent-500 to-accent-700',    desc: 'Personalidad y habilidades blandas' },
  { key: 'logis',   label: 'Logística',             pct: 20, score: 90, icon: '📍', color: 'from-cyan-500 to-blue-600',        desc: 'Ubicación, horario y salario' },
  { key: 'refs',    label: 'Referencias',           pct: 13, score: 60, icon: '✅', color: 'from-purple-500 to-pink-600',      desc: 'Validación de referencias laborales' },
];

export const MatchingPage: React.FC<Props> = ({ onNavigate }) => {
  const totalScore = Math.round(
    DIMENSIONES.reduce((acc, d) => acc + (d.score * d.pct) / 100, 0)
  );

  const reached93 = totalScore >= 93;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Mi Match Score</h1>
        <p className="text-slate-400 text-sm mt-1">Así te evalúa el algoritmo de Worindev</p>
      </div>

      {/* Score principal */}
      <div className={`glass rounded-2xl p-8 border text-center relative overflow-hidden
        ${reached93 ? 'border-accent-500/40 bg-accent-500/5' : 'border-white/10'}`}>
        {reached93 && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-primary-500/5" />
        )}
        <div className="relative">
          <div className="relative inline-block mb-4">
            <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#mainGrad)" strokeWidth="8"
                strokeDasharray={`${totalScore * 3.14} ${(100 - totalScore) * 3.14}`}
                strokeLinecap="round" className={reached93 ? 'animate-match-pulse' : ''} />
              <defs>
                <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563a8" />
                  <stop offset="100%" stopColor="#5aaa2a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold gradient-text">{totalScore}%</p>
              <p className="text-xs text-slate-500">score</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {reached93 ? '🎉 ¡Umbral alcanzado!' : `Faltan ${93 - totalScore}% para el umbral`}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {reached93
              ? 'Has alcanzado el 93% de compatibilidad. El sistema puede activar entrevistas grupales automáticamente.'
              : 'Completa tus tests y mejora tu perfil para alcanzar el 93% y acceder a entrevistas grupales automáticas.'}
          </p>

          {reached93 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 text-accent-400 text-sm font-semibold border border-accent-500/30">
              <Zap size={14} /> Entrevistas grupales activadas
            </div>
          )}
        </div>
      </div>

      {/* Dimensiones */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Desglose por dimensión</h2>
        <div className="space-y-4">
          {DIMENSIONES.map(d => (
            <div key={d.key} className="glass rounded-xl p-5 border border-white/8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {d.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold text-white text-sm">{d.label}</span>
                      <span className="text-slate-600 text-xs ml-2">({d.pct}% del total)</span>
                    </div>
                    <span className={`text-lg font-bold ${d.score >= 90 ? 'text-accent-500' : d.score >= 70 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {d.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{d.desc}</p>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${d.color} transition-all duration-700`}
                      style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cómo mejorar */}
      <div className="glass rounded-2xl p-6 border border-primary-500/20">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-400" /> Cómo mejorar tu score
        </h3>
        <div className="space-y-3">
          {[
            { action: 'Completa el test de Psicometría', impact: '+8%', done: false },
            { action: 'Agrega referencias laborales verificadas', impact: '+5%', done: false },
            { action: 'Actualiza tu experiencia técnica', impact: '+3%', done: true },
            { action: 'Confirma tu disponibilidad horaria', impact: '+2%', done: true },
          ].map(a => (
            <div key={a.action} className="flex items-center gap-3">
              <CheckCircle2 size={16} className={a.done ? 'text-accent-500' : 'text-slate-600'} />
              <span className={`text-sm flex-1 ${a.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{a.action}</span>
              {!a.done && <span className="text-xs font-semibold text-accent-400">{a.impact}</span>}
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate('/tests')}
          className="mt-5 w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm">
          Ir a mis tests <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
