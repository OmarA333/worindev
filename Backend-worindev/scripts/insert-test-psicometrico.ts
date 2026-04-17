import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const testData = {
  "titulo": "Test Psicométrico",
  "tipo": "PSICOMETRIA",
  "preguntas": [
    {"pregunta":"¿Qué número sigue? 2,4,6,8","opciones":["9","10","11","12"],"respuesta_correcta":1},
    {"pregunta":"Si todos los A son B, ¿A es B?","opciones":["Sí","No","Depende","Ninguno"],"respuesta_correcta":0},
    {"pregunta":"¿Cuál es diferente?","opciones":["Perro","Gato","Carro","Caballo"],"respuesta_correcta":2},
    {"pregunta":"5x2=?","opciones":["7","10","12","15"],"respuesta_correcta":1},
    {"pregunta":"Completa: 1,3,5,7","opciones":["8","9","10","11"],"respuesta_correcta":1},
    {"pregunta":"¿Qué pesa más?","opciones":["1kg plomo","1kg algodón","Igual","Depende"],"respuesta_correcta":2},
    {"pregunta":"¿Cuál es lógico?","opciones":["Sol frío","Agua moja","Fuego frío","Hielo caliente"],"respuesta_correcta":1},
    {"pregunta":"10/2=?","opciones":["2","3","5","6"],"respuesta_correcta":2},
    {"pregunta":"¿Qué sigue? A,B,C","opciones":["D","E","F","G"],"respuesta_correcta":0},
    {"pregunta":"¿Cuántos lados tiene un triángulo?","opciones":["3","4","5","6"],"respuesta_correcta":0},
    {"pregunta":"¿Cuál es mayor?","opciones":["2","5","8","1"],"respuesta_correcta":2},
    {"pregunta":"3+3x3=?","opciones":["12","18","9","15"],"respuesta_correcta":0},
    {"pregunta":"¿Qué es lógico?","opciones":["Noche brillante","Luz ilumina","Hielo quema","Agua seca"],"respuesta_correcta":1},
    {"pregunta":"¿Cuál es impar?","opciones":["2","4","7","8"],"respuesta_correcta":2},
    {"pregunta":"¿Qué sigue? 10,20,30","opciones":["35","40","50","60"],"respuesta_correcta":1},
    {"pregunta":"¿Cuánto es 100-50?","opciones":["25","50","75","100"],"respuesta_correcta":1},
    {"pregunta":"¿Cuál es correcto?","opciones":["2<1","3>2","1>5","4<3"],"respuesta_correcta":1},
    {"pregunta":"¿Qué es mayor?","opciones":["1/2","1/3","1/4","1/5"],"respuesta_correcta":0},
    {"pregunta":"¿Qué sigue? 1,1,2,2","opciones":["3","4","2","5"],"respuesta_correcta":2},
    {"pregunta":"¿Qué número falta? 5,10,15","opciones":["18","20","25","30"],"respuesta_correcta":1}
  ]
}

async function main() {
  console.log('🌱 Insertando Test Psicométrico...')

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
        descripcion: 'Evalúa razonamiento lógico, numérico y habilidades cognitivas.',
        duracion: 20,
        peso: 0.10,
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
