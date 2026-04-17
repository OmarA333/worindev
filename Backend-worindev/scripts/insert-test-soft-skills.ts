import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const testData = {
  "titulo": "Test Habilidades Blandas",
  "tipo": "SOFT_SKILL",
  "preguntas": [
    {"pregunta":"¿Qué es trabajo en equipo?","opciones":["Trabajar solo","Colaborar con otros","Mandar","Ignorar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es liderazgo?","opciones":["Controlar","Guiar equipo","Obedecer","Evadir"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es comunicación efectiva?","opciones":["Hablar mucho","Transmitir claro","Gritar","Ignorar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es empatía?","opciones":["Ignorar","Comprender a otros","Mandar","Criticar"],"respuesta_correcta":1},
    {"pregunta":"¿Cómo resolver conflictos?","opciones":["Pelear","Dialogar","Ignorar","Escapar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es responsabilidad?","opciones":["Cumplir tareas","Evadir","Delegar","Olvidar"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es adaptabilidad?","opciones":["Resistirse","Adaptarse","Ignorar","Criticar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es escucha activa?","opciones":["Oír","Escuchar con atención","Ignorar","Hablar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es motivación?","opciones":["Energía interna","Cansancio","Obligación","Miedo"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es puntualidad?","opciones":["Llegar tarde","Llegar a tiempo","No ir","Excusarse"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es ética laboral?","opciones":["Valores","Dinero","Reglas","Poder"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es proactividad?","opciones":["Esperar","Actuar","Ignorar","Dormir"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es resiliencia?","opciones":["Rendirse","Adaptarse","Fracasar","Evitar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es organización?","opciones":["Desorden","Planificación","Caos","Improvisar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es compromiso?","opciones":["Cumplir","Ignorar","Evadir","Mentir"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es actitud positiva?","opciones":["Negatividad","Optimismo","Pesimismo","Miedo"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es respeto?","opciones":["Ignorar","Valorar","Ofender","Mandar"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es colaboración?","opciones":["Ayudar","Competir","Ignorar","Criticar"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es disciplina?","opciones":["Orden","Caos","Excusas","Retraso"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es enfoque?","opciones":["Distracción","Concentración","Olvido","Ruido"],"respuesta_correcta":1}
  ]
}

async function main() {
  console.log('🌱 Insertando Test de Habilidades Blandas...')

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
        descripcion: 'Evalúa habilidades blandas como trabajo en equipo, comunicación y liderazgo.',
        duracion: 15,
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
