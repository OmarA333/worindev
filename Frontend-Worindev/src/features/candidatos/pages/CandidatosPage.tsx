import React, { useEffect, useState } from 'react';
import { Users, MapPin, Star, Search, RefreshCw, X, Briefcase, GraduationCap, Phone, CheckCircle, Circle } from 'lucide-react';
import { apiFetch } from '@/shared/services/api';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

interface Habilidad { id: number; habilidad: string; nivel: string; }
interface Referencia { id: number; nombre: string; cargo: string; empresa: string; email: string; telefono: string | null; verificado: boolean; }

interface Candidato {
  id:                 number;
  nombre:             string;
  apellido:           string;
  telefono:           string | null;
  ciudad:             string | null;
  nivelEducacion:     string | null;
  tituloObtenido:     string | null;
  anosExperiencia:    number;
  pretensionSalarial: number | null;
  disponibilidad:     string | null;
  matchScore:         number;
  resumen:            string | null;
  usuario:            { email: string; estado: string };
  habilidades:        Habilidad[];
  referencias:        Referencia[];
  _count:             { postulaciones: number };
}

const nivelColor = (nivel: string) =>
  nivel === 'Experto'    ? 'bg-purple-100 text-purple-700 border border-purple-200' :
  nivel === 'Avanzado'   ? 'bg-primary-100 text-primary-700 border border-primary-200' :
  nivel === 'Intermedio' ? 'bg-accent-100 text-accent-700 border border-accent-200' :
                           'bg-surface-bg text-ink-500 border border-surface-border';

const scoreColor = (s: number) =>
  s >= 90 ? 'text-accent-600' : s >= 70 ? 'text-yellow-600' : 'text-ink-500';

export const CandidatosPage: React.FC<Props> = () => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [buscar,     setBuscar]     = useState('');
  const [selected,   setSelected]   = useState<Candidato | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const cargar = async (q: string) => {    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (q) params.set('buscar', q);
      const data = await apiFetch<{ candidatos: Candidato[]; pagination: any }>(`/api/candidatos?${params}`);
      setCandidatos(data.candidatos);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar candidatos');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCandidato = async (c: Candidato) => {
    setSelected(c);
    setLoadingDetalle(true);
    try {
      const detalle = await apiFetch<Candidato>(`/api/candidatos/${c.id}`);
      setSelected(detalle);
    } catch {
      // mantener el objeto básico si falla
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Búsqueda automática con debounce
  useEffect(() => {
    const t = setTimeout(() => cargar(buscar), 400);
    return () => clearTimeout(t);
  }, [buscar]);

  const handleBuscar = (e: React.FormEvent) => { e.preventDefault(); cargar(buscar); };

  const toggleVerificarReferencia = async (candidatoId: number, refId: number) => {
    try {
      const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidatoId}/referencias/${refId}/verificar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(data.message);
      // Actualizar el estado local
      setSelected(prev => prev ? {
        ...prev,
        referencias: prev.referencias.map(r =>
          r.id === refId ? { ...r, verificado: data.referencia.verificado } : r
        )
      } : null);
    } catch {
      toast.error('Error al actualizar la referencia');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Candidatos registrados</h1>
          <p className="text-ink-500 text-sm mt-1">{candidatos.length} candidatos en la plataforma</p>
        </div>
        <button onClick={() => cargar(buscar)} className="flex items-center gap-2 px-3 py-2 rounded-xl card-light text-ink-700 hover:text-ink-900 text-sm transition-all">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          placeholder="Buscar por nombre, apellido o email..."
          className="w-full bg-white border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-ink-900 placeholder-ink-300 text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && <div className="card-light p-4 border-l-4 border-red-400 text-red-600 text-sm">{error}</div>}

      {/* Contenido */}
      {!loading && !error && (
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Lista */}
          <div className="lg:col-span-2 space-y-3">
            {candidatos.length === 0 ? (
              <div className="card-light p-12 text-center">
                <Users size={40} className="text-ink-300 mx-auto mb-3" />
                <p className="text-ink-500">No se encontraron candidatos</p>
              </div>
            ) : candidatos.map(c => (
              <div key={c.id}
                onClick={() => seleccionarCandidato(c)}
                className={`card-light p-4 cursor-pointer transition-all card-hover
                  ${selected?.id === c.id ? 'border-primary-400 ring-1 ring-primary-300' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {c.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900 text-sm truncate">{c.nombre} {c.apellido}</p>
                    <p className="text-xs text-ink-500 truncate">{c.usuario.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-base font-bold ${scoreColor(c.matchScore)}`}>{c.matchScore.toFixed(0)}%</p>
                    <p className="text-xs text-ink-300">compatibilidad</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {c.ciudad && (
                    <span className="flex items-center gap-1 text-xs text-ink-500"><MapPin size={10} />{c.ciudad}</span>
                  )}
                  {c.anosExperiencia > 0 && (
                    <span className="text-xs text-ink-500">{c.anosExperiencia} años exp.</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.usuario.estado === 'ACTIVO'
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-red-100 text-red-600'
                  }`}>{c.usuario.estado}</span>
                </div>

                {c.habilidades.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {c.habilidades.slice(0, 3).map(h => (
                      <span key={h.id} className="text-xs px-2 py-0.5 rounded-full bg-surface-bg text-ink-700 border border-surface-border">
                        {h.habilidad}
                      </span>
                    ))}
                    {c.habilidades.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-bg text-ink-500">+{c.habilidades.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detalle */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="card-light p-6 sticky top-6 space-y-5 relative">
                {loadingDetalle && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl z-10">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* Header detalle */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl">
                      {selected.nombre.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-ink-900">{selected.nombre} {selected.apellido}</h2>
                      <p className="text-ink-500 text-sm">{selected.usuario.email}</p>
                      {selected.tituloObtenido && (
                        <p className="text-xs text-ink-500 mt-0.5">{selected.tituloObtenido}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${scoreColor(selected.matchScore)}`}>{selected.matchScore.toFixed(0)}%</p>
                      <p className="text-xs text-ink-500">match</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-1.5 text-ink-300 hover:text-ink-700 rounded-lg hover:bg-surface-bg transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-surface-border rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                    style={{ width: `${selected.matchScore}%` }} />
                </div>

                {/* Info rápida */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MapPin,        label: 'Ciudad',       value: selected.ciudad ?? '—' },
                    { icon: Briefcase,     label: 'Experiencia',  value: `${selected.anosExperiencia} años` },
                    { icon: GraduationCap, label: 'Educación',    value: selected.nivelEducacion ?? '—' },
                    { icon: Star,          label: 'Postulaciones',value: String(selected._count.postulaciones) },
                  ].map(d => (
                    <div key={d.label} className="bg-surface-bg rounded-xl p-3 border border-surface-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <d.icon size={13} className="text-ink-300" />
                        <span className="text-xs text-ink-500">{d.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-ink-900">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Contacto */}
                {(selected.telefono || selected.disponibilidad || selected.pretensionSalarial) && (
                  <div className="bg-surface-bg rounded-xl p-4 border border-surface-border space-y-1.5">
                    {selected.telefono && (
                      <p className="text-sm text-ink-700 flex items-center gap-2"><Phone size={13} className="text-ink-300" /> {selected.telefono}</p>
                    )}
                    {selected.disponibilidad && (
                      <p className="text-sm text-ink-700">📅 Disponibilidad: <span className="font-medium">{selected.disponibilidad}</span></p>
                    )}
                    {selected.pretensionSalarial && (
                      <p className="text-sm text-ink-700">💰 Pretensión: <span className="font-medium">${selected.pretensionSalarial.toLocaleString()}</span></p>
                    )}
                  </div>
                )}

                {/* Resumen */}
                {selected.resumen && (
                  <div>
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">Resumen</h4>
                    <p className="text-sm text-ink-700 leading-relaxed">{selected.resumen}</p>
                  </div>
                )}

                {/* Habilidades */}
                {selected.habilidades.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">Habilidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.habilidades.map(h => (
                        <span key={h.id} className={`text-xs px-2.5 py-1 rounded-full ${nivelColor(h.nivel)}`}>
                          {h.habilidad} · {h.nivel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Referencias */}
                {selected.referencias?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-ink-900 mb-2">Referencias <span className="text-xs font-normal text-ink-400">(verificar durante la entrevista)</span></h4>
                    <div className="space-y-2">
                      {selected.referencias.map(r => (
                        <div key={r.id} className={`flex items-start justify-between p-3 rounded-xl border ${r.verificado ? 'bg-accent-50 border-accent-200' : 'bg-surface-bg border-surface-border'}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink-900">{r.nombre}</p>
                            <p className="text-xs text-ink-500">{r.cargo} · {r.empresa}</p>
                            {r.email && <p className="text-xs text-ink-400">{r.email}</p>}
                            {r.telefono && <p className="text-xs text-ink-400">{r.telefono}</p>}
                          </div>
                          <button
                            onClick={() => toggleVerificarReferencia(selected.id, r.id)}
                            className={`ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                              r.verificado
                                ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                                : 'bg-surface-border text-ink-500 hover:bg-ink-100'
                            }`}>
                            {r.verificado
                              ? <><CheckCircle size={13} /> Verificada</>
                              : <><Circle size={13} /> Verificar</>
                            }
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-light p-12 flex flex-col items-center justify-center text-center">
                <Users size={40} className="text-ink-300 mb-4" />
                <p className="text-ink-500">Selecciona un candidato para ver su perfil</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
