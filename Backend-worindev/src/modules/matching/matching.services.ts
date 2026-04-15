import prisma from '../../config/prisma'

/**
 * Algoritmo de Matching Worindev
 * 
 * Pesos según el documento:
 *   Hard Skills (títulos, certs, experiencia): 40%
 *   Soft Skills & Psicometría:                 20%
 *   Logística (ubicación, horario, salario):   20%
 *   Referencias verificadas:                   13%
 *   Perfil completo (bonus):                    7%
 */

const PESOS = {
  hardSkills:  0.40,
  softSkills:  0.20,
  logistica:   0.20,
  referencias: 0.13,
  perfil:      0.07,
}

export const calcularMatchScore = async (candidatoId: number): Promise<number> => {
  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      habilidades:    true,
      experiencias:   true,
      educaciones:    true,
      referencias:    true,
      testResultados: { include: { test: true } },
    }
  })

  if (!candidato) return 0

  // ── 1. HARD SKILLS (40%) ──────────────────────────────────────────────────
  let hardScore = 0

  // Educación (hasta 40 pts)
  const nivelEduPts: Record<string, number> = {
    BACHILLER: 10, TECNICO: 20, TECNOLOGO: 30,
    PROFESIONAL: 40, ESPECIALIZACION: 50, MAESTRIA: 60, DOCTORADO: 70
  }
  if (candidato.nivelEducacion) hardScore += Math.min(40, nivelEduPts[candidato.nivelEducacion] ?? 0)

  // Experiencia (hasta 30 pts — 5 pts por año, máx 6 años)
  hardScore += Math.min(30, candidato.anosExperiencia * 5)

  // Habilidades registradas (hasta 30 pts — 3 pts por habilidad, máx 10)
  hardScore += Math.min(30, candidato.habilidades.length * 3)

  // Test Hard Skills
  const testHard = candidato.testResultados.find(t => t.test.tipo === 'HARD_SKILL')
  if (testHard) hardScore = (hardScore + testHard.puntaje) / 2

  const hardFinal = Math.min(100, hardScore)

  // ── 2. SOFT SKILLS & PSICOMETRÍA (20%) ───────────────────────────────────
  const testSoft  = candidato.testResultados.find(t => t.test.tipo === 'SOFT_SKILL')
  const testPsico = candidato.testResultados.find(t => t.test.tipo === 'PSICOMETRIA')
  let softScore = 0
  if (testSoft)  softScore += testSoft.puntaje  * 0.5
  if (testPsico) softScore += testPsico.puntaje * 0.5
  if (!testSoft && !testPsico) softScore = 0
  else if (!testSoft || !testPsico) softScore = (testSoft?.puntaje ?? testPsico?.puntaje ?? 0)

  // ── 3. LOGÍSTICA (20%) ────────────────────────────────────────────────────
  const testLogis = candidato.testResultados.find(t => t.test.tipo === 'LOGISTICA')
  let logisScore = 0
  if (testLogis) logisScore = testLogis.puntaje
  else {
    // Inferir de datos del perfil
    if (candidato.ciudad)             logisScore += 30
    if (candidato.pretensionSalarial) logisScore += 30
    if (candidato.disponibilidad)     logisScore += 20
    if (candidato.modalidadPreferida) logisScore += 20
  }

  // ── 4. REFERENCIAS (13%) ──────────────────────────────────────────────────
  const refsVerificadas = candidato.referencias.filter(r => r.verificado).length
  const refScore = Math.min(100, refsVerificadas * 33) // 3 refs = 100%

  // ── 5. PERFIL COMPLETO (7%) ───────────────────────────────────────────────
  let perfilScore = 0
  if (candidato.foto)        perfilScore += 20
  if (candidato.resumen)     perfilScore += 20
  if (candidato.cvUrl)       perfilScore += 20
  if (candidato.linkedinUrl) perfilScore += 20
  if (candidato.telefono)    perfilScore += 20

  // ── SCORE TOTAL ───────────────────────────────────────────────────────────
  const total =
    hardFinal   * PESOS.hardSkills +
    softScore   * PESOS.softSkills +
    logisScore  * PESOS.logistica  +
    refScore    * PESOS.referencias +
    perfilScore * PESOS.perfil

  return Math.round(Math.min(100, total) * 10) / 10
}

/**
 * Calcula el match entre un candidato y una vacante específica
 * Considera además las habilidades requeridas por la vacante
 */
export const calcularMatchConVacante = async (candidatoId: number, vacanteId: number): Promise<number> => {
  const [candidato, vacante] = await Promise.all([
    prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: { habilidades: true, experiencias: true, educaciones: true, referencias: true, testResultados: { include: { test: true } } }
    }),
    prisma.vacante.findUnique({ where: { id: vacanteId } })
  ])

  if (!candidato || !vacante) return 0

  // Score base del candidato
  const scoreBase = await calcularMatchScore(candidatoId)

  // Bonus por habilidades que coinciden con la vacante
  const habilidadesCandidato = candidato.habilidades.map(h => h.habilidad.toLowerCase())
  const habilidadesVacante   = vacante.habilidades.map(h => h.toLowerCase())
  const coincidencias = habilidadesVacante.filter(h => habilidadesCandidato.includes(h)).length
  const bonusHabilidades = habilidadesVacante.length > 0
    ? (coincidencias / habilidadesVacante.length) * 10
    : 0

  // Bonus por nivel educativo
  const nivelOrd: Record<string, number> = {
    BACHILLER: 1, TECNICO: 2, TECNOLOGO: 3, PROFESIONAL: 4,
    ESPECIALIZACION: 5, MAESTRIA: 6, DOCTORADO: 7
  }
  const nivelCandidato = nivelOrd[candidato.nivelEducacion ?? ''] ?? 0
  const nivelVacante   = nivelOrd[vacante.nivelEducacion   ?? ''] ?? 0
  const bonusEducacion = nivelCandidato >= nivelVacante ? 5 : -5

  // Bonus por experiencia
  const bonusExp = candidato.anosExperiencia >= vacante.anosExperiencia ? 5 : -5

  const scoreTotal = Math.min(100, scoreBase + bonusHabilidades + bonusEducacion + bonusExp)
  return Math.round(scoreTotal * 10) / 10
}
