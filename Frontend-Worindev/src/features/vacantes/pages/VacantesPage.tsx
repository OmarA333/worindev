import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserRole } from '@/types';
import { Search, MapPin, Briefcase, ChevronRight, Plus, Edit, Users } from 'lucide-react';
import { VacanteFormModal } from '../components/VacanteFormModal';
import toast from 'react-hot-toast';
import { formatModalidad, formatTipoContrato } from '@/shared/utils/formatters';

interface Props { onNavigate: (path: string) => void; }

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const VacantesPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const isEmpresa = user?.role === UserRole.EMPRESA || user?.role === UserRole.ADMIN;
  const [vacantes, setVacantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVacante, setEditingVacante] = useState<any | null>(null);

  useEffect(() => {
    cargarVacantes();
  }, []);

  const cargarVacantes = async () => {
    try {
      const token = localStorage.getItem('wrd_token');
      if (!token) {
        toast.error('No estás autenticado');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/api/vacantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Error al cargar vacantes');
      }
      
      const data = await res.json();
      setVacantes(data.vacantes || []);
    } catch (error) {
      console.error('Error al cargar vacantes:', error);
      toast.error('Error al cargar vacantes');
      setVacantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async (vacanteId: number) => {
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/postulaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vacanteId }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al postular');
      }
      
      const result = await res.json();
      toast.success(result.message, { duration: 5000 });
      cargarVacantes();
    } catch (error: any) {
      toast.error(error.message || 'Error al postular');
    }
  };

  const handleNuevaVacante = () => {
    setEditingVacante(null);
    setShowForm(true);
  };

  const handleEditarVacante = (vacante: any) => {
    setEditingVacante(vacante);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVacante(null);
  };

  const handleSaveForm = () => {
    cargarVacantes();
  };

  const filtered = vacantes.filter(v => {
    if (!v) return false;
    
    const matchesSearch = !search || 
      (v.titulo && v.titulo.toLowerCase().includes(search.toLowerCase())) || 
      (v.empresa?.nombre && v.empresa.nombre.toLowerCase().includes(search.toLowerCase()));
    
    const matchesModalidad = !modalidad || v.modalidad === modalidad;
    
    return matchesSearch && matchesModalidad;
  });

  const matchColor = (m: number) => m >= 93 ? 'text-accent-600' : m >= 80 ? 'text-yellow-600' : 'text-ink-500';

  const modalidadBadge = (m: string) => {
    const formatted = formatModalidad(m);
    return formatted === 'Remoto' ? 'bg-accent-100 text-accent-700' :
           formatted === 'Híbrido' ? 'bg-primary-100 text-primary-700' :
           'bg-surface-bg text-ink-500 border border-surface-border';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-border rounded w-1/3" />
          <div className="h-4 bg-surface-border rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">
            {isEmpresa ? 'Mis Vacantes' : 'Vacantes disponibles'}
          </h1>
          <p className="text-ink-500 text-sm mt-1">{filtered.length} oportunidades encontradas</p>
        </div>
        {isEmpresa && (
          <button 
            onClick={handleNuevaVacante}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={15} /> Nueva vacante
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cargo o empresa..."
            className="w-full bg-white border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-ink-900 placeholder-ink-300 text-sm focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <select value={modalidad} onChange={e => setModalidad(e.target.value)}
          className="bg-white border border-surface-border rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:outline-none focus:border-primary-500">
          <option value="">Todas las modalidades</option>
          <option value="Remoto">Remoto</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="card-light p-12 text-center">
              <Briefcase size={40} className="text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500">No se encontraron vacantes</p>
            </div>
          ) : filtered.map(v => {
            if (!v || !v.id) return null;
            
            return (
            <div key={v.id} onClick={() => setSelected(v)}
              className={`card-light p-4 cursor-pointer transition-all card-hover
                ${selected?.id === v.id ? 'border-primary-400 ring-1 ring-primary-300' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-900 text-sm truncate">{v.titulo || 'Sin título'}</h3>
                  <p className="text-ink-500 text-xs mt-0.5">{v.empresa?.nombre || 'Empresa'}</p>
                </div>
                {!isEmpresa && v.matchScore !== undefined && (
                  <div className="text-right ml-3">
                    <p className={`text-base font-bold ${matchColor(v.matchScore)}`}>{v.matchScore}%</p>
                    <p className="text-xs text-ink-300">compatibilidad</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {v.ciudad && <span className="flex items-center gap-1 text-xs text-ink-500"><MapPin size={11} />{v.ciudad}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${modalidadBadge(v.modalidad || 'PRESENCIAL')}`}>
                  {formatModalidad(v.modalidad) || 'Presencial'}
                </span>
                {v.salarioMin && v.salarioMax && (
                  <span className="text-xs text-ink-500">${(v.salarioMin/1000000).toFixed(1)}M - ${(v.salarioMax/1000000).toFixed(1)}M</span>
                )}
              </div>
              {!isEmpresa && v.matchScore !== undefined && (
                <div className="mt-2 w-full bg-surface-border rounded-full h-1">
                  <div className="h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${v.matchScore}%` }} />
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card-light p-6 sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-ink-900">{selected.titulo || 'Sin título'}</h2>
                  <p className="text-ink-500 mt-1">{selected.empresa?.nombre || 'Empresa'} · {selected.ciudad || 'Ciudad'}</p>
                </div>
                {!isEmpresa && selected.matchScore !== undefined && (
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${matchColor(selected.matchScore)}`}>{selected.matchScore}%</p>
                    <p className="text-xs text-ink-500">compatibilidad</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`text-xs px-3 py-1 rounded-full ${modalidadBadge(selected.modalidad || 'PRESENCIAL')}`}>
                  {formatModalidad(selected.modalidad) || 'Presencial'}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-surface-bg text-ink-700 border border-surface-border">
                  {formatTipoContrato(selected.tipoContrato) || 'Indefinido'}
                </span>
                {selected.salarioMin && selected.salarioMax && (
                  <span className="text-xs px-3 py-1 rounded-full bg-surface-bg text-ink-700 border border-surface-border">
                    ${(selected.salarioMin/1000000).toFixed(1)}M - ${(selected.salarioMax/1000000).toFixed(1)}M
                  </span>
                )}
                {isEmpresa && selected._count?.postulaciones !== undefined && (
                  <span className="text-xs px-3 py-1 rounded-full bg-surface-bg text-ink-700 border border-surface-border">
                    {selected._count.postulaciones} postulantes
                  </span>
                )}
              </div>

              {selected.habilidades && Array.isArray(selected.habilidades) && selected.habilidades.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-ink-900 mb-2">Habilidades requeridas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.habilidades.map((h: string) => (
                      <span key={h} className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 border border-primary-200">{h}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.descripcion && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-ink-900 mb-2">Descripción</h4>
                  <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.descripcion}
                  </p>
                </div>
              )}

              {selected.requisitos && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-ink-900 mb-2">Requisitos</h4>
                  <p className="text-ink-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.requisitos}
                  </p>
                </div>
              )}

              {/* Requerimientos de Tests */}
              {(selected.requiereTestHardSkill || selected.requiereTestSoftSkill || 
                selected.requiereTestPsicometria || selected.requiereTestLogistica || 
                selected.requiereReferencias) && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Requerimientos Especiales</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {selected.requiereTestHardSkill && (
                      <li>✓ Test de Habilidades Técnicas {selected.puntajeMinHardSkill && `(mín. ${selected.puntajeMinHardSkill}%)`}</li>
                    )}
                    {selected.requiereTestSoftSkill && (
                      <li>✓ Test de Habilidades Blandas {selected.puntajeMinSoftSkill && `(mín. ${selected.puntajeMinSoftSkill}%)`}</li>
                    )}
                    {selected.requiereTestPsicometria && (
                      <li>✓ Test Psicométrico {selected.puntajeMinPsicometria && `(mín. ${selected.puntajeMinPsicometria}%)`}</li>
                    )}
                    {selected.requiereTestLogistica && (
                      <li>✓ Test Logístico {selected.puntajeMinLogistica && `(mín. ${selected.puntajeMinLogistica}%)`}</li>
                    )}
                    {selected.requiereReferencias && (
                      <li>✓ Referencias Verificadas {selected.minimoReferencias && `(mín. ${selected.minimoReferencias})`}</li>
                    )}
                  </ul>
                </div>
              )}

              {!isEmpresa ? (
                <button 
                  onClick={() => handlePostular(selected.id)}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Postularme ahora <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => onNavigate(`/postulaciones?vacanteId=${selected.id}`)}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2">
                    <Users size={16} /> Ver candidatos
                  </button>
                  <button 
                    onClick={() => handleEditarVacante(selected)}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-ink-700 bg-surface-bg border border-surface-border hover:border-ink-300 transition-all text-sm flex items-center justify-center gap-2">
                    <Edit size={16} /> Editar vacante
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card-light p-12 flex flex-col items-center justify-center text-center">
              <Briefcase size={40} className="text-ink-300 mb-4" />
              <p className="text-ink-500">Selecciona una vacante para ver los detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <VacanteFormModal
          vacante={editingVacante}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
};
