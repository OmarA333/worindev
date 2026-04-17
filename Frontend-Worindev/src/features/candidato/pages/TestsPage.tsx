import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Lock, Play, Star } from 'lucide-react';
import { TestForm } from '../components/TestForm';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

interface Test {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  duracion: number;
  peso: number;
  activo: boolean;
  preguntas: any[];
  _count?: { preguntas: number };
}

interface TestResultado {
  testId: number;
  puntaje: number;
  completadoAt: string;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const TestsPage: React.FC<Props> = ({ onNavigate }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [resultados, setResultados] = useState<TestResultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarTests();
  }, []);

  const cargarTests = async () => {
    try {
      const token = localStorage.getItem('wrd_token');
      console.log('Token:', token ? 'presente' : 'ausente');
      console.log('API URL:', API);

      if (!token) {
        console.error('No hay token disponible');
        toast.error('No estás autenticado');
        return;
      }

      const res = await fetch(`${API}/api/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (!res.ok) {
        const error = await res.text();
        console.error('Error response:', error);
        throw new Error(`HTTP ${res.status}: ${error}`);
      }

      const data = await res.json();
      console.log('Tests cargados:', data);
      setTests(data);

      // Cargar resultados del candidato
      const candidatoRes = await fetch(`${API}/api/candidatos/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Candidato response status:', candidatoRes.status);

      if (candidatoRes.ok) {
        const candidato = await candidatoRes.json();
        console.log('Candidato:', candidato);

        const resultadosRes = await fetch(`${API}/api/tests/resultados/candidato/${candidato.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Resultados response status:', resultadosRes.status);

        if (resultadosRes.ok) {
          const resultados = await resultadosRes.json();
          console.log('Resultados:', resultados);
          setResultados(resultados);
        } else {
          const error = await resultadosRes.text();
          console.error('Error al cargar resultados:', error);
        }
      } else {
        const error = await candidatoRes.text();
        console.error('Error al cargar candidato:', error);
      }
    } catch (error) {
      console.error('Error completo:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (test: Test) => {
    try {
      console.log('Iniciando test:', test.id);
      const token = localStorage.getItem('wrd_token');
      console.log('Token disponible:', !!token);
      
      const res = await fetch(`${API}/api/tests/${test.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const error = await res.text();
        console.error('Error al cargar test:', error);
        throw new Error('Error al cargar test');
      }
      
      const testDetalle = await res.json();
      console.log('Test detalle cargado:', testDetalle);
      
      setSelectedTest(testDetalle);
      setShowForm(true);
      console.log('TestForm mostrado');
    } catch (error) {
      console.error('Error en handleStartTest:', error);
      toast.error('Error al cargar el test');
    }
  };

  const handleCompleteTest = async (respuestas: any[]) => {
    try {
      const token = localStorage.getItem('wrd_token');
      const res = await fetch(`${API}/api/tests/${selectedTest!.id}/responder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ respuestas }),
      });

      if (!res.ok) throw new Error('Error al enviar respuestas');
      
      const result = await res.json();
      
      let mensaje = `¡Test completado! Puntaje: ${result.puntaje}% (${result.correctas}/${result.totalPreguntas} correctas)`;
      
      if (result.citacionesGeneradas > 0) {
        mensaje += `\n\n🎉 ¡Felicitaciones! Alcanzaste el 93% de compatibilidad en ${result.citacionesGeneradas} vacante(s). Has sido convocado automáticamente a entrevista grupal.`;
      }
      
      toast.success(mensaje, { duration: 6000 });
      setShowForm(false);
      setSelectedTest(null);
      cargarTests();
    } catch (error) {
      toast.error('Error al completar el test');
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

  const completados = resultados.length;
  const scoreTotal = Math.round(
    resultados.reduce((acc, r) => acc + (r.puntaje * (tests.find(t => t.id === r.testId)?.peso || 0)) / 100, 0)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink-900">Tests de Competencias</h1>
        <p className="text-ink-500 text-sm mt-1">Completa todos los tests para maximizar tu Match Score</p>
      </div>

      {/* Progress */}
      <div className="card-light p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-ink-900 font-semibold">{completados}/{tests.length} tests completados</p>
            <p className="text-ink-500 text-sm">Score parcial: <span className="text-accent-600 font-bold">{scoreTotal}%</span></p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold gradient-text">{Math.round((completados / tests.length) * 100)}%</p>
            <p className="text-xs text-ink-500">progreso</p>
          </div>
        </div>
        <div className="w-full bg-surface-border rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
            style={{ width: `${(completados / tests.length) * 100}%` }} />
        </div>
      </div>

      {/* Tests grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {tests.map(t => {
          const resultado = resultados.find(r => r.testId === t.id);
          const completado = !!resultado;
          const puntaje = resultado?.puntaje;
          const colorMap: Record<string, string> = {
            'HARD_SKILL': 'from-primary-500 to-primary-700',
            'SOFT_SKILL': 'from-accent-500 to-accent-700',
            'PSICOMETRIA': 'from-accent-500 to-accent-700',
            'LOGISTICA': 'from-cyan-500 to-blue-600',
          };
          const color = colorMap[t.tipo] || 'from-primary-500 to-primary-700';
          const iconMap: Record<string, string> = {
            'HARD_SKILL': '🎓',
            'SOFT_SKILL': '🧠',
            'PSICOMETRIA': '🧠',
            'LOGISTICA': '📍',
          };
          const icon = iconMap[t.tipo] || '✅';

          return (
            <div key={t.id} className={`card-light p-5 card-hover cursor-pointer ${completado ? 'border-l-4 border-accent-500' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-ink-900 text-sm">{t.nombre}</h3>
                    {completado
                      ? <CheckCircle2 size={16} className="text-accent-500" />
                      : <Lock size={14} className="text-ink-300" />}
                  </div>
                  <p className="text-xs text-ink-500 mt-1">{t.descripcion || 'Test de competencias'}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-xs text-ink-500"><Clock size={11} />{t.duracion} min</span>
                    <span className="text-xs text-ink-500">{t._count?.preguntas || 0} preguntas</span>
                    <span className="text-xs font-semibold text-primary-600">{t.peso}%</span>
                  </div>
                  {completado && puntaje && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-ink-500">Puntaje</span>
                        <span className="text-xs font-bold text-accent-600">{puntaje}%</span>
                      </div>
                      <div className="w-full bg-surface-border rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${puntaje}%` }} />
                      </div>
                    </div>
                  )}
                  {!completado && (
                    <button
                      onClick={() => {
                        console.log('Click en iniciar test:', t.id);
                        handleStartTest(t);
                      }}
                      className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${color} text-white text-xs font-semibold hover:opacity-90 transition-all`}>
                      <Play size={11} /> Iniciar test
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="card-light p-5 border-l-4 border-primary-500">
        <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
          <Star size={16} className="text-accent-500" /> ¿Por qué son importantes?
        </h3>
        <p className="text-ink-700 text-sm leading-relaxed">
          Los tests permiten ir más allá de un CV tradicional, evaluando habilidades reales. Al completarlos, el algoritmo puede calcular con precisión tu compatibilidad con las vacantes y activar entrevistas grupales automáticas cuando alcances el <strong className="text-accent-600">93% de afinidad</strong>.
        </p>
      </div>

      {/* Test Form Modal */}
      {showForm && selectedTest ? (
        <TestForm
          test={selectedTest}
          onComplete={handleCompleteTest}
          onCancel={() => {
            console.log('Cancelando test');
            setShowForm(false);
            setSelectedTest(null);
          }}
        />
      ) : showForm ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md">
            <p className="text-ink-900">Cargando test...</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
