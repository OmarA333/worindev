import React, { useState } from 'react';
import { LogoLight } from '@/shared/components/Logo';
import {
  ArrowRight, CheckCircle, Zap, Users, Building2, Star,
  Brain, MapPin, Clock, Shield, ChevronRight, TrendingUp
} from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

export const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'candidato' | 'empresa'>('candidato');

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLight size="sm" />
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</a>
            <a href="#empresas" className="hover:text-white transition-colors">Empresas</a>
            <a href="#candidatos" className="hover:text-white transition-colors">Candidatos</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('/login')}
              className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
              Ingresar
            </button>
            <button onClick={() => onNavigate('/register')}
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all">
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(37,99,168,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,168,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-500/30 text-accent-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap size={14} />
            Algoritmo de matching con 93% de precisión
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up">
            El talento ideal
            <br />
            <span className="gradient-text">encuentra su lugar</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Worindev conecta empresas con candidatos mediante inteligencia artificial, tests de competencias y validación automática. No más CVs ignorados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => onNavigate('/register')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all shadow-lg shadow-primary-500/20 text-lg">
              Comenzar gratis <ArrowRight size={20} />
            </button>
            <button onClick={() => onNavigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-300 glass border border-white/10 hover:border-white/20 transition-all text-lg">
              Ver demo
            </button>
          </div>

          {/* Match score visual */}
          <div className="mt-16 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass rounded-2xl p-6 border border-white/10 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold">JD</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Juan Desarrollador</p>
                    <p className="text-xs text-slate-500">React · Node.js · 3 años exp.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent-500">93%</p>
                  <p className="text-xs text-slate-500">Match</p>
                </div>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-match-pulse" style={{ width: '93%' }} />
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">✅ Entrevista grupal programada automáticamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '93%', label: 'Precisión del matching', icon: Star },
            { value: '10',  label: 'Candidatos por entrevista grupal', icon: Users },
            { value: '12h', label: 'Tiempo límite de confirmación', icon: Clock },
            { value: '4',   label: 'Dimensiones evaluadas', icon: Brain },
          ].map(s => (
            <div key={s.label} className="text-center">
              <s.icon size={24} className="mx-auto mb-3 text-accent-500" />
              <p className="text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">¿Cómo funciona?</h2>
            <p className="text-slate-400 text-lg">El algoritmo evalúa 4 dimensiones para garantizar el match perfecto</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { pct: '40%', label: 'Hard Skills', desc: 'Títulos, certificaciones y años de experiencia técnica verificados', color: 'from-primary-500 to-primary-700', icon: '🎓' },
              { pct: '20%', label: 'Soft Skills & Psicometría', desc: 'Tests de personalidad integrados que evalúan habilidades blandas reales', color: 'from-accent-500 to-accent-700', icon: '🧠' },
              { pct: '20%', label: 'Logística', desc: 'Geolocalización en Colombia, disponibilidad horaria y pretensión salarial', color: 'from-cyan-500 to-blue-600', icon: '📍' },
              { pct: '13%', label: 'Referencias', desc: 'Validación automática de referencias laborales mediante correos de verificación', color: 'from-purple-500 to-pink-600', icon: '✅' },
            ].map(d => (
              <div key={d.label} className="glass rounded-2xl p-6 border border-white/8 card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {d.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{d.label}</h3>
                      <span className={`text-lg font-bold bg-gradient-to-r ${d.color} bg-clip-text text-transparent`}>{d.pct}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
                    <div className="mt-3 w-full bg-dark-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${d.color}`} style={{ width: d.pct }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Entrevista grupal */}
          <div className="glass rounded-2xl p-8 border border-accent-500/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-3xl mx-auto mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Entrevista Grupal Automática</h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-6">
              Al alcanzar el <strong className="text-accent-400">93% de afinidad</strong>, el sistema activa automáticamente una entrevista grupal para <strong className="text-white">10 candidatos</strong>. Tienes <strong className="text-primary-400">12 horas</strong> para confirmar. Si declinas, el siguiente candidato es convocado.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Videollamada integrada', 'Dirección física', 'Notificación push', 'Confirmación en 12h'].map(f => (
                <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-slate-300 border border-white/10">
                  <CheckCircle size={13} className="text-accent-500" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="py-20 px-6 bg-dark-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Una plataforma, dos mundos</h2>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            {(['candidato', 'empresa'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize
                  ${activeTab === t ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'glass text-slate-400 hover:text-white border border-white/10'}`}>
                {t === 'candidato' ? '👤 Candidatos' : '🏢 Empresas'}
              </button>
            ))}
          </div>

          {activeTab === 'candidato' ? (
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: '🆓', title: 'Completamente gratis', desc: 'Sin costos ocultos. Crea tu perfil y accede a miles de vacantes.' },
                { icon: '📄', title: 'Perfil dinámico con OCR', desc: 'Carga tus documentos y el sistema extrae la información automáticamente.' },
                { icon: '🔔', title: 'Notificaciones push', desc: 'Recibe alertas instantáneas cuando una empresa quiere entrevistarte.' },
                { icon: '🧪', title: 'Tests de competencias', desc: 'Demuestra tus habilidades reales más allá de un CV tradicional.' },
                { icon: '📍', title: 'Vacantes cercanas', desc: 'Geolocalización inteligente para encontrar oportunidades en tu ciudad.' },
                { icon: '📈', title: 'Crece profesionalmente', desc: 'Gestiona tu carrera y mejora tu perfil con cada postulación.' },
              ].map(f => (
                <div key={f.title} className="glass rounded-xl p-5 border border-white/8 card-hover">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: '💳', title: 'SaaS o por vacante', desc: 'Suscripción mensual o pago por contratación exitosa. Tú eliges.' },
                { icon: '🎛️', title: 'Panel de control', desc: 'Gestiona vacantes, define parámetros y administra entrevistas grupales.' },
                { icon: '⚙️', title: 'Parámetros personalizados', desc: 'Define habilidades críticas vs. deseables para cada posición.' },
                { icon: '🤖', title: 'Filtrado automático', desc: 'El algoritmo filtra candidatos bajo criterios técnicos objetivos.' },
                { icon: '📊', title: 'Reportes detallados', desc: 'Analítica completa del proceso de selección y métricas de éxito.' },
                { icon: '🏢', title: 'Cultura organizacional', desc: 'Define la cultura de tu empresa para atraer el talento correcto.' },
              ].map(f => (
                <div key={f.title} className="glass rounded-xl p-5 border border-white/8 card-hover">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-primary-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5" />
            <div className="relative">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                ¿Listo para transformar tu búsqueda?
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Únete a la plataforma que está redefiniendo el reclutamiento en Colombia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => onNavigate('/register')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all">
                  Crear cuenta gratis <ArrowRight size={18} />
                </button>
                <button onClick={() => onNavigate('/login')}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-300 glass border border-white/10 hover:border-white/20 transition-all">
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoLight size="sm" />
          <p className="text-slate-600 text-sm">
            © 2025 Worindev — Omar Andrés González · Tecnólogo en Análisis y Desarrollo de Software
          </p>
          <p className="text-slate-600 text-xs">Medellín, Colombia 🇨🇴</p>
        </div>
      </footer>
    </div>
  );
};
