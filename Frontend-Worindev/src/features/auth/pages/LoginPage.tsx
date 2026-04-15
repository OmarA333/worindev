import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { LogoLight } from '@/shared/components/Logo';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Completa todos los campos'); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) toast.error('Credenciales incorrectas');
  };

  const demoAccounts = [
    { label: 'Admin',     email: 'admin@worindev.com',     icon: '🛡️' },
    { label: 'Empresa',   email: 'empresa@worindev.com',   icon: '🏢' },
    { label: 'Candidato', email: 'candidato@worindev.com', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-900/30 to-dark-900" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          <LogoLight size="lg" className="justify-center mb-10" />
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Tecnología transformando el mercado laboral
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Conectamos el talento ideal con las empresas correctas mediante inteligencia artificial y tests de competencias.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '93%', label: 'Match preciso' },
              { value: '10x', label: 'Más rápido' },
              { value: '500+', label: 'Empresas' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4">
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <LogoLight size="md" />
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h1 className="text-2xl font-display font-bold text-white mb-1">Bienvenido</h1>
            <p className="text-slate-400 text-sm mb-8">Inicia sesión en tu cuenta</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-dark-700 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-dark-700 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : (<>Ingresar <ArrowRight size={16} /></>)}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-slate-500 text-center mb-3">Cuentas demo (contraseña: 123456)</p>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map(a => (
                  <button
                    key={a.email}
                    onClick={() => { setEmail(a.email); setPassword('123456'); }}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-dark-700 hover:bg-white/5 border border-white/5 transition-all text-xs text-slate-400 hover:text-white"
                  >
                    <span className="text-lg">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              ¿No tienes cuenta?{' '}
              <button onClick={() => onNavigate('/register')} className="text-accent-500 hover:text-accent-400 font-semibold">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
