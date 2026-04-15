import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard, Users, Briefcase, FileText, Calendar,
  Star, Settings, LogOut, ChevronLeft, ChevronRight,
  UserCircle, Building2, Search, CheckCircle2, BarChart3
} from 'lucide-react';
import { LogoLight } from './Logo';

interface SidebarProps {
  currentPath:    string;
  onNavigate:     (path: string) => void;
  isPanelOpen:    boolean;
  setIsPanelOpen: (v: boolean) => void;
}

interface MenuItem { label: string; path: string; icon: React.ElementType; }
interface Category  { id: string; label: string; icon: React.ElementType; items: MenuItem[]; }

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isPanelOpen, setIsPanelOpen }) => {
  const { user, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState('inicio');

  const getCategories = (): Category[] => {
    if (!user) return [];
    const isAdmin     = user.role === UserRole.ADMIN;
    const isEmpresa   = user.role === UserRole.EMPRESA;
    const isCandidato = user.role === UserRole.CANDIDATO;

    const cats: Category[] = [];

    // INICIO
    cats.push({
      id: 'inicio', label: 'Inicio', icon: LayoutDashboard,
      items: [
        { label: 'Dashboard',  path: '/dashboard', icon: LayoutDashboard },
        { label: 'Mi Perfil',  path: '/perfil',    icon: UserCircle },
      ]
    });

    // ADMIN
    if (isAdmin) {
      cats.push({
        id: 'gestion', label: 'Gestión', icon: Settings,
        items: [
          { label: 'Empresas',    path: '/empresas',    icon: Building2 },
          { label: 'Candidatos',  path: '/candidatos',  icon: Users },
          { label: 'Vacantes',    path: '/vacantes',    icon: Briefcase },
          { label: 'Entrevistas', path: '/entrevistas', icon: Calendar },
          { label: 'Matching',    path: '/matching',    icon: Star },
          { label: 'Reportes',    path: '/reportes',    icon: BarChart3 },
        ]
      });
    }

    // EMPRESA
    if (isEmpresa) {
      cats.push({
        id: 'empresa', label: 'Mi Empresa', icon: Building2,
        items: [
          { label: 'Mis Vacantes',    path: '/vacantes',      icon: Briefcase },
          { label: 'Candidatos',      path: '/candidatos',    icon: Users },
          { label: 'Entrevistas',     path: '/entrevistas',   icon: Calendar },
          { label: 'Postulaciones',   path: '/postulaciones', icon: FileText },
        ]
      });
    }

    // CANDIDATO
    if (isCandidato) {
      cats.push({
        id: 'candidato', label: 'Mi Carrera', icon: Search,
        items: [
          { label: 'Buscar Vacantes',  path: '/vacantes',      icon: Search },
          { label: 'Mis Postulaciones',path: '/postulaciones', icon: FileText },
          { label: 'Tests',            path: '/tests',         icon: CheckCircle2 },
          { label: 'Entrevistas',      path: '/entrevistas',   icon: Calendar },
          { label: 'Mi Match Score',   path: '/matching',      icon: Star },
        ]
      });
    }

    return cats;
  };

  const categories = getCategories();

  useEffect(() => {
    const found = categories.find(c => c.items.some(i => i.path === currentPath));
    if (found) setActiveCategory(found.id);
  }, [currentPath]);

  const activeCat = categories.find(c => c.id === activeCategory);
  if (!user) return null;

  return (
    <div className="fixed left-0 top-0 h-screen flex z-50">
      {/* RAIL */}
      <div className="w-20 bg-dark-900 border-r border-white/5 flex flex-col items-center py-5 gap-4">
        {/* Logo icon */}
        <div className="mb-2 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <svg width="36" height="30" viewBox="0 0 100 80" fill="none">
            <ellipse cx="50" cy="30" rx="18" ry="18" fill="#00d4ff" fillOpacity="0.2" />
            <path d="M5 5 L28 70 L50 30 L28 5 Z" fill="url(#rb)" />
            <path d="M95 5 L72 70 L50 30 L72 5 Z" fill="url(#rg)" />
            <defs>
              <linearGradient id="rb" x1="5" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563a8" />
              </linearGradient>
              <linearGradient id="rg" x1="95" y1="5" x2="50" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#86efac" /><stop offset="100%" stopColor="#5aaa2a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Category buttons */}
        <div className="flex-1 flex flex-col gap-2 w-full px-2">
          {categories.map(cat => {
            const Icon     = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (activeCategory === cat.id && isPanelOpen) setIsPanelOpen(false);
                  else { setActiveCategory(cat.id); setIsPanelOpen(true); }
                }}
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-[10px] font-semibold
                  ${isActive && isPanelOpen
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={20} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-14 aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-slate-600 hover:bg-red-900/20 hover:text-red-400 transition-all text-[10px] font-semibold"
        >
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </div>

      {/* PANEL */}
      <div className={`h-screen bg-dark-800 border-r border-white/5 flex flex-col transition-all duration-300 overflow-hidden ${isPanelOpen ? 'w-60 opacity-100' : 'w-0 opacity-0'}`}>
        {/* Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/5 min-w-[15rem]">
          <div>
            <p className="text-white font-semibold text-sm">{activeCat?.label}</p>
            <p className="text-slate-500 text-xs">{activeCat?.items.length} módulos</p>
          </div>
          <button onClick={() => setIsPanelOpen(false)} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg">
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 min-w-[15rem]">
          {activeCat?.items.map(item => {
            const Icon     = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { onNavigate(item.path); setIsPanelOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/10 text-white border border-primary-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={17} className={isActive ? 'text-accent-500' : ''} />
                {item.label}
                {isActive && <ChevronRight size={13} className="ml-auto text-slate-500" />}
              </button>
            );
          })}
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-white/5 min-w-[15rem]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
