import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('📝 Insertando preguntas en tests...')

  // Habilidades Técnicas
  const hardSkill = await prisma.test.findUnique({ where: { nombre: 'Habilidades Técnicas' } })
  if (hardSkill) {
    const preguntas: Array<{ texto: string; tipo: string; opciones?: string[]; orden: number }> = [
      { texto: '¿Cuál es la diferencia entre let y const en JavaScript?', tipo: 'OPCION_MULTIPLE', opciones: ['let es mutable, const es inmutable', 'Son iguales', 'const es mutable, let es inmutable', 'No hay diferencia en ES6'], orden: 0 },
      { texto: '¿Qué es React?', tipo: 'OPCION_MULTIPLE', opciones: ['Una librería de JavaScript para UI', 'Un framework backend', 'Una base de datos', 'Un lenguaje de programación'], orden: 1 },
      { texto: '¿Cuántos años de experiencia tienes con React?', tipo: 'ESCALA', orden: 2 },
      { texto: '¿Cuál es la diferencia entre async/await y Promises?', tipo: 'OPCION_MULTIPLE', opciones: ['async/await es más legible y maneja errores mejor', 'Son exactamente lo mismo', 'Promises es más moderno', 'async/await no existe en JavaScript'], orden: 3 },
      { texto: '¿Qué es una API REST?', tipo: 'ABIERTA', orden: 4 },
    ]
    for (const p of preguntas) {
      const exists = await prisma.pregunta.findFirst({ where: { testId: hardSkill.id, orden: p.orden } })
      if (!exists) {
        await prisma.pregunta.create({
          data: { testId: hardSkill.id, texto: p.texto, tipo: p.tipo, ...(p.opciones && { opciones: p.opciones }), orden: p.orden }
        })
        console.log(`✅ Pregunta creada: ${p.texto.substring(0, 50)}...`)
      }
    }
  }

  // Psicometría
  const psico = await prisma.test.findUnique({ where: { nombre: 'Psicometría' } })
  if (psico) {
    const preguntas: Array<{ texto: string; tipo: string; opciones?: string[]; orden: number }> = [
      { texto: 'Prefieres trabajar solo o en equipo', tipo: 'ESCALA', orden: 0 },
      { texto: 'Cómo manejas el estrés en situaciones difíciles', tipo: 'ABIERTA', orden: 1 },
      { texto: 'Qué tan importante es la innovación para ti', tipo: 'ESCALA', orden: 2 },
    ]
    for (const p of preguntas) {
      const exists = await prisma.pregunta.findFirst({ where: { testId: psico.id, orden: p.orden } })
      if (!exists) {
        await prisma.pregunta.create({
          data: { testId: psico.id, texto: p.texto, tipo: p.tipo, ...(p.opciones && { opciones: p.opciones }), orden: p.orden }
        })
        console.log(`✅ Pregunta creada: ${p.texto.substring(0, 50)}...`)
      }
    }
  }

  // Soft Skills
  const softSkill = await prisma.test.findUnique({ where: { nombre: 'Soft Skills' } })
  if (softSkill) {
    const preguntas: Array<{ texto: string; tipo: string; opciones?: string[]; orden: number }> = [
      { texto: 'Describe una situación donde lideraste un proyecto', tipo: 'ABIERTA', orden: 0 },
      { texto: 'Cómo comunicas malas noticias a tu equipo', tipo: 'OPCION_MULTIPLE', opciones: ['Directamente y con claridad', 'Evito el tema', 'Dejo que otros lo hagan', 'Espero el momento adecuado'], orden: 1 },
      { texto: 'Qué tan importante es la colaboración en tu trabajo', tipo: 'ESCALA', orden: 2 },
    ]
    for (const p of preguntas) {
      const exists = await prisma.pregunta.findFirst({ where: { testId: softSkill.id, orden: p.orden } })
      if (!exists) {
        await prisma.pregunta.create({
          data: { testId: softSkill.id, texto: p.texto, tipo: p.tipo, ...(p.opciones && { opciones: p.opciones }), orden: p.orden }
        })
        console.log(`✅ Pregunta creada: ${p.texto.substring(0, 50)}...`)
      }
    }
  }

  // Logística Personal
  const logistica = await prisma.test.findUnique({ where: { nombre: 'Logística Personal' } })
  if (logistica) {
    const preguntas: Array<{ texto: string; tipo: string; opciones?: string[]; orden: number }> = [
      { texto: 'Confirma tu disponibilidad para empezar', tipo: 'OPCION_MULTIPLE', opciones: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'], orden: 0 },
      { texto: 'Prefieres trabajar en modalidad', tipo: 'OPCION_MULTIPLE', opciones: ['Presencial', 'Remoto', 'Híbrido'], orden: 1 },
      { texto: '¿En qué ciudad prefieres trabajar?', tipo: 'ABIERTA', orden: 2 },
    ]
    for (const p of preguntas) {
      const exists = await prisma.pregunta.findFirst({ where: { testId: logistica.id, orden: p.orden } })
      if (!exists) {
        await prisma.pregunta.create({
          data: { testId: logistica.id, texto: p.texto, tipo: p.tipo, ...(p.opciones && { opciones: p.opciones }), orden: p.orden }
        })
        console.log(`✅ Pregunta creada: ${p.texto.substring(0, 50)}...`)
      }
    }
  }

  console.log('✅ Preguntas insertadas exitosamente')
}

main().catch(console.error).finally(() => prisma.$disconnect())
