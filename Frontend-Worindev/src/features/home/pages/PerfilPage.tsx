import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserCircle, Phone, MapPin, Edit3, Save, X, Briefcase, FileText, Link as LinkIcon, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

interface Perfil {
  nombre: string;
  apellido: string;
  telefono?: string;
  ciudad?: string;
  departamento?: string;
  foto?: string;
  nivelEducacion?: string;
  tituloObtenido?: string;
  anosExperiencia: number;
  pretensionSalarial?: number;
  disponibilidad?: string;
  modalidadPreferida?: string;
  resumen?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const PerfilPage: React.FC<Props> = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState<Perfil>({
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    departamento: '',
    nivelEducacion: '',
    tituloObtenido: '',
    anosExperiencia: 0,
    pretensionSalarial: undefined,
    disponibilidad: '',
    modalidadPreferida: '',
    resumen: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar perfil');
      const data = await res.json();
      
      // Calcular años de experiencia total
      let anosExperienciaTotal = 0;
      if (data.experiencias && data.experiencias.length > 0) {
        data.experiencias.forEach((exp: any) => {
          const inicio = new Date(exp.fechaInicio);
          const fin = exp.actual ? new Date() : new Date(exp.fechaFin);
          const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          anosExperienciaTotal += anos;
        });
      }
      
      // Obtener nivel más alto de educación
      const nivelesOrden: Record<string, number> = {
        'BACHILLER': 1,
        'TECNICO': 2,
        'TECNOLOGO': 3,
        'PROFESIONAL': 4,
        'ESPECIALIZACION': 5,
        'MAESTRIA': 6,
        'DOCTORADO': 7,
      };
      
      let nivelMasAlto = '';
      let maxNivel = 0;
      if (data.educaciones && data.educaciones.length > 0) {
        data.educaciones.forEach((edu: any) => {
          const nivel = nivelesOrden[edu.nivel] || 0;
          if (nivel > maxNivel) {
            maxNivel = nivel;
            nivelMasAlto = edu.nivel;
          }
        });
      }
      
      // Obtener títulos obtenidos
      const titulos = data.educaciones
        ?.map((edu: any) => edu.titulo)
        .filter((t: string) => t)
        .join(', ') || '';
      
      setPerfil(data);
      setForm({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        telefono: data.telefono || '',
        ciudad: data.ciudad || '',
        departamento: data.departamento || '',
        nivelEducacion: nivelMasAlto || data.nivelEducacion || '',
        tituloObtenido: titulos || data.tituloObtenido || '',
        anosExperiencia: Math.round(anosExperienciaTotal * 10) / 10 || data.anosExperiencia || 0,
        pretensionSalarial: data.pretensionSalarial || undefined,
        disponibilidad: data.disponibilidad || '',
        modalidadPreferida: data.modalidadPreferida || '',
        resumen: data.resumen || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
      });
    } catch (error) {
      toast.error('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.nombre || !form.apellido) {
      toast.error('Nombre y apellido son requeridos');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${perfil?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al guardar');
      toast.success('Perfil actualizado correctamente');
      setEditing(false);
      cargarPerfil();
    } catch (error) {
      toast.error('Error al guardar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-border rounded w-1/3" />
          <div className="h-4 bg-surface-border rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!perfil) return null;

  const initials = `${form.nombre.charAt(0)}${form.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-ink-900">Mi Perfil</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-sm font-semibold transition-all">
            <Edit3 size={16} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm font-semibold transition-all disabled:opacity-50">
              <Save size={16} /> Guardar
            </button>
            <button onClick={() => { setEditing(false); setForm(perfil); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-border text-ink-700 hover:bg-surface-border/80 text-sm transition-all">
              <X size={16} /> Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Avatar + info */}
      <div className="card-light p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-900">{form.nombre} {form.apellido}</h2>
            <p className="text-ink-500 text-sm">{user?.email}</p>
            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div className="card-light p-6">
        <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <UserCircle size={18} /> Información Personal
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'nombre', label: 'Nombre', type: 'text', required: true },
            { key: 'apellido', label: 'Apellido', type: 'text', required: true },
            { key: 'telefono', label: 'Teléfono', type: 'tel', icon: Phone },
            { key: 'ciudad', label: 'Ciudad', type: 'text', icon: MapPin },
            { key: 'departamento', label: 'Departamento', type: 'text' },
            { key: 'disponibilidad', label: 'Disponibilidad', type: 'select', options: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'] },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              {editing ? (
                f.type === 'select' ? (
                  <select
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Selecciona...</option>
                    {(f.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                )
              ) : (
                <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                  {(form as any)[f.key] || '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Información Profesional */}
      <div className="card-light p-6">
        <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <Briefcase size={18} /> Información Profesional
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'anosExperiencia', label: 'Años de Experiencia', type: 'number', readOnly: true, hint: 'Calculado desde tu currículum' },
            { key: 'pretensionSalarial', label: 'Pretensión Salarial', type: 'number' },
            { key: 'nivelEducacion', label: 'Nivel de Educación', type: 'select', options: ['BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO'], readOnly: true, hint: 'Nivel más alto de tu currículum' },
            { key: 'modalidadPreferida', label: 'Modalidad Preferida', type: 'select', options: ['PRESENCIAL', 'REMOTO', 'HIBRIDO'] },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                {f.label}
                {(f as any).hint && <span className="text-xs font-normal text-ink-400 ml-1">({(f as any).hint})</span>}
              </label>
              {editing && !(f as any).readOnly ? (
                f.type === 'select' ? (
                  <select
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Selecciona...</option>
                    {(f.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                )
              ) : (
                <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                  {f.type === 'number' && (form as any)[f.key] ? `${(form as any)[f.key]} ${f.key === 'anosExperiencia' ? 'años' : ''}` : (form as any)[f.key] || '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen Profesional */}
      <div className="card-light p-6">
        <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <FileText size={18} /> Resumen Profesional
        </h3>
        {editing ? (
          <textarea
            value={form.resumen || ''}
            onChange={e => setForm(p => ({ ...p, resumen: e.target.value }))}
            placeholder="Cuéntanos sobre ti, tu experiencia y tus objetivos profesionales..."
            className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            rows={5}
          />
        ) : (
          <p className="text-ink-900 text-sm py-3 px-3 bg-surface-bg rounded-lg border border-surface-border whitespace-pre-wrap">
            {form.resumen || '—'}
          </p>
        )}
      </div>

      {/* Enlaces */}
      <div className="card-light p-6">
        <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <LinkIcon size={18} /> Enlaces Profesionales
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
            { key: 'githubUrl', label: 'GitHub', placeholder: 'https://github.com/...' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
                {f.label}
              </label>
              {editing ? (
                <input
                  type="url"
                  value={(form as any)[f.key] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              ) : (
                <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                  {(form as any)[f.key] ? (
                    <a href={(form as any)[f.key]} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {(form as any)[f.key]}
                    </a>
                  ) : (
                    '—'
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Título Obtenido */}
      <div className="card-light p-6">
        <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
          <Award size={18} /> Títulos Obtenidos
        </h3>
        <div>
          <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
            Títulos <span className="text-xs font-normal text-ink-400">(Desde tu currículum)</span>
          </label>
          <p className="text-ink-900 text-sm py-3 px-3 bg-surface-bg rounded-lg border border-surface-border whitespace-pre-wrap">
            {form.tituloObtenido || '—'}
          </p>
        </div>
      </div>
    </div>
  );
};
