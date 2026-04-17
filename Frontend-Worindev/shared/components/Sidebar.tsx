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
          { label: 'Empresas',   path: '/empresas',   icon: Building2 },
          { label: 'Candidatos', path: '/candidatos', icon: Users },
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
          { label: 'Mi Currículum',    path: '/curriculo',     icon: FileText },
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
    <div className="h-screen flex">
      {/* RAIL - Barra lateral oscura */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-5 gap-4">
        {/* Logo */}
        <div className="mb-2 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <LogoLight size="sm" variant="icon" />
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
                  setActiveCategory(cat.id);
                  setIsPanelOpen(true);
                }}
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-[10px] font-semibold
                  ${isActive && isPanelOpen
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon size={18} />
                <span className="text-[9px]">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-12 aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-all text-[10px] font-semibold"
        >
          <LogOut size={16} />
          <span className="text-[9px]">Salir</span>
        </button>
      </div>

      {/* PANEL - Panel desplegable oscuro */}
      <div className="w-48 h-screen bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-700">
          <div>
            <p className="text-white font-semibold text-sm">{activeCat?.label}</p>
            <p className="text-gray-400 text-xs">{activeCat?.items.length} módulos</p>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {activeCat?.items.map(item => {
            const Icon     = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
