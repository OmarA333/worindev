import React from 'react';
import { Briefcase, Clock, CheckCircle2, XCircle, Calendar, ChevronRight } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const POSTULACIONES = [
  { id: '1', vacante: 'Desarrollador React Senior', empresa: 'TechCorp SAS', match: 93, estado: 'ENTREVISTA', fecha: '2025-04-10', color: 'text-accent-500 bg-accent-500/10' },
  { id: '2', vacante: 'Frontend Engineer', empresa: 'Startup Digital', match: 87, estado: 'EN_REVISION', fecha: '2025-04-08', color: 'text-yellow-400 bg-yellow-400/10' },
  { id: '3', vacante: 'Analista de Datos', empresa: 'DataCo', match: 72, estado: 'PENDIENTE', fecha: '2025-04-05', color: 'text-slate-400 bg-slate-700' },
  { id: '4', vacante: 'DevOps Engineer', empresa: 'CloudSystems', match: 65, estado: 'RECHAZADO', fecha: '2025-04-01', color: 'text-red-400 bg-red-400/10' },
];

const estadoLabel: Record<string, string> = {
  PENDIENTE:   'Pendiente',
  EN_REVISION: 'En revisión',
  ENTREVISTA:  'Entrevista',
  RECHAZADO:   'Rechazado',
  ACEPTADO:    'Aceptado',
};

const estadoIcon: Record<string, React.ElementType> = {
  PENDIENTE:   Clock,
  EN_REVISION: Clock,
  ENTREVISTA:  Calendar,
  RECHAZADO:   XCircle,
  ACEPTADO:    CheckCircle2,
};

export const PostulacionesPage: React.FC<Props> = ({ onNavigate }) => (
  <div className="p-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-white">Mis Postulaciones</h1>
      <p className="text-slate-400 text-sm mt-1">{POSTULACIONES.length} postulaciones registradas</p>
    </div>

    <div className="space-y-3">
      {POSTULACIONES.map(p => {
        const Icon = estadoIcon[p.estado] || Clock;
        return (
          <div key={p.id} className="glass rounded-xl p-5 border border-white/8 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{p.vacante}</h3>
                <p className="text-slate-500 text-xs mt-0.5">{p.empresa} · {p.fecha}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-500">{p.match}%</p>
                  <p className="text-xs text-slate-600">match</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${p.color}`}>
                  <Icon size={12} /> {estadoLabel[p.estado]}
                </span>
              </div>
            </div>
            {p.estado === 'ENTREVISTA' && (
              <div className="mt-3 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-between">
                <div>
                  <p className="text-accent-400 text-xs font-semibold">🎉 ¡Entrevista grupal programada!</p>
                  <p className="text-slate-500 text-xs mt-0.5">Lunes 14 Abr · 10:00 AM · Virtual</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-accent-500 text-white text-xs font-semibold hover:bg-accent-600 transition-all">
                  Confirmar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
