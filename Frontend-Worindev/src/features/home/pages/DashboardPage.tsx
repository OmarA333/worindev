import React from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  Briefcase, Users, Star, Calendar, TrendingUp,
  CheckCircle2, Clock, ArrowRight, Building2, Zap
} from 'lucide-react';

interface Props { onNavigate: (path: string) => void; }

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; sub?: string; color: string }> =
  ({ icon: Icon, label, value, sub, color }) => (
    <div className="glass rounded-2xl p-5 border border-white/8 card-hover">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );

export const DashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (user?.role === UserRole.CANDIDATO) return <CandidatoDashboard onNavigate={onNavigate} user={user} />;
  if (user?.role === UserRole.EMPRESA)   return <EmpresaDashboard   onNavigate={onNavigate} user={user} />;
  return <AdminDashboard onNavigate={onNavigate} />;
};

const CandidatoDashboard: React.FC<{ onNavigate: (p: string) => void; user: any }> = ({ onNavigate, user }) => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">
          Hola, {user.name} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Tu carrera profesional en un solo lugar</p>
      </div>
      <button onClick={() => onNavigate('/vacantes')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
        <Briefcase size={15} /> Buscar vacantes
      </button>
    </div>

    {/* Match score highlight */}
    <div className="glass rounded-2xl p-6 border border-accent-500/20 bg-gradient-to-r from-accent-500/5 to-primary-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">Tu Match Score actual</p>
          <p className="text-5xl font-bold gradient-text">78%</p>
          <p className="text-slate-500 text-sm mt-2">Completa tus tests para mejorar tu score</p>
        </div>
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#scoreGrad)" strokeWidth="3"
              strokeDasharray={`${78} ${100 - 78}`} strokeLinecap="round" />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563a8" />
                <stop offset="100%" stopColor="#5aaa2a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Star size={20} className="text-accent-500" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Briefcase}    label="Postulaciones"  value="5"  sub="2 en revisión"    color="from-primary-500 to-primary-700" />
      <StatCard icon={Calendar}     label="Entrevistas"    value="1"  sub="Próxima: Lunes"   color="from-accent-500 to-accent-700" />
      <StatCard icon={CheckCircle2} label="Tests completados" value="2" sub="2 pendientes"  color="from-cyan-500 to-blue-600" />
      <StatCard icon={TrendingUp}   label="Perfil visto"   value="12" sub="Esta semana"      color="from-purple-500 to-pink-600" />
    </div>

    {/* Vacantes recomendadas */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Vacantes recomendadas para ti</h2>
        <button onClick={() => onNavigate('/vacantes')} className="text-accent-500 text-sm flex items-center gap-1 hover:text-accent-400">
          Ver todas <ArrowRight size={14} />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { titulo: 'Desarrollador React Senior', empresa: 'TechCorp SAS', ciudad: 'Medellín', match: 93, salario: '$5M - $7M' },
          { titulo: 'Frontend Engineer', empresa: 'Startup Digital', ciudad: 'Bogotá (Remoto)', match: 87, salario: '$4M - $6M' },
        ].map(v => (
          <div key={v.titulo} className="glass rounded-xl p-5 border border-white/8 card-hover cursor-pointer" onClick={() => onNavigate('/vacantes')}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white text-sm">{v.titulo}</h3>
                <p className="text-slate-500 text-xs mt-1">{v.empresa} · {v.ciudad}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-accent-500">{v.match}%</p>
                <p className="text-xs text-slate-600">match</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{v.salario}</span>
              <div className="w-24 bg-dark-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${v.match}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Tests pendientes */}
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Tests pendientes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { nombre: 'Habilidades Técnicas', tipo: 'HARD_SKILL', duracion: 30, pct: '40%' },
          { nombre: 'Psicometría', tipo: 'PSICOMETRIA', duracion: 20, pct: '20%' },
        ].map(t => (
          <div key={t.nombre} className="glass rounded-xl p-4 border border-white/8 flex items-center justify-between">
            <div>
              <p className="font-medium text-white text-sm">{t.nombre}</p>
              <p className="text-xs text-slate-500 mt-1"><Clock size={11} className="inline mr-1" />{t.duracion} min · Peso: {t.pct}</p>
            </div>
            <button onClick={() => onNavigate('/tests')}
              className="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-semibold hover:bg-primary-500/30 transition-all">
              Iniciar
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmpresaDashboard: React.FC<{ onNavigate: (p: string) => void; user: any }> = ({ onNavigate, user }) => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Panel de Empresa</h1>
        <p className="text-slate-400 text-sm mt-1">{user.companyName || user.name}</p>
      </div>
      <button onClick={() => onNavigate('/vacantes')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
        <Briefcase size={15} /> Nueva vacante
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Briefcase}  label="Vacantes activas"  value="3"  color="from-primary-500 to-primary-700" />
      <StatCard icon={Users}      label="Postulantes"        value="47" sub="12 con +90% match" color="from-accent-500 to-accent-700" />
      <StatCard icon={Calendar}   label="Entrevistas"        value="2"  sub="Esta semana"        color="from-cyan-500 to-blue-600" />
      <StatCard icon={CheckCircle2} label="Contratados"      value="8"  sub="Este mes"           color="from-purple-500 to-pink-600" />
    </div>

    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Top candidatos (93%+ match)</h2>
      <div className="space-y-3">
        {[
          { name: 'Ana García', skills: 'React · TypeScript · 5 años', match: 96 },
          { name: 'Carlos López', skills: 'Node.js · AWS · 4 años', match: 94 },
          { name: 'María Torres', skills: 'Python · ML · 3 años', match: 93 },
        ].map(c => (
          <div key={c.name} className="glass rounded-xl p-4 border border-white/8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-white text-sm">{c.name}</p>
              <p className="text-xs text-slate-500">{c.skills}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-accent-500">{c.match}%</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-accent-500/20 text-accent-400 text-xs font-semibold hover:bg-accent-500/30 transition-all">
              Invitar
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-white">Dashboard Administrativo</h1>
      <p className="text-slate-400 text-sm mt-1">Visión general de la plataforma Worindev</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Building2}  label="Empresas"          value="124" sub="+12 este mes"  color="from-primary-500 to-primary-700" />
      <StatCard icon={Users}      label="Candidatos"         value="3.2K" sub="+89 hoy"     color="from-accent-500 to-accent-700" />
      <StatCard icon={Briefcase}  label="Vacantes activas"   value="287" sub="48 cerradas"  color="from-cyan-500 to-blue-600" />
      <StatCard icon={Zap}        label="Matches generados"  value="1.8K" sub="93%+ score"  color="from-purple-500 to-pink-600" />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass rounded-2xl p-5 border border-white/8">
        <h3 className="font-semibold text-white mb-4">Actividad reciente</h3>
        <div className="space-y-3">
          {[
            { msg: 'TechCorp publicó nueva vacante', time: 'Hace 5 min', icon: '🏢' },
            { msg: '3 candidatos alcanzaron 93% match', time: 'Hace 12 min', icon: '⚡' },
            { msg: 'Entrevista grupal programada', time: 'Hace 1h', icon: '📅' },
            { msg: 'Startup Digital se registró', time: 'Hace 2h', icon: '✅' },
          ].map(a => (
            <div key={a.msg} className="flex items-center gap-3">
              <span className="text-lg">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-white">{a.msg}</p>
                <p className="text-xs text-slate-600">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-white/8">
        <h3 className="font-semibold text-white mb-4">Accesos rápidos</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Empresas',    path: '/empresas',    icon: Building2 },
            { label: 'Candidatos',  path: '/candidatos',  icon: Users },
            { label: 'Vacantes',    path: '/vacantes',    icon: Briefcase },
            { label: 'Entrevistas', path: '/entrevistas', icon: Calendar },
          ].map(a => (
            <button key={a.path} onClick={() => onNavigate(a.path)}
              className="flex items-center gap-2 p-3 rounded-xl bg-dark-700 hover:bg-white/5 border border-white/5 transition-all text-sm text-slate-300 hover:text-white">
              <a.icon size={16} className="text-accent-500" /> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);
