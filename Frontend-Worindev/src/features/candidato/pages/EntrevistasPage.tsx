import React from 'react';
import { Calendar, Video, MapPin, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const ENTREVISTAS = [
  {
    id: '1', vacante: 'Desarrollador React Senior', empresa: 'TechCorp SAS',
    fecha: '2025-04-14', hora: '10:00 AM', modalidad: 'Virtual',
    enlace: 'https://meet.google.com/abc-def-ghi', candidatos: 8, estado: 'PROGRAMADA',
    confirmado: false, tiempoLimite: '12 horas',
  },
];

export const EntrevistasPage: React.FC<Props> = ({ onNavigate }) => (
  <div className="p-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-white">Mis Entrevistas</h1>
      <p className="text-slate-400 text-sm mt-1">Entrevistas grupales programadas automáticamente</p>
    </div>

    {/* Info banner */}
    <div className="glass rounded-xl p-4 border border-primary-500/20 flex items-start gap-3">
      <AlertCircle size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-white text-sm font-semibold">¿Cómo funcionan las entrevistas grupales?</p>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Cuando alcanzas el 93% de compatibilidad, el sistema te convoca automáticamente a una entrevista grupal con hasta 10 candidatos. Tienes <strong className="text-primary-400">12 horas</strong> para confirmar tu asistencia. Si no confirmas, el siguiente candidato es convocado.
        </p>
      </div>
    </div>

    {ENTREVISTAS.length === 0 ? (
      <div className="glass rounded-2xl p-12 border border-white/8 text-center">
        <Calendar size={40} className="text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No tienes entrevistas programadas aún</p>
        <p className="text-slate-600 text-sm mt-2">Mejora tu Match Score para ser convocado</p>
      </div>
    ) : (
      ENTREVISTAS.map(e => (
        <div key={e.id} className="glass rounded-2xl p-6 border border-accent-500/30 bg-accent-500/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">{e.vacante}</h3>
              <p className="text-slate-400 text-sm">{e.empresa}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold border border-accent-500/30">
              Programada
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon: Calendar, label: 'Fecha', value: e.fecha },
              { icon: Clock,    label: 'Hora',  value: e.hora },
              { icon: Video,    label: 'Modalidad', value: e.modalidad },
              { icon: Users,    label: 'Candidatos', value: `${e.candidatos}/10` },
            ].map(d => (
              <div key={d.label} className="glass rounded-xl p-3 border border-white/5 text-center">
                <d.icon size={16} className="text-accent-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500">{d.label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>

          {e.enlace && (
            <div className="mb-4 p-3 rounded-lg bg-dark-700 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">Enlace de videollamada</p>
              <a href={e.enlace} target="_blank" rel="noopener noreferrer"
                className="text-primary-400 text-sm hover:text-primary-300 break-all">{e.enlace}</a>
            </div>
          )}

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accent-500 to-primary-500 hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Confirmar asistencia
            </button>
            <button className="px-4 py-3 rounded-xl font-semibold text-slate-400 glass border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all text-sm">
              Declinar
            </button>
          </div>

          <p className="text-center text-xs text-slate-600 mt-3">
            ⏱️ Tiempo límite para confirmar: <span className="text-yellow-400">{e.tiempoLimite}</span>
          </p>
        </div>
      ))
    )}
  </div>
);
