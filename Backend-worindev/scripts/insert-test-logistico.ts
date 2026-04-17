import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const testData = {
  "titulo": "Test Logístico",
  "tipo": "LOGISTICA",
  "preguntas": [
    {"pregunta":"¿Tiene disponibilidad inmediata?","opciones":["Sí","No","Parcial","No sé"],"respuesta_correcta":0},
    {"pregunta":"¿Puede trabajar fines de semana?","opciones":["Sí","No","Depende","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Puede viajar?","opciones":["Sí","No","Poco","No sé"],"respuesta_correcta":0},
    {"pregunta":"¿Tiene transporte?","opciones":["Sí","No","Público","Otro"],"respuesta_correcta":0},
    {"pregunta":"¿Puede trabajar remoto?","opciones":["Sí","No","Parcial","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Horario flexible?","opciones":["Sí","No","Limitado","No sé"],"respuesta_correcta":0},
    {"pregunta":"¿Puede hacer horas extra?","opciones":["Sí","No","A veces","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Vive cerca?","opciones":["Sí","No","Regular","Lejos"],"respuesta_correcta":0},
    {"pregunta":"¿Tiene conexión internet?","opciones":["Sí","No","Inestable","Otro"],"respuesta_correcta":0},
    {"pregunta":"¿Puede asistir presencial?","opciones":["Sí","No","Parcial","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Disponibilidad nocturna?","opciones":["Sí","No","A veces","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Puede cambiar horario?","opciones":["Sí","No","Depende","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Tiene equipo propio?","opciones":["Sí","No","Parcial","Otro"],"respuesta_correcta":0},
    {"pregunta":"¿Acepta turnos rotativos?","opciones":["Sí","No","Depende","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Puede empezar ya?","opciones":["Sí","No","En días","En semanas"],"respuesta_correcta":0},
    {"pregunta":"¿Tiene disponibilidad completa?","opciones":["Sí","No","Parcial","Limitada"],"respuesta_correcta":0},
    {"pregunta":"¿Puede movilizarse?","opciones":["Sí","No","Limitado","Otro"],"respuesta_correcta":0},
    {"pregunta":"¿Acepta cambios de sede?","opciones":["Sí","No","Depende","Nunca"],"respuesta_correcta":0},
    {"pregunta":"¿Tiene flexibilidad?","opciones":["Sí","No","Parcial","Baja"],"respuesta_correcta":0},
    {"pregunta":"¿Puede trabajar bajo presión?","opciones":["Sí","No","Depende","Nunca"],"respuesta_correcta":0}
  ]
}

async function main() {
  console.log('🌱 Insertando Test Logístico...')

  // Buscar o crear el test
  let test = await prisma.test.findFirst({
    where: { nombre: testData.titulo }
  })

  if (test) {
    console.log('⚠️  El test ya existe, eliminando preguntas antiguas...')
    await prisma.pregunta.deleteMany({
      where: { testId: test.id }
    })
  } else {
    console.log('✅ Creando nuevo test...')
    test = await prisma.test.create({
      data: {
        nombre: testData.titulo,
        tipo: testData.tipo as any,
        descripcion: 'Evalúa disponibilidad, ubicación, horarios y condiciones logísticas.',
        duracion: 10,
        peso: 0.20,
        activo: true
      }
    })
  }

  // Insertar preguntas
  console.log(`📝 Insertando ${testData.preguntas.length} preguntas...`)
  
  for (let i = 0; i < testData.preguntas.length; i++) {
    const p = testData.preguntas[i]
    
    await prisma.pregunta.create({
      data: {
        testId: test.id,
        texto: p.pregunta,
        tipo: 'OPCION_MULTIPLE',
        opciones: p.opciones as any,
        respuestaCorrecta: p.respuesta_correcta,
        orden: i
      }
    })
  }

  console.log('✅ Test insertado correctamente!')
  console.log(`   Nombre: ${testData.titulo}`)
  console.log(`   Tipo: ${testData.tipo}`)
  console.log(`   Preguntas: ${testData.preguntas.length}`)
  console.log('')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
