import React, { useState } from 'react';
import { CheckCircle2, Clock, Lock, Play, Star, Brain, MapPin, Shield } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const TESTS = [
  {
    id: '1', nombre: 'Habilidades Técnicas', tipo: 'HARD_SKILL', duracion: 30,
    preguntas: 25, pct: '40%', icon: '🎓', completado: true, puntaje: 85,
    color: 'from-primary-500 to-primary-700',
    desc: 'Evalúa tus conocimientos técnicos, certificaciones y experiencia práctica.'
  },
  {
    id: '2', nombre: 'Psicometría', tipo: 'PSICOMETRIA', duracion: 20,
    preguntas: 40, pct: '20%', icon: '🧠', completado: false, puntaje: null,
    color: 'from-accent-500 to-accent-700',
    desc: 'Mide tu personalidad, valores y habilidades blandas mediante preguntas situacionales.'
  },
  {
    id: '3', nombre: 'Logística Personal', tipo: 'LOGISTICA', duracion: 10,
    preguntas: 15, pct: '20%', icon: '📍', completado: true, puntaje: 90,
    color: 'from-cyan-500 to-blue-600',
    desc: 'Confirma tu ubicación, disponibilidad horaria y expectativa salarial.'
  },
  {
    id: '4', nombre: 'Validación de Referencias', tipo: 'REFERENCIAS', duracion: 5,
    preguntas: 5, pct: '13%', icon: '✅', completado: false, puntaje: null,
    color: 'from-purple-500 to-pink-600',
    desc: 'Ingresa tus referencias laborales para validación automática por correo.'
  },
];

export const TestsPage: React.FC<Props> = ({ onNavigate }) => {
  const [activeTest, setActiveTest] = useState<typeof TESTS[0] | null>(null);

  const completados = TESTS.filter(t => t.completado).length;
  const scoreTotal  = Math.round(
    TESTS.filter(t => t.completado && t.puntaje)
      .reduce((acc, t) => acc + (t.puntaje! * parseInt(t.pct)) / 100, 0)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Tests de Competencias</h1>
        <p className="text-slate-400 text-sm mt-1">Completa todos los tests para maximizar tu Match Score</p>
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold">{completados}/{TESTS.length} tests completados</p>
            <p className="text-slate-500 text-sm">Score parcial: <span className="text-accent-400 font-bold">{scoreTotal}%</span></p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold gradient-text">{Math.round((completados / TESTS.length) * 100)}%</p>
            <p className="text-xs text-slate-500">progreso</p>
          </div>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
            style={{ width: `${(completados / TESTS.length) * 100}%` }} />
        </div>
      </div>

      {/* Tests grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {TESTS.map(t => (
          <div key={t.id}
            className={`glass rounded-2xl p-5 border card-hover cursor-pointer transition-all
              ${t.completado ? 'border-accent-500/20' : 'border-white/8'}`}
            onClick={() => setActiveTest(t)}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {t.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">{t.nombre}</h3>
                  {t.completado
                    ? <CheckCircle2 size={16} className="text-accent-500" />
                    : <Lock size={14} className="text-slate-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} />{t.duracion} min</span>
                  <span className="text-xs text-slate-500">{t.preguntas} preguntas</span>
                  <span className={`text-xs font-semibold bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.pct}</span>
                </div>
                {t.completado && t.puntaje && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Puntaje</span>
                      <span className="text-xs font-bold text-accent-400">{t.puntaje}%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.puntaje}%` }} />
                    </div>
                  </div>
                )}
                {!t.completado && (
                  <button className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${t.color} text-white text-xs font-semibold hover:opacity-90 transition-all`}>
                    <Play size={11} /> Iniciar test
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-5 border border-primary-500/20">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Star size={16} className="text-accent-500" /> ¿Por qué son importantes?
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Los tests permiten ir más allá de un CV tradicional, evaluando habilidades reales. Al completarlos, el algoritmo puede calcular con precisión tu compatibilidad con las vacantes y activar entrevistas grupales automáticas cuando alcances el <strong className="text-accent-400">93% de afinidad</strong>.
        </p>
      </div>
    </div>
  );
};
