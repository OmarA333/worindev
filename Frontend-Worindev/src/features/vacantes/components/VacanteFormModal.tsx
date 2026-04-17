import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  formatModalidad, formatTipoContrato, formatNivelEducacion,
  parseModalidad, parseTipoContrato, parseNivelEducacion 
} from '@/shared/utils/formatters';

interface Props {
  vacante?: any;
  onClose: () => void;
  onSave: () => void;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

export const VacanteFormModal: React.FC<Props> = ({ vacante, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    habilidades: [] as string[],
    ciudad: '',
    modalidad: 'Presencial',
    tipoContrato: 'Indefinido',
    salarioMin: '',
    salarioMax: '',
    nivelEducacion: '',
    anosExperiencia: '0',
    // Requerimientos de tests
    requiereTestHardSkill: false,
    puntajeMinHardSkill: '',
    requiereTestSoftSkill: false,
    puntajeMinSoftSkill: '',
    requiereTestPsicometria: false,
    puntajeMinPsicometria: '',
    requiereTestLogistica: false,
    puntajeMinLogistica: '',
    requiereReferencias: false,
    minimoReferencias: '',
  });
  const [habilidadInput, setHabilidadInput] = useState('');

  // Fetch empresaId when component mounts
  useEffect(() => {
    const fetchEmpresaId = async () => {
      try {
        const token = localStorage.getItem('wrd_token');
        const res = await fetch(`${API}/api/empresas/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEmpresaId(data.id);
        }
      } catch (error) {
        console.error('Error fetching empresa:', error);
      }
    };
    fetchEmpresaId();
  }, []);

  useEffect(() => {
    if (vacante) {
      setForm({
        titulo: vacante.titulo || '',
        descripcion: vacante.descripcion || '',
        requisitos: vacante.requisitos || '',
        habilidades: vacante.habilidades || [],
        ciudad: vacante.ciudad || '',
        modalidad: formatModalidad(vacante.modalidad) || 'Presencial',
        tipoContrato: formatTipoContrato(vacante.tipoContrato) || 'Indefinido',
        salarioMin: vacante.salarioMin?.toString() || '',
        salarioMax: vacante.salarioMax?.toString() || '',
        nivelEducacion: formatNivelEducacion(vacante.nivelEducacion) || '',
        anosExperiencia: vacante.anosExperiencia?.toString() || '0',
        requiereTestHardSkill: vacante.requiereTestHardSkill || false,
        puntajeMinHardSkill: vacante.puntajeMinHardSkill?.toString() || '',
        requiereTestSoftSkill: vacante.requiereTestSoftSkill || false,
        puntajeMinSoftSkill: vacante.puntajeMinSoftSkill?.toString() || '',
        requiereTestPsicometria: vacante.requiereTestPsicometria || false,
        puntajeMinPsicometria: vacante.puntajeMinPsicometria?.toString() || '',
        requiereTestLogistica: vacante.requiereTestLogistica || false,
        puntajeMinLogistica: vacante.puntajeMinLogistica?.toString() || '',
        requiereReferencias: vacante.requiereReferencias || false,
        minimoReferencias: vacante.minimoReferencias?.toString() || '',
      });
    }
  }, [vacante]);

  const agregarHabilidad = () => {
    if (habilidadInput.trim() && !form.habilidades.includes(habilidadInput.trim())) {
      setForm(prev => ({ ...prev, habilidades: [...prev.habilidades, habilidadInput.trim()] }));
      setHabilidadInput('');
    }
  };

  const eliminarHabilidad = (hab: string) => {
    setForm(prev => ({ ...prev, habilidades: prev.habilidades.filter(h => h !== hab) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!form.titulo || !form.descripcion || !form.requisitos || !form.ciudad || 
        !form.salarioMin || !form.salarioMax || !form.nivelEducacion || 
        form.habilidades.length === 0) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (!vacante && !empresaId) {
      toast.error('No se pudo obtener el ID de la empresa');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('wrd_token');
      const payload = {
        ...form,
        ...(empresaId && !vacante ? { empresaId } : {}),
        modalidad: parseModalidad(form.modalidad),
        tipoContrato: parseTipoContrato(form.tipoContrato),
        nivelEducacion: parseNivelEducacion(form.nivelEducacion),
        salarioMin: Number(form.salarioMin),
        salarioMax: Number(form.salarioMax),
        anosExperiencia: Number(form.anosExperiencia),
        puntajeMinHardSkill: form.requiereTestHardSkill && form.puntajeMinHardSkill ? Number(form.puntajeMinHardSkill) : null,
        puntajeMinSoftSkill: form.requiereTestSoftSkill && form.puntajeMinSoftSkill ? Number(form.puntajeMinSoftSkill) : null,
        puntajeMinPsicometria: form.requiereTestPsicometria && form.puntajeMinPsicometria ? Number(form.puntajeMinPsicometria) : null,
        puntajeMinLogistica: form.requiereTestLogistica && form.puntajeMinLogistica ? Number(form.puntajeMinLogistica) : null,
        minimoReferencias: form.requiereReferencias && form.minimoReferencias ? Number(form.minimoReferencias) : null,
      };

      const url = vacante 
        ? `${API}/api/vacantes/${vacante.id}`
        : `${API}/api/vacantes`;
      
      const res = await fetch(url, {
        method: vacante ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al guardar vacante');
      
      toast.success(vacante ? 'Vacante actualizada' : 'Vacante creada exitosamente');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error al guardar la vacante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold">{vacante ? 'Editar Vacante' : 'Nueva Vacante'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-ink-900 text-lg">Información Básica</h3>
            
            <div>
              <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                Título de la vacante <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.titulo}
                onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                placeholder="Ej: Desarrollador Full Stack Senior"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                rows={4}
                placeholder="Describe el cargo, responsabilidades y lo que ofrece la empresa..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                Requisitos <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.requisitos}
                onChange={e => setForm(prev => ({ ...prev, requisitos: e.target.value }))}
                className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                rows={3}
                placeholder="Requisitos específicos del cargo..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={e => setForm(prev => ({ ...prev, ciudad: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Ej: Medellín"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Modalidad <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.modalidad}
                  onChange={e => setForm(prev => ({ ...prev, modalidad: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  required>
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Tipo de Contrato <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.tipoContrato}
                  onChange={e => setForm(prev => ({ ...prev, tipoContrato: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  required>
                  <option value="Indefinido">Indefinido</option>
                  <option value="Fijo">Fijo</option>
                  <option value="Prestación de servicios">Prestación de servicios</option>
                  <option value="Prácticas">Prácticas</option>
                  <option value="Temporal">Temporal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Nivel de Educación <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.nivelEducacion}
                  onChange={e => setForm(prev => ({ ...prev, nivelEducacion: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  required>
                  <option value="">Seleccione un nivel</option>
                  <option value="Bachiller">Bachiller</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Tecnólogo">Tecnólogo</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Especialización">Especialización</option>
                  <option value="Maestría">Maestría</option>
                  <option value="Doctorado">Doctorado</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Salario Mínimo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.salarioMin}
                  onChange={e => setForm(prev => ({ ...prev, salarioMin: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="3000000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Salario Máximo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.salarioMax}
                  onChange={e => setForm(prev => ({ ...prev, salarioMax: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="5000000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                  Años de Experiencia <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.anosExperiencia}
                  onChange={e => setForm(prev => ({ ...prev, anosExperiencia: e.target.value }))}
                  className="w-full bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                Habilidades Requeridas <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={habilidadInput}
                  onChange={e => setHabilidadInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), agregarHabilidad())}
                  className="flex-1 bg-surface-bg border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Ej: React, TypeScript..."
                />
                <button
                  type="button"
                  onClick={agregarHabilidad}
                  className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.habilidades.map(hab => (
                  <span key={hab} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs border border-primary-200">
                    {hab}
                    <button type="button" onClick={() => eliminarHabilidad(hab)} className="hover:text-primary-900">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Requerimientos de Tests */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Requerimientos de Tests y Referencias</p>
                <p className="text-blue-700">Configure los tests obligatorios y puntajes mínimos. Los candidatos que cumplan el 93% de compatibilidad serán convocados automáticamente a entrevista.</p>
              </div>
            </div>

            <h3 className="font-semibold text-ink-900 text-lg">Requerimientos de Tests</h3>

            {/* Test Hard Skills */}
            <div className="bg-surface-bg border border-surface-border rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiereTestHardSkill}
                  onChange={e => setForm(prev => ({ ...prev, requiereTestHardSkill: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-ink-900">Test de Habilidades Técnicas (Hard Skills)</span>
              </label>
              {form.requiereTestHardSkill && (
                <div className="mt-3 ml-7">
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    Puntaje Mínimo Requerido (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.puntajeMinHardSkill}
                    onChange={e => setForm(prev => ({ ...prev, puntajeMinHardSkill: e.target.value }))}
                    className="w-32 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="70"
                  />
                </div>
              )}
            </div>

            {/* Test Soft Skills */}
            <div className="bg-surface-bg border border-surface-border rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiereTestSoftSkill}
                  onChange={e => setForm(prev => ({ ...prev, requiereTestSoftSkill: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-ink-900">Test de Habilidades Blandas (Soft Skills)</span>
              </label>
              {form.requiereTestSoftSkill && (
                <div className="mt-3 ml-7">
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    Puntaje Mínimo Requerido (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.puntajeMinSoftSkill}
                    onChange={e => setForm(prev => ({ ...prev, puntajeMinSoftSkill: e.target.value }))}
                    className="w-32 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="70"
                  />
                </div>
              )}
            </div>

            {/* Test Psicometría */}
            <div className="bg-surface-bg border border-surface-border rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiereTestPsicometria}
                  onChange={e => setForm(prev => ({ ...prev, requiereTestPsicometria: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-ink-900">Test Psicométrico</span>
              </label>
              {form.requiereTestPsicometria && (
                <div className="mt-3 ml-7">
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    Puntaje Mínimo Requerido (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.puntajeMinPsicometria}
                    onChange={e => setForm(prev => ({ ...prev, puntajeMinPsicometria: e.target.value }))}
                    className="w-32 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="70"
                  />
                </div>
              )}
            </div>

            {/* Test Logística */}
            <div className="bg-surface-bg border border-surface-border rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiereTestLogistica}
                  onChange={e => setForm(prev => ({ ...prev, requiereTestLogistica: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-ink-900">Test Logístico</span>
              </label>
              {form.requiereTestLogistica && (
                <div className="mt-3 ml-7">
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    Puntaje Mínimo Requerido (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.puntajeMinLogistica}
                    onChange={e => setForm(prev => ({ ...prev, puntajeMinLogistica: e.target.value }))}
                    className="w-32 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="70"
                  />
                </div>
              )}
            </div>

            {/* Referencias */}
            <div className="bg-surface-bg border border-surface-border rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.requiereReferencias}
                  onChange={e => setForm(prev => ({ ...prev, requiereReferencias: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-ink-900">Referencias Verificadas</span>
              </label>
              {form.requiereReferencias && (
                <div className="mt-3 ml-7">
                  <label className="text-xs font-semibold text-ink-500 tracking-wider mb-1.5 block">
                    Número Mínimo de Referencias
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.minimoReferencias}
                    onChange={e => setForm(prev => ({ ...prev, minimoReferencias: e.target.value }))}
                    className="w-32 bg-white border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-ink-700 bg-surface-bg border border-surface-border hover:border-ink-300 transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={16} />
              {loading ? 'Guardando...' : (vacante ? 'Actualizar' : 'Crear Vacante')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
