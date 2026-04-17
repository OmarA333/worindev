import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const tests = [
  {
    "titulo": "Test de Habilidades Generales",
    "tipo": "HARD_SKILL",
    "descripcion": "Evalúa conocimientos básicos de informática y herramientas digitales.",
    "duracion": 20,
    "peso": 0.40,
    "preguntas": [
      {"pregunta":"¿Cuál es una herramienta de hoja de cálculo?","opciones":["Word","Excel","Paint","Chrome"],"respuesta_correcta":1},
      {"pregunta":"¿Qué programa se usa para presentaciones?","opciones":["Excel","PowerPoint","WordPad","Bloc de notas"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es un correo electrónico?","opciones":["Red social","Medio de comunicación digital","Juego","Archivo"],"respuesta_correcta":1},
      {"pregunta":"¿Qué significa PDF?","opciones":["Portable Document Format","Public Data File","Print Document Fast","Personal Data File"],"respuesta_correcta":0},
      {"pregunta":"¿Qué herramienta sirve para videollamadas?","opciones":["Zoom","Excel","Word","Paint"],"respuesta_correcta":0},
      {"pregunta":"¿Qué es internet?","opciones":["Un programa","Red global de computadoras","Archivo","Sistema operativo"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es un navegador web?","opciones":["Sistema operativo","Programa para navegar internet","Base de datos","Servidor"],"respuesta_correcta":1},
      {"pregunta":"¿Cuál es un navegador?","opciones":["Chrome","Excel","PowerPoint","Word"],"respuesta_correcta":0},
      {"pregunta":"¿Qué es una contraseña segura?","opciones":["1234","abcd","Combinación de letras, números y símbolos","Tu nombre"],"respuesta_correcta":2},
      {"pregunta":"¿Qué es una carpeta en un computador?","opciones":["Programa","Contenedor de archivos","Virus","Hardware"],"respuesta_correcta":1},
      {"pregunta":"¿Qué hace copiar y pegar?","opciones":["Eliminar","Duplicar información","Cerrar programa","Guardar archivo"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es una base de datos?","opciones":["Juego","Conjunto de datos organizados","Navegador","Archivo temporal"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es almacenamiento en la nube?","opciones":["Guardar en USB","Guardar en internet","Guardar en disco duro","Eliminar datos"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es un archivo?","opciones":["Programa","Unidad de información","Hardware","Virus"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es una red WiFi?","opciones":["Cable","Conexión inalámbrica","Programa","Servidor"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es descargar un archivo?","opciones":["Subir archivo","Copiar desde internet","Eliminar archivo","Compartir archivo"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es subir un archivo?","opciones":["Borrar","Enviar a internet","Descargar","Editar"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es un virus informático?","opciones":["Programa útil","Software dañino","Sistema operativo","Archivo"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es actualizar un programa?","opciones":["Eliminar","Mejorar versión","Cerrar","Copiar"],"respuesta_correcta":1},
      {"pregunta":"¿Qué es una aplicación móvil?","opciones":["Programa en celular","Hardware","Cable","Archivo"],"respuesta_correcta":0}
    ]
  },
  {
    "titulo": "Test Habilidades Blandas",
    "tipo": "SOFT_SKILL",
    "descripcion": "Evalúa habilidades blandas como trabajo en equipo, comunicación y liderazgo.",
    "duracion": 15,
    "peso": 0.20,
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
  },
  {
    "titulo": "Test Psicométrico",
    "tipo": "PSICOMETRIA",
    "descripcion": "Evalúa razonamiento lógico, numérico y habilidades cognitivas.",
    "duracion": 20,
    "peso": 0.10,
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
  },
  {
    "titulo": "Test Logístico",
    "tipo": "LOGISTICA",
    "descripcion": "Evalúa disponibilidad, ubicación, horarios y condiciones logísticas.",
    "duracion": 10,
    "peso": 0.20,
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
]

async function main() {
  console.log('🌱 Insertando todos los tests...\n')

  for (const testData of tests) {
    console.log(`📝 Procesando: ${testData.titulo}`)

    // Buscar o crear el test
    let test = await prisma.test.findFirst({
      where: { nombre: testData.titulo }
    })

    if (test) {
      console.log('   ⚠️  Ya existe, eliminando preguntas antiguas...')
      await prisma.pregunta.deleteMany({
        where: { testId: test.id }
      })
    } else {
      console.log('   ✅ Creando nuevo test...')
      test = await prisma.test.create({
        data: {
          nombre: testData.titulo,
          tipo: testData.tipo as any,
          descripcion: testData.descripcion,
          duracion: testData.duracion,
          peso: testData.peso,
          activo: true
        }
      })
    }

    // Insertar preguntas
    console.log(`   📋 Insertando ${testData.preguntas.length} preguntas...`)
    
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

    console.log(`   ✅ Completado!\n`)
  }

  console.log('🎉 Todos los tests insertados correctamente!')
  console.log(`   Total: ${tests.length} tests`)
  console.log(`   Total preguntas: ${tests.reduce((sum, t) => sum + t.preguntas.length, 0)}`)
  console.log('')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
