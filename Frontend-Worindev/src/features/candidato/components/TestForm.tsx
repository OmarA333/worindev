import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Pregunta {
  id: number;
  texto: string;
  tipo: 'OPCION_MULTIPLE' | 'ESCALA' | 'ABIERTA';
  opciones?: string[];
  orden: number;
}

interface Test {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion: number;
  preguntas: Pregunta[];
}

interface Props {
  test: Test;
  onComplete: (respuestas: any[]) => void;
  onCancel: () => void;
}

export const TestForm: React.FC<Props> = ({ test, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.duracion * 60);

  if (!test.preguntas || test.preguntas.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <p className="text-ink-900 mb-4">Este test no tiene preguntas disponibles.</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white">
            Volver
          </button>
        </div>
      </div>
    );
  }

  const pregunta = test.preguntas[currentQuestion];
  const isLastQuestion = currentQuestion === test.preguntas.length - 1;
  const allAnswered = test.preguntas.every(p => respuestas[p.id] !== undefined);

  // Timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (value: any) => {
    setRespuestas(prev => ({ ...prev, [pregunta.id]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error('Completa todas las preguntas');
      return;
    }

    setLoading(true);
    try {
      const respuestasArray = test.preguntas.map(p => ({
        preguntaId: p.id,
        respuesta: respuestas[p.id],
      }));

      onComplete(respuestasArray);
    } catch (error) {
      toast.error('Error al enviar respuestas');
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{test.nombre}</h2>
            <p className="text-sm text-white/80">Pregunta {currentQuestion + 1} de {test.preguntas.length}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <Clock size={16} />
            <span className="font-mono font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full bg-surface-border rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                style={{ width: `${((currentQuestion + 1) / test.preguntas.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ink-900 mb-6">{pregunta.texto}</h3>

            {/* Answer options */}
            <div className="space-y-3">
              {pregunta.tipo === 'OPCION_MULTIPLE' && pregunta.opciones && (
                pregunta.opciones.map((opcion, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-4 border-2 border-surface-border rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                    style={{
                      borderColor: respuestas[pregunta.id] === opcion ? 'rgb(37, 99, 168)' : undefined,
                      backgroundColor: respuestas[pregunta.id] === opcion ? 'rgba(37, 99, 168, 0.05)' : undefined,
                    }}>
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={opcion}
                      checked={respuestas[pregunta.id] === opcion}
                      onChange={() => handleAnswer(opcion)}
                      className="w-4 h-4"
                    />
                    <span className="text-ink-900">{opcion}</span>
                  </label>
                ))
              )}

              {pregunta.tipo === 'ESCALA' && (
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all ${
                        respuestas[pregunta.id] === num
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          : 'bg-surface-border text-ink-900 hover:bg-surface-border/80'
                      }`}>
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {pregunta.tipo === 'ABIERTA' && (
                <textarea
                  value={respuestas[pregunta.id] || ''}
                  onChange={e => handleAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 border-2 border-surface-border rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  rows={4}
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-ink-600 hover:text-ink-900 transition-colors">
              <ArrowLeft size={16} /> Cancelar
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-surface-border text-ink-900 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ArrowLeft size={16} /> Anterior
              </button>

              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={respuestas[pregunta.id] === undefined}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Siguiente <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <CheckCircle2 size={16} /> {loading ? 'Enviando...' : 'Finalizar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
