import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserRole } from '@/types';
import { Search, MapPin, Briefcase, Clock, Star, Filter, Plus, ChevronRight } from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const MOCK_VACANTES = [
  { id: '1', titulo: 'Desarrollador React Senior', empresa: 'TechCorp SAS', ciudad: 'Medellín', modalidad: 'Híbrido', salario: '$5M - $7M', match: 93, estado: 'ACTIVA', habilidades: ['React', 'TypeScript', 'Node.js'], tipoContrato: 'Indefinido', postulantes: 24 },
  { id: '2', titulo: 'Frontend Engineer', empresa: 'Startup Digital', ciudad: 'Bogotá', modalidad: 'Remoto', salario: '$4M - $6M', match: 87, estado: 'ACTIVA', habilidades: ['Vue.js', 'CSS', 'Git'], tipoContrato: 'Indefinido', postulantes: 18 },
  { id: '3', titulo: 'Analista de Datos', empresa: 'DataCo', ciudad: 'Cali', modalidad: 'Presencial', salario: '$3.5M - $5M', match: 72, estado: 'ACTIVA', habilidades: ['Python', 'SQL', 'Power BI'], tipoContrato: 'Fijo', postulantes: 31 },
  { id: '4', titulo: 'DevOps Engineer', empresa: 'CloudSystems', ciudad: 'Medellín', modalidad: 'Remoto', salario: '$6M - $9M', match: 65, estado: 'ACTIVA', habilidades: ['AWS', 'Docker', 'Kubernetes'], tipoContrato: 'Indefinido', postulantes: 12 },
  { id: '5', titulo: 'UX/UI Designer', empresa: 'DesignHub', ciudad: 'Bogotá', modalidad: 'Híbrido', salario: '$3M - $4.5M', match: 58, estado: 'ACTIVA', habilidades: ['Figma', 'Adobe XD', 'Prototyping'], tipoContrato: 'Fijo', postulantes: 45 },
];

export const VacantesPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const isEmpresa = user?.role === UserRole.EMPRESA || user?.role === UserRole.ADMIN;
  const [search, setSearch] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_VACANTES[0] | null>(null);

  const filtered = MOCK_VACANTES.filter(v =>
    (!search || v.titulo.toLowerCase().includes(search.toLowerCase()) || v.empresa.toLowerCase().includes(search.toLowerCase())) &&
    (!modalidad || v.modalidad === modalidad)
  );

  const matchColor = (m: number) => m >= 93 ? 'text-accent-500' : m >= 80 ? 'text-yellow-400' : 'text-slate-400';
  const modalidadColor = (m: string) => m === 'Remoto' ? 'bg-accent-500/10 text-accent-400' : m === 'Híbrido' ? 'bg-primary-500/10 text-primary-400' : 'bg-slate-700 text-slate-400';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            {isEmpresa ? 'Mis Vacantes' : 'Vacantes disponibles'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} oportunidades encontradas</p>
        </div>
        {isEmpresa && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={15} /> Nueva vacante
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cargo o empresa..."
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <select value={modalidad} onChange={e => setModalidad(e.target.value)}
          className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-primary-500">
          <option value="">Todas las modalidades</option>
          <option value="Remoto">Remoto</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(v => (
            <div key={v.id}
              onClick={() => setSelected(v)}
              className={`glass rounded-xl p-4 border cursor-pointer transition-all card-hover
                ${selected?.id === v.id ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/8 hover:border-white/15'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{v.titulo}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{v.empresa}</p>
                </div>
                {!isEmpresa && (
                  <div className="text-right ml-3">
                    <p className={`text-base font-bold ${matchColor(v.match)}`}>{v.match}%</p>
                    <p className="text-xs text-slate-600">match</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={11} />{v.ciudad}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${modalidadColor(v.modalidad)}`}>{v.modalidad}</span>
                <span className="text-xs text-slate-500">{v.salario}</span>
              </div>
              {!isEmpresa && (
                <div className="mt-2 w-full bg-dark-700 rounded-full h-1">
                  <div className="h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${v.match}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="glass rounded-2xl p-6 border border-white/10 sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.titulo}</h2>
                  <p className="text-slate-400 mt-1">{selected.empresa} · {selected.ciudad}</p>
                </div>
                {!isEmpresa && (
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${matchColor(selected.match)}`}>{selected.match}%</p>
                    <p className="text-xs text-slate-500">compatibilidad</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`text-xs px-3 py-1 rounded-full ${modalidadColor(selected.modalidad)}`}>{selected.modalidad}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-dark-700 text-slate-400">{selected.tipoContrato}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-dark-700 text-slate-400">{selected.salario}</span>
                {isEmpresa && <span className="text-xs px-3 py-1 rounded-full bg-dark-700 text-slate-400">{selected.postulantes} postulantes</span>}
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold text-white mb-2">Habilidades requeridas</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.habilidades.map(h => (
                    <span key={h} className="text-xs px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{h}</span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-2">Descripción</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Buscamos un profesional apasionado por la tecnología para unirse a nuestro equipo. El candidato ideal tiene experiencia sólida en las tecnologías requeridas y capacidad para trabajar en equipo en un ambiente ágil.
                </p>
              </div>

              {!isEmpresa ? (
                <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Postularme ahora <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all text-sm">
                    Ver candidatos
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl font-semibold text-slate-300 glass border border-white/10 hover:border-white/20 transition-all text-sm">
                    Editar vacante
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 border border-white/8 flex flex-col items-center justify-center text-center">
              <Briefcase size={40} className="text-slate-600 mb-4" />
              <p className="text-slate-400">Selecciona una vacante para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
