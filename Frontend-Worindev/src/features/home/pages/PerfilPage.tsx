import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserCircle, Phone, MapPin, Edit3, Save, X, Briefcase, FileText, Link as LinkIcon, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

interface Perfil {
  nombre: string;
  apellido?: string;
  telefono?: string;
  ciudad?: string;
  foto?: string;
  nivelEducacion?: string;
  tituloObtenido?: string;
  anosExperiencia?: string;
  pretensionSalarial?: number;
  disponibilidad?: string;
  modalidadPreferida?: string;
  resumen?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  // Campos de empresa
  rut?: string;
  sector?: string;
  tamano?: string;
  descripcion?: string;
  logoUrl?: string;
  sitioWeb?: string;
  cultura?: string;
  verificada?: boolean;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const PerfilPage: React.FC<Props> = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [form, setForm] = useState<Perfil>({
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    nivelEducacion: '',
    tituloObtenido: '',
    anosExperiencia: '',
    pretensionSalarial: undefined,
    disponibilidad: '',
    modalidadPreferida: '',
    resumen: '',
    linkedinUrl: '',
    githubUrl: '',
    // Campos de empresa
    rut: '',
    sector: '',
    tamano: '',
    descripcion: '',
    logoUrl: '',
    sitioWeb: '',
    cultura: '',
    verificada: false,
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('wrd_token');
      
      // Si es ADMIN, mostrar perfil básico del usuario
      if (user?.role === 'ADMIN') {
        setPerfil({
          nombre: 'Administrador',
          apellido: 'Sistema',
          resumen: 'Usuario administrador del sistema Worindev',
        });
        setForm({
          nombre: 'Administrador',
          apellido: 'Sistema',
          resumen: 'Usuario administrador del sistema Worindev',
        });
        setLoading(false);
        return;
      }
      
      // Si es EMPRESA, cargar perfil de empresa
      if (user?.role === 'EMPRESA') {
        const res = await fetch(`${API}/api/empresas/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al cargar perfil de empresa');
        const data = await res.json();
        
        setPerfil(data);
        setPerfilId(data.id ?? null);
        setForm({
          nombre: data.nombre || '',
          rut: data.rut || '',
          sector: data.sector || '',
          tamano: data.tamano || '',
          ciudad: data.ciudad || '',
          descripcion: data.descripcion || '',
          logoUrl: data.logoUrl || '',
          sitioWeb: data.sitioWeb || '',
          cultura: data.cultura || '',
          verificada: data.verificada || false,
        });
        setLoading(false);
        return;
      }
      
      // Si es CANDIDATO, cargar perfil de candidato
      const res = await fetch(`${API}/api/candidatos/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar perfil');
      const data = await res.json();
      
      // Calcular años de experiencia total desde experiencias
      let anosExperienciaTotal = 0;
      if (data.experiencias && data.experiencias.length > 0) {
        data.experiencias.forEach((exp: any) => {
          const inicio = new Date(exp.fechaInicio);
          const fin = exp.actual ? new Date() : new Date(exp.fechaFin);
          const anos = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          anosExperienciaTotal += Math.max(0, anos);
        });
      }
      
      // Obtener nivel más alto de educación desde educaciones
      const nivelesOrden: Record<string, number> = {
        'BACHILLER': 1, 'Bachiller': 1,
        'TECNICO': 2,   'Técnico': 2,
        'TECNOLOGO': 3, 'Tecnólogo': 3,
        'PROFESIONAL': 4, 'Profesional': 4,
        'ESPECIALIZACION': 5, 'Especialización': 5,
        'MAESTRIA': 6,  'Maestría': 6,
        'DOCTORADO': 7, 'Doctorado': 7,
        'CURSO': 0,     'Curso': 0,
      };

      const nivelDisplay: Record<string, string> = {
        'BACHILLER': 'Bachiller', 'TECNICO': 'Técnico', 'TECNOLOGO': 'Tecnólogo',
        'PROFESIONAL': 'Profesional', 'ESPECIALIZACION': 'Especialización',
        'MAESTRIA': 'Maestría', 'DOCTORADO': 'Doctorado', 'CURSO': 'Curso',
      };
      
      let nivelMasAlto = '';
      let maxNivel = 0;
      if (data.educaciones && data.educaciones.length > 0) {
        data.educaciones.forEach((edu: any) => {
          const nivel = nivelesOrden[edu.nivel] || 0;
          if (nivel > maxNivel) {
            maxNivel = nivel;
            nivelMasAlto = nivelDisplay[edu.nivel] || edu.nivel;
          }
        });
      }
      
      // Obtener títulos obtenidos desde educaciones
      const titulos = data.educaciones
        ?.map((edu: any) => edu.titulo)
        .filter((t: string) => t)
        .join(', ') || '';
      
      setPerfil(data);
      setPerfilId(data.id ?? null);
      setForm({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        telefono: data.telefono || '',
        ciudad: data.ciudad || '',
        nivelEducacion: nivelMasAlto || nivelDisplay[data.nivelEducacion] || data.nivelEducacion || '',
        tituloObtenido: titulos || data.tituloObtenido || '',
        anosExperiencia: anosExperienciaTotal > 0 ? anosExperienciaTotal.toFixed(1) : (data.anosExperiencia ? String(data.anosExperiencia) : '0'),
        pretensionSalarial: data.pretensionSalarial || undefined,
        disponibilidad: data.disponibilidad || '',
        modalidadPreferida: (['PRESENCIAL','REMOTO','HIBRIDO'].includes(data.modalidadPreferida) ? data.modalidadPreferida : ''),
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
    if (user?.role === 'ADMIN') {
      toast.error('Los administradores no pueden editar su perfil desde esta página');
      setEditing(false);
      return;
    }
    if (!form.nombre) { toast.error('El nombre es requerido'); return; }
    if (user?.role === 'CANDIDATO' && !form.apellido) { toast.error('Nombre y apellido son requeridos'); return; }

    setSaving(true);
    try {
      const token = localStorage.getItem('wrd_token');

      if (user?.role === 'EMPRESA') {
        const endpoint = `${API}/api/empresas/${perfilId}`;
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            nombre: form.nombre, rut: form.rut, sector: form.sector,
            tamano: form.tamano, ciudad: form.ciudad, descripcion: form.descripcion,
            logoUrl: form.logoUrl, sitioWeb: form.sitioWeb, cultura: form.cultura,
          }),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Error al guardar'); }
      } else {
        // Candidato: convertir nivelEducacion y modalidadPreferida a formato BD
        const NIVEL_TO_DB: Record<string, string> = {
          'Bachiller': 'BACHILLER', 'Técnico': 'TECNICO', 'Tecnólogo': 'TECNOLOGO',
          'Profesional': 'PROFESIONAL', 'Especialización': 'ESPECIALIZACION',
          'Maestría': 'MAESTRIA', 'Doctorado': 'DOCTORADO',
        };
        const VALID_MODALIDAD = ['PRESENCIAL', 'REMOTO', 'HIBRIDO'];
        const endpoint = `${API}/api/candidatos/${perfilId}`;
        const payload = {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono || null,
          ciudad: form.ciudad || null,
          pretensionSalarial: form.pretensionSalarial ? Math.round(Number(form.pretensionSalarial)) : null,
          disponibilidad: form.disponibilidad || null,
          modalidadPreferida: VALID_MODALIDAD.includes(form.modalidadPreferida || '') ? form.modalidadPreferida : null,
          resumen: form.resumen || null,
          linkedinUrl: form.linkedinUrl || null,
          githubUrl: form.githubUrl || null,
        };
        console.log('Enviando payload:', JSON.stringify(payload));
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const e = await res.json();
          console.error('Error respuesta:', e);
          throw new Error(e.message || 'Error al guardar');
        }
      }

      toast.success('Perfil actualizado correctamente');
      setEditing(false);
      cargarPerfil();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar perfil');
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

  const initials = user?.role === 'EMPRESA' 
    ? form.nombre.substring(0, 2).toUpperCase()
    : `${form.nombre?.charAt(0) || ''}${form.apellido?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-ink-900">Mi Perfil</h1>
        {user?.role !== 'ADMIN' && (
          !editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 text-sm font-semibold transition-all">
              <Edit3 size={16} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm font-semibold transition-all disabled:opacity-50">
                <Save size={16} /> Guardar
              </button>
              <button onClick={() => { setEditing(false); setForm(perfil!); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-border text-ink-700 hover:bg-surface-border/80 text-sm transition-all">
                <X size={16} /> Cancelar
              </button>
            </div>
          )
        )}
      </div>

      {/* Avatar + info */}
      <div className="card-light p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink-900">
              {user?.role === 'EMPRESA' ? form.nombre : `${form.nombre} ${form.apellido || ''}`}
            </h2>
            <p className="text-ink-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200">
                {user?.role}
              </span>
              {user?.role === 'EMPRESA' && form.verificada && (
                <span className="inline-block px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold border border-accent-200">
                  ✓ Verificada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información según rol */}
      {user?.role === 'EMPRESA' ? (
        <>
          {/* Información de Empresa */}
          <div className="card-light p-6">
            <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <UserCircle size={18} /> Información de la Empresa
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'nombre', label: 'Nombre de la Empresa', type: 'text', required: true },
                { key: 'rut', label: 'RUT', type: 'text' },
                { key: 'sector', label: 'Sector', type: 'text' },
                { key: 'tamano', label: 'Tamaño', type: 'select', options: ['1-10', '11-50', '51-200', '200+'] },
                { key: 'ciudad', label: 'Ciudad', type: 'text', icon: MapPin },
                { key: 'sitioWeb', label: 'Sitio Web', type: 'url' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
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

          {/* Descripción */}
          <div className="card-light p-6">
            <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <FileText size={18} /> Descripción de la Empresa
            </h3>
            {editing ? (
              <textarea
                value={form.descripcion || ''}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Describe tu empresa, su misión, visión y valores..."
                className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                rows={5}
              />
            ) : (
              <p className="text-ink-900 text-sm py-3 px-3 bg-surface-bg rounded-lg border border-surface-border whitespace-pre-wrap">
                {form.descripcion || '—'}
              </p>
            )}
          </div>

          {/* Cultura */}
          <div className="card-light p-6">
            <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <Award size={18} /> Cultura Organizacional
            </h3>
            {editing ? (
              <textarea
                value={form.cultura || ''}
                onChange={e => setForm(p => ({ ...p, cultura: e.target.value }))}
                placeholder="Describe la cultura de tu empresa, ambiente laboral, beneficios..."
                className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                rows={4}
              />
            ) : (
              <p className="text-ink-900 text-sm py-3 px-3 bg-surface-bg rounded-lg border border-surface-border whitespace-pre-wrap">
                {form.cultura || '—'}
              </p>
            )}
          </div>
        </>
      ) : user?.role === 'CANDIDATO' ? (
        <>
          {/* Información Personal de Candidato */}
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
                { key: 'disponibilidad', label: 'Disponibilidad', type: 'select', options: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
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
              {/* Solo lectura — calculados desde currículum */}
              {[
                { key: 'anosExperiencia', label: 'Años de experiencia' },
                { key: 'nivelEducacion',  label: 'Nivel de educación' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    {f.label} <span className="text-xs font-normal text-ink-400">(desde currículum)</span>
                  </label>
                  <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                    {(form as any)[f.key] || '—'}
                  </p>
                </div>
              ))}

              {/* Editables */}
              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Pretensión salarial (COP)
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={(form as any).pretensionSalarial || ''}
                    onChange={e => setForm(p => ({ ...p, pretensionSalarial: e.target.value as any }))}
                    placeholder="3000000"
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                    {form.pretensionSalarial ? `$${Number(form.pretensionSalarial).toLocaleString()}` : '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Modalidad preferida
                </label>
                {editing ? (
                  <select
                    value={(form as any).modalidadPreferida || ''}
                    onChange={e => setForm(p => ({ ...p, modalidadPreferida: e.target.value }))}
                    className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Selecciona...</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                ) : (
                  <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                    {({'PRESENCIAL':'Presencial','REMOTO':'Remoto','HIBRIDO':'Híbrido'} as any)[(form as any).modalidadPreferida] || (form as any).modalidadPreferida || '—'}
                  </p>
                )}
              </div>
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
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
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
              <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                Títulos <span className="text-xs font-normal text-ink-400">(Desde tu currículum)</span>
              </label>
              <p className="text-ink-900 text-sm py-3 px-3 bg-surface-bg rounded-lg border border-surface-border whitespace-pre-wrap">
                {form.tituloObtenido || '—'}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Perfil de Administrador */
        <div className="card-light p-6">
          <h3 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
            <UserCircle size={18} /> Información del Administrador
          </h3>
          <p className="text-ink-700 text-sm">{form.resumen}</p>
        </div>
      )}
    </div>
  );
};
