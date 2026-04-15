import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Briefcase, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/shared/services/api';

interface Props { onNavigate: (path: string) => void; }

interface Empresa {
  id:          number;
  nombre:      string;
  sector:      string | null;
  tamano:      string | null;
  ciudad:      string | null;
  verificada:  boolean;
  planActivo:  string;
  createdAt:   string;
  usuario:     { email: string; estado: string };
  _count:      { vacantes: number };
}

export const EmpresasPage: React.FC<Props> = () => {
  const [empresas,  setEmpresas]  = useState<Empresa[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [buscar,    setBuscar]    = useState('');
  const [toggling,  setToggling]  = useState<number | null>(null);

  const cargar = async (q: string) => {
    setLoading(true);
    setError('');
    try {
      const params = q ? `?buscar=${encodeURIComponent(q)}` : '';
      const data = await apiFetch<Empresa[]>(`/api/empresas${params}`);
      setEmpresas(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda automática con debounce
  useEffect(() => {
    const t = setTimeout(() => cargar(buscar), 400);
    return () => clearTimeout(t);
  }, [buscar]);

  const toggleVerificada = async (id: number) => {
    setToggling(id);
    try {
      await apiFetch(`/api/empresas/${id}/verificar`, { method: 'PATCH' });
      setEmpresas(prev => prev.map(e => e.id === id ? { ...e, verificada: !e.verificada } : e));
    } catch (e: any) {
      alert(e.message ?? 'Error al verificar');
    } finally {
      setToggling(null);
    }
  };

  const planBadge = (plan: string) =>
    plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
    plan === 'PRO'        ? 'bg-primary-100 text-primary-700 border border-primary-200' :
                            'bg-surface-bg text-ink-500 border border-surface-border';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Empresas registradas</h1>
          <p className="text-ink-500 text-sm mt-1">{empresas.length} empresas en la plataforma</p>
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
          placeholder="Buscar por nombre o sector..."
          className="w-full bg-white border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-ink-900 placeholder-ink-300 text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Estado */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="card-light p-4 border-l-4 border-red-400 text-red-600 text-sm">{error}</div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="card-light overflow-hidden">
          {empresas.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 size={40} className="text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500">No se encontraron empresas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-bg border-b border-surface-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Empresa</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Sector / Ciudad</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Plan</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Vacantes</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Estado</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Verificada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {empresas.map(e => (
                    <tr key={e.id} className="hover:bg-surface-bg transition-colors">
                      {/* Empresa */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {e.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-ink-900">{e.nombre}</p>
                            <p className="text-xs text-ink-500">{e.usuario.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Sector / Ciudad */}
                      <td className="px-5 py-4">
                        <p className="text-ink-700">{e.sector ?? '—'}</p>
                        {e.ciudad && (
                          <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {e.ciudad}
                          </p>
                        )}
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${planBadge(e.planActivo)}`}>
                          {e.planActivo}
                        </span>
                      </td>

                      {/* Vacantes */}
                      <td className="px-5 py-4 text-center">
                        <span className="flex items-center justify-center gap-1 text-ink-700">
                          <Briefcase size={13} className="text-ink-300" />
                          {e._count.vacantes}
                        </span>
                      </td>

                      {/* Estado usuario */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          e.usuario.estado === 'ACTIVO'
                            ? 'bg-accent-100 text-accent-700 border border-accent-200'
                            : 'bg-red-100 text-red-600 border border-red-200'
                        }`}>
                          {e.usuario.estado}
                        </span>
                      </td>

                      {/* Verificada toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => toggleVerificada(e.id)}
                          disabled={toggling === e.id}
                          title={e.verificada ? 'Quitar verificación' : 'Verificar empresa'}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
                        >
                          {toggling === e.id
                            ? <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            : e.verificada
                              ? <CheckCircle2 size={20} className="text-accent-500" />
                              : <XCircle size={20} className="text-ink-300 hover:text-red-400" />
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
