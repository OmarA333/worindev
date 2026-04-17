import app from './App'
import prisma from './config/prisma'

const PORT = process.env.PORT || 3003

async function main() {
  await prisma.$connect()
  console.log('✅ Base de datos Worindev conectada')

  app.listen(PORT, () => {
    console.log(`🚀 Worindev API corriendo en http://localhost:${PORT}`)
    console.log(`📋 Health: http://localhost:${PORT}/api/health`)
  })
}

main().catch(err => { console.error('❌ Error al iniciar:', err); process.exit(1) })