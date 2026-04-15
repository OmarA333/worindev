import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { Sidebar } from './shared/components/Sidebar';
import { LoadingScreen } from './shared/components/LoadingScreen';
import { LoginPage } from './src/features/auth/pages/LoginPage';
import { RegisterPage } from './src/features/auth/pages/RegisterPage';
import { LandingPage } from './src/features/home/pages/LandingPage';
import { DashboardPage } from './src/features/home/pages/DashboardPage';
import { VacantesPage } from './src/features/vacantes/pages/VacantesPage';
import { MatchingPage } from './src/features/matching/pages/MatchingPage';
import { TestsPage } from './src/features/candidato/pages/TestsPage';
import { PostulacionesPage } from './src/features/candidato/pages/PostulacionesPage';
import { EntrevistasPage } from './src/features/candidato/pages/EntrevistasPage';
import { PerfilPage } from './src/features/home/pages/PerfilPage';
import { UserRole } from './types';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { LogoLight } from './shared/components/Logo';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentPath,      setCurrentPath]      = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPanelOpen,      setIsPanelOpen]      = useState(true);

  useEffect(() => {
    if (isAuthenticated && ['/', '/login', '/register'].includes(currentPath)) {
      setCurrentPath('/dashboard');
    }
  }, [isAuthenticated, currentPath]);

  if (isLoading) return <LoadingScreen />;

  // Public routes
  if (!isAuthenticated) {
    switch (currentPath) {
      case '/login':    return <LoginPage    onNavigate={setCurrentPath} />;
      case '/register': return <RegisterPage onNavigate={setCurrentPath} />;
      default:          return <LandingPage  onNavigate={setCurrentPath} />;
    }
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/dashboard':     return <DashboardPage    onNavigate={setCurrentPath} />;
      case '/vacantes':      return <VacantesPage     onNavigate={setCurrentPath} />;
      case '/matching':      return <MatchingPage     onNavigate={setCurrentPath} />;
      case '/tests':         return <TestsPage        onNavigate={setCurrentPath} />;
      case '/postulaciones': return <PostulacionesPage onNavigate={setCurrentPath} />;
      case '/entrevistas':   return <EntrevistasPage  onNavigate={setCurrentPath} />;
      case '/perfil':        return <PerfilPage       onNavigate={setCurrentPath} />;
      // Placeholders for admin/empresa pages
      case '/empresas':
      case '/candidatos':
      case '/reportes':
      case '/configuracion':
        return <PlaceholderPage title={currentPath.slice(1)} onNavigate={setCurrentPath} />;
      default:               return <DashboardPage    onNavigate={setCurrentPath} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 glass-dark border-b border-white/5 flex items-center justify-between px-4 z-40">
        <LogoLight size="sm" variant="icon" />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentPath={currentPath} onNavigate={p => { setCurrentPath(p); setIsMobileMenuOpen(false); }}
          isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar currentPath={currentPath} onNavigate={setCurrentPath}
          isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen} />
      </div>

      {/* Main content */}
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300
        pt-14 lg:pt-0
        ${isPanelOpen ? 'lg:ml-[19rem]' : 'lg:ml-20'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

// Simple placeholder for unimplemented pages
const PlaceholderPage: React.FC<{ title: string; onNavigate: (p: string) => void }> = ({ title }) => (
  <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-white capitalize mb-2">{title}</h2>
    <p className="text-slate-400">Módulo en desarrollo — próximamente disponible</p>
  </div>
);

const App: React.FC = () => (
  <AuthProvider>
    <MainLayout />
    <Toaster
      position="top-center"
      toastOptions={{
        style: { background: '#1f2937', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
      }}
    />
  </AuthProvider>
);

export default App;
