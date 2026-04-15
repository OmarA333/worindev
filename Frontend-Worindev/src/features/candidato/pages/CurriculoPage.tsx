import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Upload, FileText, Phone, MapPin, DollarSign, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  ciudad?: string;
  departamento?: string;
  pretensionSalarial?: number;
  disponibilidad?: string;
  modalidadPreferida?: string;
  cvUrl?: string;
  habilidades: Array<{ id: number; habilidad: string; nivel: string }>;
  experiencias: Array<{ id: number; empresa: string; cargo: string; descripcion?: string; fechaInicio: string; fechaFin?: string; actual: boolean }>;
  educaciones: Array<{ id: number; institucion: string; titulo: string; nivel: string; fechaInicio: string; fechaFin?: string; actual: boolean }>;
  referencias: Array<{ id: number; nombre: string; cargo: string; empresa: string; email: string; telefono?: string; verificado: boolean }>;
}

export const CurriculoPage: React.FC<Props> = () => {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'educacion' | 'experiencia' | 'referencias' | 'habilidades'>('personal');

  useEffect(() => {
    cargarCandidato();
  }, []);

  const cargarCandidato = async () => {
    try {
      const token = localStorage.getItem('wrd_token');
      console.log('Token:', token ? 'presente' : 'ausente');
      console.log('API URL:', API);

      const res = await fetch(`${API}/api/candidatos/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const error = await res.text();
        console.error('Error response:', error);
        throw new Error(`Error al cargar perfil: ${res.status}`);
      }

      const data = await res.json();
      console.log('Candidato cargado:', data);
      setCandidato(data);
    } catch (error) {
      console.error('Error completo:', error);
      toast.error(`Error al cargar perfil: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-border rounded w-1/3" />
          <div className="h-4 bg-surface-border rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!candidato) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-ink-900">Mi Currículum</h1>
        <p className="text-ink-500 text-sm mt-1">Completa tu información para mejorar tu match score</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-surface-border overflow-x-auto">
        {[
          { id: 'personal', label: '👤 Personal', icon: '👤' },
          { id: 'educacion', label: '🎓 Educación', icon: '🎓' },
          { id: 'experiencia', label: '💼 Experiencia', icon: '💼' },
          { id: 'referencias', label: '✅ Referencias', icon: '✅' },
          { id: 'habilidades', label: '⭐ Habilidades', icon: '⭐' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card-light p-6">
        {activeTab === 'personal' && <PersonalSection candidato={candidato} onUpdate={cargarCandidato} />}
        {activeTab === 'educacion' && <EducacionSection candidato={candidato} onUpdate={cargarCandidato} />}
        {activeTab === 'experiencia' && <ExperienciaSection candidato={candidato} onUpdate={cargarCandidato} />}
        {activeTab === 'referencias' && <ReferenciasSection candidato={candidato} onUpdate={cargarCandidato} />}
        {activeTab === 'habilidades' && <HabilidadesSection candidato={candidato} onUpdate={cargarCandidato} />}
      </div>
    </div>
  );
};

// Secciones
const PersonalSection: React.FC<{ candidato: Candidato; onUpdate: () => void }> = ({ candidato, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: candidato.nombre,
    apellido: candidato.apellido,
    telefono: candidato.telefono || '',
    ciudad: candidato.ciudad || '',
    departamento: candidato.departamento || '',
    pretensionSalarial: candidato.pretensionSalarial || '',
    disponibilidad: candidato.disponibilidad || '',
    modalidadPreferida: candidato.modalidadPreferida || '',
    cvUrl: candidato.cvUrl || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      toast.success('Perfil actualizado');
      setEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink-900">Información Personal</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
            <Edit3 size={14} /> Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={loading} className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
              Guardar
            </button>
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm bg-surface-border text-ink-700 rounded-lg hover:bg-surface-border/80">
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { key: 'nombre', label: 'Nombre', type: 'text' },
          { key: 'apellido', label: 'Apellido', type: 'text' },
          { key: 'telefono', label: 'Teléfono', type: 'tel', icon: Phone },
          { key: 'ciudad', label: 'Ciudad', type: 'text', icon: MapPin },
          { key: 'departamento', label: 'Departamento', type: 'text' },
          { key: 'pretensionSalarial', label: 'Sueldo Esperado', type: 'number', icon: DollarSign },
          { key: 'disponibilidad', label: 'Disponibilidad', type: 'select', options: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'] },
          { key: 'modalidadPreferida', label: 'Modalidad', type: 'select', options: ['PRESENCIAL', 'REMOTO', 'HIBRIDO'] },
        ].map(field => (
          <div key={field.key}>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">
              {field.label}
            </label>
            {editing ? (
              field.type === 'select' ? (
                <select
                  value={(form as any)[field.key]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-ink-900 text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Selecciona...</option>
                  {(field.options || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-ink-900 text-sm focus:outline-none focus:border-primary-500"
                />
              )
            ) : (
              <p className="text-ink-900 text-sm py-2 px-3 bg-surface-bg rounded-lg border border-surface-border">
                {(form as any)[field.key] || '—'}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CV Upload */}
      <div>
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2 block">
          <FileText size={14} className="inline mr-1" /> Currículum (PDF)
        </label>
        <CVUpload candidatoId={candidato.id} currentCV={candidato.cvUrl} onUpload={onUpdate} />
      </div>
    </div>
  );
};

const EducacionSection: React.FC<{ candidato: Candidato; onUpdate: () => void }> = ({ candidato, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ institucion: '', titulo: '', nivel: '', fechaInicio: '', fechaFin: '', actual: false, archivo: null as File | null });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ institucion: '', titulo: '', nivel: '', fechaInicio: '', fechaFin: '', actual: false, archivo: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setForm({
      institucion: edu.institucion,
      titulo: edu.titulo,
      nivel: edu.nivel,
      fechaInicio: edu.fechaInicio?.split('T')[0] || '',
      fechaFin: edu.fechaFin?.split('T')[0] || '',
      actual: edu.actual,
      archivo: null,
    });
    setShowForm(true);
  };

  const handleAdd = async () => {
    if (!form.institucion || !form.titulo || !form.nivel || !form.fechaInicio) {
      toast.error('Completa los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      let archivoUrl = null;

      // Subir archivo si existe
      if (form.archivo) {
        if (form.archivo.type !== 'application/pdf') {
          toast.error('Solo se permiten archivos PDF');
          setLoading(false);
          return;
        }
        if (form.archivo.size > 5 * 1024 * 1024) {
          toast.error('El archivo no debe exceder 5MB');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('cv', form.archivo);
        const uploadRes = await fetch(`${API}/api/candidatos/${candidato.id}/cv`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          archivoUrl = uploadData.cvUrl;
        }
      }

      const url = editingId 
        ? `${API}/api/candidatos/${candidato.id}/educaciones/${editingId}`
        : `${API}/api/candidatos/${candidato.id}/educaciones`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          institucion: form.institucion,
          titulo: form.titulo,
          nivel: form.nivel,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin || null,
          actual: form.actual,
          archivoUrl,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al guardar');
      }
      toast.success(editingId ? 'Educación actualizada' : 'Educación agregada');
      resetForm();
      // Esperar un poco para que la BD se actualice
      setTimeout(() => onUpdate(), 500);
    } catch (error) {
      console.error('Error al agregar educación:', error);
      toast.error(error instanceof Error ? error.message : 'Error al agregar educación');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eduId: number) => {
    if (!confirm('¿Eliminar esta educación?')) return;
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}/educaciones/${eduId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Educación eliminada');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold">
          <Plus size={16} /> Agregar Educación
        </button>
      ) : (
        <div className="p-4 border border-surface-border rounded-lg space-y-3">
          <input type="text" placeholder="Institución" value={form.institucion} onChange={e => setForm(p => ({ ...p, institucion: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Título" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <select value={form.nivel} onChange={e => setForm(p => ({ ...p, nivel: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm">
            <option value="">Nivel</option>
            <option value="BACHILLER">Bachiller</option>
            <option value="TECNICO">Técnico</option>
            <option value="TECNOLOGO">Tecnólogo</option>
            <option value="PROFESIONAL">Profesional</option>
            <option value="ESPECIALIZACION">Especialización</option>
            <option value="MAESTRIA">Maestría</option>
            <option value="DOCTORADO">Doctorado</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Fecha de Inicio</label>
              <input type="date" value={form.fechaInicio} onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Fecha de Finalización</label>
              <input type="date" value={form.fechaFin} onChange={e => setForm(p => ({ ...p, fechaFin: e.target.value }))} disabled={form.actual} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.actual} onChange={e => setForm(p => ({ ...p, actual: e.target.checked, fechaFin: '' }))} />
            Actualmente estudiando
          </label>
          <div>
            <label className="text-xs text-ink-500 mb-1 block">Archivo (PDF - Diploma, Certificado, etc)</label>
            <input type="file" accept=".pdf" onChange={e => setForm(p => ({ ...p, archivo: e.target.files?.[0] || null }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            {form.archivo && <p className="text-xs text-green-600 mt-1">✓ {form.archivo.name}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading} className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold disabled:opacity-50">
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>
            <button onClick={resetForm} className="flex-1 px-3 py-2 bg-surface-border text-ink-700 rounded-lg text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
      {candidato.educaciones.map(edu => (
        <div key={edu.id} className="p-4 border border-surface-border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-ink-900">{edu.titulo}</h4>
                <p className="text-sm text-ink-600">{edu.institucion}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Nivel:</span>
                  <p className="text-ink-900 font-medium">{edu.nivel}</p>
                </div>
                <div>
                  <span className="text-ink-500">Estado:</span>
                  <p className="text-ink-900 font-medium">{(edu as any).actual ? 'Actualmente estudiando' : 'Completado'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Fecha de Inicio:</span>
                  <p className="text-ink-900 font-medium">{new Date((edu as any).fechaInicio).toLocaleDateString('es-CO')}</p>
                </div>
                {(edu as any).fechaFin && (
                  <div>
                    <span className="text-ink-500">Fecha de Finalización:</span>
                    <p className="text-ink-900 font-medium">{new Date((edu as any).fechaFin).toLocaleDateString('es-CO')}</p>
                  </div>
                )}
              </div>
              {(edu as any).archivoUrl && (
                <a href={(edu as any).archivoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline inline-block mt-2">
                  📄 Ver archivo
                </a>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => handleEdit(edu)} className="text-blue-500 hover:text-blue-700">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(edu.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ExperienciaSection: React.FC<{ candidato: Candidato; onUpdate: () => void }> = ({ candidato, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empresa: '', cargo: '', descripcion: '', fechaInicio: '', fechaFin: '', actual: false, archivo: null as File | null });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.empresa || !form.cargo || !form.fechaInicio) {
      toast.error('Completa los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      let archivoUrl = null;

      // Subir archivo si existe
      if (form.archivo) {
        if (form.archivo.type !== 'application/pdf') {
          toast.error('Solo se permiten archivos PDF');
          setLoading(false);
          return;
        }
        if (form.archivo.size > 5 * 1024 * 1024) {
          toast.error('El archivo no debe exceder 5MB');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('cv', form.archivo);
        const uploadRes = await fetch(`${API}/api/candidatos/${candidato.id}/cv`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          archivoUrl = uploadData.cvUrl;
        }
      }

      const res = await fetch(`${API}/api/candidatos/${candidato.id}/experiencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          empresa: form.empresa,
          cargo: form.cargo,
          descripcion: form.descripcion,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin || null,
          actual: form.actual,
          archivoUrl,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al agregar');
      }
      toast.success('Experiencia agregada');
      setForm({ empresa: '', cargo: '', descripcion: '', fechaInicio: '', fechaFin: '', actual: false, archivo: null });
      setShowForm(false);
      // Esperar un poco para que la BD se actualice
      setTimeout(() => onUpdate(), 500);
    } catch (error) {
      toast.error('Error al agregar experiencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expId: number) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}/experiencias/${expId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Experiencia eliminada');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold">
          <Plus size={16} /> Agregar Experiencia
        </button>
      ) : (
        <div className="p-4 border border-surface-border rounded-lg space-y-3">
          <input type="text" placeholder="Empresa" value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Cargo" value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Descripción de funciones" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" rows={3} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Fecha de Inicio</label>
              <input type="date" value={form.fechaInicio} onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Fecha de Finalización</label>
              <input type="date" value={form.fechaFin} onChange={e => setForm(p => ({ ...p, fechaFin: e.target.value }))} disabled={form.actual} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.actual} onChange={e => setForm(p => ({ ...p, actual: e.target.checked, fechaFin: '' }))} />
            Actualmente trabajo aquí
          </label>
          <div>
            <label className="text-xs text-ink-500 mb-1 block">Archivo (PDF - Certificado, Contrato, etc)</label>
            <input type="file" accept=".pdf" onChange={e => setForm(p => ({ ...p, archivo: e.target.files?.[0] || null }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            {form.archivo && <p className="text-xs text-green-600 mt-1">✓ {form.archivo.name}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading} className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold disabled:opacity-50">
              Guardar
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 px-3 py-2 bg-surface-border text-ink-700 rounded-lg text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
      {candidato.experiencias.map(exp => (
        <div key={exp.id} className="p-4 border border-surface-border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-ink-900">{exp.cargo}</h4>
                <p className="text-sm text-ink-600">{exp.empresa}</p>
              </div>
              {exp.descripcion && (
                <div>
                  <span className="text-xs text-ink-500">Descripción:</span>
                  <p className="text-sm text-ink-900">{exp.descripcion}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Estado:</span>
                  <p className="text-ink-900 font-medium">{(exp as any).actual ? 'Actualmente trabajo aquí' : 'Completado'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Fecha de Inicio:</span>
                  <p className="text-ink-900 font-medium">{new Date((exp as any).fechaInicio).toLocaleDateString('es-CO')}</p>
                </div>
                {(exp as any).fechaFin && (
                  <div>
                    <span className="text-ink-500">Fecha de Finalización:</span>
                    <p className="text-ink-900 font-medium">{new Date((exp as any).fechaFin).toLocaleDateString('es-CO')}</p>
                  </div>
                )}
              </div>
              {(exp as any).archivoUrl && (
                <a href={(exp as any).archivoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline inline-block mt-2">
                  📄 Ver archivo
                </a>
              )}
            </div>
            <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700 ml-4">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReferenciasSection: React.FC<{ candidato: Candidato; onUpdate: () => void }> = ({ candidato, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', cargo: '', empresa: '', email: '', telefono: '', archivo: null as File | null });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.nombre || !form.cargo || !form.empresa || !form.email) {
      toast.error('Completa los campos requeridos');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      let archivoUrl = null;

      // Subir archivo si existe
      if (form.archivo) {
        if (form.archivo.type !== 'application/pdf') {
          toast.error('Solo se permiten archivos PDF');
          setLoading(false);
          return;
        }
        if (form.archivo.size > 5 * 1024 * 1024) {
          toast.error('El archivo no debe exceder 5MB');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('cv', form.archivo);
        const uploadRes = await fetch(`${API}/api/candidatos/${candidato.id}/cv`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          archivoUrl = uploadData.cvUrl;
        }
      }

      const res = await fetch(`${API}/api/candidatos/${candidato.id}/referencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nombre: form.nombre,
          cargo: form.cargo,
          empresa: form.empresa,
          email: form.email,
          telefono: form.telefono,
          archivoUrl,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al agregar');
      }
      toast.success('Referencia agregada');
      setForm({ nombre: '', cargo: '', empresa: '', email: '', telefono: '', archivo: null });
      setShowForm(false);
      // Esperar un poco para que la BD se actualice
      setTimeout(() => onUpdate(), 500);
    } catch (error) {
      toast.error('Error al agregar referencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (refId: number) => {
    if (!confirm('¿Eliminar esta referencia?')) return;
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}/referencias/${refId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Referencia eliminada');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold">
          <Plus size={16} /> Agregar Referencia
        </button>
      ) : (
        <div className="p-4 border border-surface-border rounded-lg space-y-3">
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Cargo" value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Empresa" value={form.empresa} onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <input type="tel" placeholder="Teléfono (opcional)" value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <div>
            <label className="text-xs text-ink-500 mb-1 block">Archivo (PDF - Carta de Referencia, etc)</label>
            <input type="file" accept=".pdf" onChange={e => setForm(p => ({ ...p, archivo: e.target.files?.[0] || null }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
            {form.archivo && <p className="text-xs text-green-600 mt-1">✓ {form.archivo.name}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading} className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold disabled:opacity-50">
              Guardar
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 px-3 py-2 bg-surface-border text-ink-700 rounded-lg text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
      {candidato.referencias.map(ref => (
        <div key={ref.id} className="p-4 border border-surface-border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold text-ink-900">{ref.nombre}</h4>
                <p className="text-sm text-ink-600">{ref.cargo} en {ref.empresa}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-500">Email:</span>
                  <p className="text-ink-900 font-medium">{ref.email}</p>
                </div>
                {ref.telefono && (
                  <div>
                    <span className="text-ink-500">Teléfono:</span>
                    <p className="text-ink-900 font-medium">{ref.telefono}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded font-medium ${ref.verificado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {ref.verificado ? '✓ Verificada' : '⏳ Pendiente de verificación'}
                </span>
              </div>
              {(ref as any).archivoUrl && (
                <a href={(ref as any).archivoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline inline-block mt-2">
                  📄 Ver archivo
                </a>
              )}
            </div>
            <button onClick={() => handleDelete(ref.id)} className="text-red-500 hover:text-red-700 ml-4">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const HabilidadesSection: React.FC<{ candidato: Candidato; onUpdate: () => void }> = ({ candidato, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ habilidad: '', nivel: 'INTERMEDIO' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.habilidad) {
      toast.error('Ingresa una habilidad');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}/habilidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          habilidad: form.habilidad,
          nivel: form.nivel,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al agregar');
      }
      toast.success('Habilidad agregada');
      setForm({ habilidad: '', nivel: 'INTERMEDIO' });
      setShowForm(false);
      // Esperar un poco para que la BD se actualice
      setTimeout(() => onUpdate(), 500);
    } catch (error) {
      toast.error('Error al agregar habilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (habId: number) => {
    if (!confirm('¿Eliminar esta habilidad?')) return;
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/candidatos/${candidato.id}/habilidades/${habId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Habilidad eliminada');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold">
          <Plus size={16} /> Agregar Habilidad
        </button>
      ) : (
        <div className="p-4 border border-surface-border rounded-lg space-y-3">
          <input type="text" placeholder="Habilidad (ej: React, Python, Liderazgo)" value={form.habilidad} onChange={e => setForm(p => ({ ...p, habilidad: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm" />
          <select value={form.nivel} onChange={e => setForm(p => ({ ...p, nivel: e.target.value }))} className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm">
            <option value="BASICO">Básico</option>
            <option value="INTERMEDIO">Intermedio</option>
            <option value="AVANZADO">Avanzado</option>
            <option value="EXPERTO">Experto</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading} className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-semibold disabled:opacity-50">
              Guardar
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 px-3 py-2 bg-surface-border text-ink-700 rounded-lg text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {candidato.habilidades.map(hab => (
          <div key={hab.id} className="px-4 py-2 rounded-lg bg-primary-50 border border-primary-200 text-sm flex items-center gap-3 group hover:bg-primary-100 transition-colors">
            <div className="flex-1">
              <p className="font-semibold text-primary-900">{hab.habilidad}</p>
              <p className="text-xs text-primary-600">{hab.nivel}</p>
            </div>
            <button onClick={() => handleDelete(hab.id)} className="text-primary-600 hover:text-primary-800 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const CVUpload: React.FC<{ candidatoId: number; currentCV?: string; onUpload: () => void }> = ({ candidatoId, currentCV, onUpload }) => {
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe exceder 5MB');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      const formData = new FormData();
      formData.append('cv', file);

      const res = await fetch(`${API}/api/candidatos/${candidatoId}/cv`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir CV');
      toast.success('CV subido exitosamente');
      onUpload();
    } catch (error) {
      toast.error('Error al subir CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-surface-border rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer hover:bg-primary-50/5">
        <Upload size={24} className="mx-auto mb-2 text-ink-400" />
        <p className="text-sm text-ink-600">Arrastra tu PDF aquí o haz clic para seleccionar</p>
        <p className="text-xs text-ink-500 mt-1">Máximo 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      </div>

      {currentCV && (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <FileText size={16} className="text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">CV Subido</p>
            <a href={currentCV} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">
              Descargar CV
            </a>
          </div>
          {loading && <div className="animate-spin"><Upload size={16} className="text-primary-500" /></div>}
        </div>
      )}
    </div>
  );
};
