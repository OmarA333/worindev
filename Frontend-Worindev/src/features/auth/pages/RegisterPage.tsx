import React, { useState } from 'react';
import { LogoLight } from '@/shared/components/Logo';
import { ArrowRight, ArrowLeft, User, Building2, Home, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [tipo, setTipo] = useState<'candidato' | 'empresa' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState<'candidato' | 'empresa' | null>(null);
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', confirm: '',
    telefono: '', ciudad: '', disponibilidad: '',
    pretensionSalarial: '', modalidadPreferida: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Las contraseñas no coinciden'); return; }
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }

    if (tipo === 'candidato' && (!form.nombre || !form.apellido)) {
      toast.error('Nombre y apellido son requeridos');
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, string> = {
        email:    form.email,
        password: form.password,
        rol:      tipo === 'candidato' ? 'CANDIDATO' : 'EMPRESA',
        nombre:   form.nombre,
      };
      if (tipo === 'candidato') {
        body.apellido = form.apellido;
        body.telefono = form.telefono;
        body.ciudad = form.ciudad;
        body.disponibilidad = form.disponibilidad;
        if (form.pretensionSalarial) body.pretensionSalarial = form.pretensionSalarial;
        if (form.modalidadPreferida) {
          const MAP: Record<string, string> = { 'Presencial': 'PRESENCIAL', 'Remoto': 'REMOTO', 'Híbrido': 'HIBRIDO' };
          body.modalidadPreferida = MAP[form.modalidadPreferida] || form.modalidadPreferida;
        }
      } else {
        body.nombreEmpresa = form.nombre;
      }

      const res = await fetch(`${API}/api/auth/registro`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.message ?? 'Error al registrar'); return; }

      toast.success('¡Cuenta creada! Inicia sesión.');
      onNavigate('/login');
    } catch {
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!tipo) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative">
      <button onClick={() => onNavigate('/')} className="absolute top-6 right-6 flex items-center gap-1 text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 font-semibold text-xs">
        <Home size={14} /> Volver
      </button>
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <LogoLight size="md" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white text-center mb-2">Crear cuenta</h1>
        <p className="text-slate-400 text-center mb-8">¿Cómo quieres usar Worindev?</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'candidato', icon: User,      title: 'Soy Candidato', desc: 'Busco empleo y quiero conectar con empresas',      badge: 'Gratis' },
            { key: 'empresa',   icon: Building2, title: 'Soy Empresa',   desc: 'Quiero encontrar el talento ideal para mi equipo', badge: 'SaaS'  },
          ].map(o => (
            <div key={o.key} className="relative">
              <button onClick={() => setTipo(o.key as 'candidato' | 'empresa')}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-primary-500/40 transition-all text-left card-hover w-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                  <o.icon size={22} className="text-white" />
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 font-semibold mb-3 inline-block">{o.badge}</span>
                <h3 className="font-bold text-white mb-1">{o.title}</h3>
                <p className="text-slate-500 text-sm">{o.desc}</p>
              </button>
              <button onClick={() => setShowInfo(o.key as 'candidato' | 'empresa')}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 hover:bg-white/5 rounded-lg transition-all"
                title="Más información">
                <Info size={18} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => onNavigate('/login')} className="text-accent-500 hover:text-accent-400 font-semibold">Inicia sesión</button>
        </p>
      </div>
    </div>
  );

  const fields = tipo === 'candidato'
    ? [
        { key: 'nombre',   label: 'Nombre',              type: 'text',     placeholder: 'Juan',           required: true },
        { key: 'apellido', label: 'Apellido',             type: 'text',     placeholder: 'Pérez',          required: true },
        { key: 'email',    label: 'Correo electrónico',   type: 'email',    placeholder: 'tu@email.com',   required: true },
        { key: 'telefono', label: 'Teléfono',             type: 'tel',      placeholder: '+57 300 123 4567', required: false },
        { key: 'ciudad',   label: 'Ciudad',               type: 'text',     placeholder: 'Bogotá',         required: false },
        { key: 'disponibilidad',      label: 'Disponibilidad',       type: 'select',  options: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'], required: false },
        { key: 'pretensionSalarial',  label: 'Sueldo esperado (COP)', type: 'number',  placeholder: '3000000', required: false },
        { key: 'modalidadPreferida',  label: 'Modalidad preferida',   type: 'select',  options: ['Presencial', 'Remoto', 'Híbrido'], required: false },
        { key: 'password', label: 'Contraseña',           type: 'password', placeholder: '••••••••',       required: true },
        { key: 'confirm',  label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••',       required: true },
      ]
    : [
        { key: 'nombre',   label: 'Nombre de la empresa', type: 'text',     placeholder: 'TechCorp SAS',   required: true },
        { key: 'email',    label: 'Correo electrónico',   type: 'email',    placeholder: 'empresa@email.com', required: true },
        { key: 'password', label: 'Contraseña',           type: 'password', placeholder: '••••••••',       required: true },
        { key: 'confirm',  label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••',       required: true },
      ];

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative">
      <button onClick={() => onNavigate('/')} className="absolute top-6 right-6 flex items-center gap-1 text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 font-semibold text-xs">
        <Home size={14} /> Volver
      </button>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><LogoLight size="sm" /></div>
        <div className="glass rounded-2xl p-8 border border-white/10">
          <button onClick={() => setTipo(null)} className="flex items-center gap-1 text-slate-500 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Volver
          </button>
          <h2 className="text-xl font-bold text-white mb-1">
            {tipo === 'candidato' ? '👤 Registro de Candidato' : '🏢 Registro de Empresa'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">Completa tu información básica</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-400 tracking-wider mb-1.5 block">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === 'select' ? (
                  <select
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">Selecciona...</option>
                    {(f.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? 'Creando cuenta...' : <> Crear cuenta <ArrowRight size={16} /> </>}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Información - Candidato */}
      {showInfo === 'candidato' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowInfo(null)}>
          <div className="glass rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInfo(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <User size={24} /> Información para Candidatos
            </h3>
            <div className="space-y-4 text-slate-300">
              <p>Como candidato, podrás:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Crear y gestionar tu perfil profesional</li>
                <li>Subir tu currículum y documentos</li>
                <li>Aplicar a vacantes de empleo</li>
                <li>Realizar tests de competencias (gratuitos)</li>
                <li>Seguir el estado de tus postulaciones</li>
                <li>Recibir invitaciones a entrevistas</li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                ¡Es totalmente gratis! Crea tu cuenta y comienza tu búsqueda de empleo hoy.
              </p>
            </div>
            <button onClick={() => { setShowInfo(null); setTipo('candidato'); }} className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-all">
              Crear cuenta como candidato
            </button>
          </div>
        </div>
      )}

      {/* Modal de Información - Empresa */}
      {showInfo === 'empresa' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowInfo(null)}>
          <div className="glass rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInfo(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Building2 size={24} /> Información para Empresas
            </h3>
            <div className="space-y-4 text-slate-300">
              <p>Como empresa, podrás:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Publicar vacantes de empleo</li>
                <li>Revisar perfiles de candidatos</li>
                <li>Verificar resultados de tests</li>
                <li>Programar entrevistas grupales</li>
                <li>Administrar tu proceso de reclutamiento</li>
                <li>Acceder a un pool de talento calificado</li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                Plan SaaS con funcionalidades avanzadas de reclutamiento. ¡Contacta a nuestro equipo para más información!
              </p>
            </div>
            <button onClick={() => { setShowInfo(null); setTipo('empresa'); }} className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-accent-600 hover:bg-accent-500 transition-all">
              Crear cuenta como empresa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
