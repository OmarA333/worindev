import React from 'react';
import { Calendar, Video, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const ENTREVISTAS = [
  {
    id: '1', vacante: 'Desarrollador React Senior', empresa: 'TechCorp SAS',
    fecha: '2025-04-14', hora: '10:00 AM', modalidad: 'Virtual',
    enlace: 'https://meet.google.com/abc-def-ghi', candidatos: 8,
    confirmado: false, tiempoLimite: '12 horas',
  },
];

export const EntrevistasPage: React.FC<Props> = () => (
  <div className="p-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-ink-900">Mis Entrevistas</h1>
      <p className="text-ink-500 text-sm mt-1">Entrevistas grupales programadas automáticamente</p>
    </div>

    {/* Info banner */}
    <div className="card-light p-4 border-l-4 border-primary-500 flex items-start gap-3">
      <AlertCircle size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-ink-900 text-sm font-semibold">¿Cómo funcionan las entrevistas grupales?</p>
        <p className="text-ink-500 text-xs mt-1 leading-relaxed">
          Cuando alcanzas el 93% de compatibilidad, el sistema te convoca automáticamente a una entrevista grupal con hasta 10 candidatos. Tienes <strong className="text-primary-600">12 horas</strong> para confirmar tu asistencia.
        </p>
      </div>
    </div>

    {ENTREVISTAS.length === 0 ? (
      <div className="card-light p-12 text-center">
        <Calendar size={40} className="text-ink-300 mx-auto mb-4" />
        <p className="text-ink-500">No tienes entrevistas programadas aún</p>
        <p className="text-ink-300 text-sm mt-2">Mejora tu Match Score para ser convocado</p>
      </div>
    ) : (
      ENTREVISTAS.map(e => (
        <div key={e.id} className="card-light p-6 border-l-4 border-accent-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-ink-900">{e.vacante}</h3>
              <p className="text-ink-500 text-sm">{e.empresa}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold border border-accent-200">
              Programada
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon: Calendar, label: 'Fecha',      value: e.fecha },
              { icon: Clock,    label: 'Hora',       value: e.hora },
              { icon: Video,    label: 'Modalidad',  value: e.modalidad },
              { icon: Users,    label: 'Candidatos', value: `${e.candidatos}/10` },
            ].map(d => (
              <div key={d.label} className="bg-surface-bg rounded-xl p-3 border border-surface-border text-center">
                <d.icon size={16} className="text-accent-500 mx-auto mb-1" />
                <p className="text-xs text-ink-500">{d.label}</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>

          {e.enlace && (
            <div className="mb-4 p-3 rounded-lg bg-surface-bg border border-surface-border">
              <p className="text-xs text-ink-500 mb-1">Enlace de videollamada</p>
              <a href={e.enlace} target="_blank" rel="noopener noreferrer"
                className="text-primary-600 text-sm hover:text-primary-700 break-all">{e.enlace}</a>
            </div>
          )}

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accent-500 to-primary-500 hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Confirmar asistencia
            </button>
            <button className="px-4 py-3 rounded-xl font-semibold text-ink-500 bg-surface-bg border border-surface-border hover:border-red-300 hover:text-red-500 transition-all text-sm">
              Declinar
            </button>
          </div>

          <p className="text-center text-xs text-ink-300 mt-3">
            ⏱️ Tiempo límite para confirmar: <span className="text-yellow-600 font-semibold">{e.tiempoLimite}</span>
          </p>
        </div>
      ))
    )}
  </div>
);
