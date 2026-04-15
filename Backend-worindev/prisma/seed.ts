import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de Worindev...')

  // ─── USUARIOS BASE ────────────────────────────────────────────────────────
  const adminUser = await prisma.usuario.upsert({
    where:  { email: 'admin@worindev.com' },
    update: {},
    create: { email: 'admin@worindev.com', password: await bcrypt.hash('Admin-123456', 10), rol: 'ADMIN' }
  })

  const empresaUser = await prisma.usuario.upsert({
    where:  { email: 'techcorp@worindev.com' },
    update: {},
    create: { email: 'techcorp@worindev.com', password: await bcrypt.hash('Empresa-123456', 10), rol: 'EMPRESA' }
  })

  const candidatoUser = await prisma.usuario.upsert({
    where:  { email: 'juan@worindev.com' },
    update: {},
    create: { email: 'juan@worindev.com', password: await bcrypt.hash('Candidato-123456', 10), rol: 'CANDIDATO' }
  })

  const candidato2User = await prisma.usuario.upsert({
    where:  { email: 'ana@worindev.com' },
    update: {},
    create: { email: 'ana@worindev.com', password: await bcrypt.hash('Candidato-123456', 10), rol: 'CANDIDATO' }
  })

  console.log('✅ Usuarios creados')

  // ─── EMPRESA ──────────────────────────────────────────────────────────────
  const empresa = await prisma.empresa.upsert({
    where:  { usuarioId: empresaUser.id },
    update: {},
    create: {
      usuarioId:   empresaUser.id,
      nombre:      'TechCorp SAS',
      rut:         '900123456-1',
      sector:      'Tecnología',
      tamano:      '51-200',
      ciudad:      'Medellín',
      descripcion: 'Empresa líder en desarrollo de software en Colombia.',
      verificada:  true,
      planActivo:  'PRO',
    }
  })

  console.log('✅ Empresa creada')

  // ─── CANDIDATOS ───────────────────────────────────────────────────────────
  const candidato1 = await prisma.candidato.upsert({
    where:  { usuarioId: candidatoUser.id },
    update: {},
    create: {
      usuarioId:          candidatoUser.id,
      nombre:             'Juan',
      apellido:           'Pérez',
      telefono:           '3001234567',
      ciudad:             'Medellín',
      departamento:       'Antioquia',
      nivelEducacion:     'PROFESIONAL',
      tituloObtenido:     'Ingeniería de Sistemas',
      anosExperiencia:    4,
      pretensionSalarial: 5000000,
      disponibilidad:     'Inmediata',
      modalidadPreferida: 'HIBRIDO',
      resumen:            'Desarrollador Full Stack con 4 años de experiencia en React y Node.js.',
      matchScore:         0,
    }
  })

  const candidato2 = await prisma.candidato.upsert({
    where:  { usuarioId: candidato2User.id },
    update: {},
    create: {
      usuarioId:          candidato2User.id,
      nombre:             'Ana',
      apellido:           'García',
      telefono:           '3109876543',
      ciudad:             'Bogotá',
      departamento:       'Cundinamarca',
      nivelEducacion:     'MAESTRIA',
      tituloObtenido:     'Maestría en Ciencia de Datos',
      anosExperiencia:    6,
      pretensionSalarial: 8000000,
      disponibilidad:     '15 días',
      modalidadPreferida: 'REMOTO',
      resumen:            'Data Scientist con experiencia en ML y Python.',
      matchScore:         0,
    }
  })

  // Habilidades
  const habilidades1 = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']
  const habilidades2 = ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Power BI']

  for (const h of habilidades1) {
    await prisma.candidatoHabilidad.upsert({
      where:  { candidatoId_habilidad: { candidatoId: candidato1.id, habilidad: h } },
      update: {},
      create: { candidatoId: candidato1.id, habilidad: h, nivel: 'Avanzado' }
    })
  }
  for (const h of habilidades2) {
    await prisma.candidatoHabilidad.upsert({
      where:  { candidatoId_habilidad: { candidatoId: candidato2.id, habilidad: h } },
      update: {},
      create: { candidatoId: candidato2.id, habilidad: h, nivel: 'Experto' }
    })
  }

  console.log('✅ Candidatos y habilidades creados')

  // ─── TESTS ────────────────────────────────────────────────────────────────
  const tests = [
    { nombre: 'Habilidades Técnicas', tipo: 'HARD_SKILL' as const,  duracion: 30, peso: 0.40, descripcion: 'Evalúa conocimientos técnicos, certificaciones y experiencia.', activo: true },
    { nombre: 'Psicometría',          tipo: 'PSICOMETRIA' as const,  duracion: 20, peso: 0.10, descripcion: 'Mide personalidad y habilidades blandas.', activo: true },
    { nombre: 'Soft Skills',          tipo: 'SOFT_SKILL' as const,   duracion: 15, peso: 0.10, descripcion: 'Evalúa trabajo en equipo, comunicación y liderazgo.', activo: true },
    { nombre: 'Logística Personal',   tipo: 'LOGISTICA' as const,    duracion: 10, peso: 0.20, descripcion: 'Confirma ubicación, disponibilidad y pretensión salarial.', activo: true },
  ]

  for (const t of tests) {
    const test = await prisma.test.upsert({
      where:  { nombre: t.nombre },
      update: {},
      create: t,
    })

    // Agregar preguntas según el tipo de test
    if (t.tipo === 'HARD_SKILL') {
      const preguntas = [
        { texto: '¿Cuál es la diferencia entre let y const en JavaScript?', tipo: 'OPCION_MULTIPLE' as const, opciones: ['let es mutable, const es inmutable', 'Son iguales', 'const es mutable, let es inmutable', 'No hay diferencia en ES6'], orden: 0 },
        { texto: '¿Qué es React?', tipo: 'OPCION_MULTIPLE' as const, opciones: ['Una librería de JavaScript para UI', 'Un framework backend', 'Una base de datos', 'Un lenguaje de programación'], orden: 1 },
        { texto: '¿Cuántos años de experiencia tienes con React?', tipo: 'ESCALA' as const, opciones: null, orden: 2 },
      ]
      for (const p of preguntas) {
        const exists = await prisma.pregunta.findFirst({ where: { testId: test.id, orden: p.orden } })
        if (!exists) {
          await prisma.pregunta.create({ data: { testId: test.id, texto: p.texto, tipo: p.tipo, opciones: p.opciones, orden: p.orden } })
        }
      }
    } else if (t.tipo === 'PSICOMETRIA') {
      const preguntas = [
        { texto: 'Prefieres trabajar solo o en equipo', tipo: 'ESCALA' as const, opciones: null, orden: 0 },
        { texto: 'Cómo manejas el estrés en situaciones difíciles', tipo: 'ABIERTA' as const, opciones: null, orden: 1 },
      ]
      for (const p of preguntas) {
        const exists = await prisma.pregunta.findFirst({ where: { testId: test.id, orden: p.orden } })
        if (!exists) {
          await prisma.pregunta.create({ data: { testId: test.id, texto: p.texto, tipo: p.tipo, opciones: p.opciones, orden: p.orden } })
        }
      }
    } else if (t.tipo === 'SOFT_SKILL') {
      const preguntas = [
        { texto: 'Describe una situación donde lideraste un proyecto', tipo: 'ABIERTA' as const, opciones: null, orden: 0 },
        { texto: 'Cómo comunicas malas noticias a tu equipo', tipo: 'OPCION_MULTIPLE' as const, opciones: ['Directamente y con claridad', 'Evito el tema', 'Dejo que otros lo hagan', 'Espero el momento adecuado'], orden: 1 },
      ]
      for (const p of preguntas) {
        const exists = await prisma.pregunta.findFirst({ where: { testId: test.id, orden: p.orden } })
        if (!exists) {
          await prisma.pregunta.create({ data: { testId: test.id, texto: p.texto, tipo: p.tipo, opciones: p.opciones, orden: p.orden } })
        }
      }
    } else if (t.tipo === 'LOGISTICA') {
      const preguntas = [
        { texto: 'Confirma tu disponibilidad para empezar', tipo: 'OPCION_MULTIPLE' as const, opciones: ['Inmediata', '15 días', '1 mes', 'Más de 1 mes'], orden: 0 },
        { texto: 'Prefieres trabajar en modalidad', tipo: 'OPCION_MULTIPLE' as const, opciones: ['Presencial', 'Remoto', 'Híbrido'], orden: 1 },
      ]
      for (const p of preguntas) {
        const exists = await prisma.pregunta.findFirst({ where: { testId: test.id, orden: p.orden } })
        if (!exists) {
          await prisma.pregunta.create({ data: { testId: test.id, texto: p.texto, tipo: p.tipo, opciones: p.opciones, orden: p.orden } })
        }
      }
    }
  }

  console.log('✅ Tests y preguntas creados')

  // ─── VACANTES ─────────────────────────────────────────────────────────────
  const vacante1 = await prisma.vacante.create({
    data: {
      empresaId:       empresa.id,
      titulo:          'Desarrollador React Senior',
      descripcion:     'Buscamos un desarrollador React con experiencia en TypeScript y Node.js para unirse a nuestro equipo de producto.',
      requisitos:      '- 3+ años con React\n- Experiencia con TypeScript\n- Conocimiento de Node.js\n- Trabajo en equipo',
      habilidades:     ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      ciudad:          'Medellín',
      modalidad:       'HIBRIDO',
      tipoContrato:    'INDEFINIDO',
      salarioMin:      5000000,
      salarioMax:      7000000,
      nivelEducacion:  'PROFESIONAL',
      anosExperiencia: 3,
    }
  })

  await prisma.vacante.create({
    data: {
      empresaId:       empresa.id,
      titulo:          'Data Scientist',
      descripcion:     'Buscamos un científico de datos para analizar grandes volúmenes de información y construir modelos predictivos.',
      habilidades:     ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      ciudad:          'Bogotá',
      modalidad:       'REMOTO',
      tipoContrato:    'INDEFINIDO',
      salarioMin:      7000000,
      salarioMax:      10000000,
      nivelEducacion:  'MAESTRIA',
      anosExperiencia: 4,
    }
  })

  console.log('✅ Vacantes creadas')

  // ─── POSTULACIÓN DE PRUEBA ────────────────────────────────────────────────
  await prisma.postulacion.upsert({
    where:  { vacanteId_candidatoId: { vacanteId: vacante1.id, candidatoId: candidato1.id } },
    update: {},
    create: { vacanteId: vacante1.id, candidatoId: candidato1.id, matchScore: 87 }
  })

  console.log('✅ Postulación de prueba creada')
  console.log('')
  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📋 Credenciales de acceso:')
  console.log('   Admin:     admin@worindev.com     / Admin-123456')
  console.log('   Empresa:   techcorp@worindev.com  / Empresa-123456')
  console.log('   Candidato: juan@worindev.com      / Candidato-123456')
  console.log('   Candidato: ana@worindev.com       / Candidato-123456')
}

main().catch(console.error).finally(() => prisma.$disconnect())
