import React, { useState } from 'react';
import { LogoLight } from '@/shared/components/Logo';
import { ArrowRight, ArrowLeft, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [tipo, setTipo] = useState<'candidato' | 'empresa' | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Las contraseñas no coinciden'); return; }
    toast.success('¡Cuenta creada! Inicia sesión.');
    onNavigate('/login');
  };

  if (!tipo) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8"><LogoLight size="md" /></div>
        <h1 className="text-3xl font-display font-bold text-white text-center mb-2">Crear cuenta</h1>
        <p className="text-slate-400 text-center mb-8">¿Cómo quieres usar Worindev?</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'candidato', icon: User, title: 'Soy Candidato', desc: 'Busco empleo y quiero conectar con empresas', badge: 'Gratis' },
            { key: 'empresa', icon: Building2, title: 'Soy Empresa', desc: 'Quiero encontrar el talento ideal para mi equipo', badge: 'SaaS' },
          ].map(o => (
            <button key={o.key} onClick={() => setTipo(o.key as any)}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-primary-500/40 transition-all text-left card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                <o.icon size={22} className="text-white" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 font-semibold mb-3 inline-block">{o.badge}</span>
              <h3 className="font-bold text-white mb-1">{o.title}</h3>
              <p className="text-slate-500 text-sm">{o.desc}</p>
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => onNavigate('/login')} className="text-accent-500 hover:text-accent-400 font-semibold">Inicia sesión</button>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
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
            {[
              { key: 'nombre', label: tipo === 'empresa' ? 'Nombre de la empresa' : 'Nombre completo', type: 'text', placeholder: tipo === 'empresa' ? 'TechCorp SAS' : 'Juan Pérez' },
              { key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@email.com' },
              { key: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  required
                  className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            ))}
            <button type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2">
              Crear cuenta <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
