/*
  Warnings:

  - You are about to drop the column `nombre` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `rolId` on the `usuario` table. All the data in the column will be lost.
  - The `estado` column on the `usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `abono` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bloqueo_calendario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cotizacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cotizacion_repertorio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cotizacion_servicio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ensayo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ensayo_repertorio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registro_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repertorio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol_permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venta` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `password_reset_otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'EMPRESA', 'CANDIDATO');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('INDEFINIDO', 'FIJO', 'PRESTACION', 'PRACTICAS', 'TEMPORAL');

-- CreateEnum
CREATE TYPE "EstadoVacante" AS ENUM ('ACTIVA', 'PAUSADA', 'CERRADA');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('PENDIENTE', 'EN_REVISION', 'ENTREVISTA', 'RECHAZADO', 'ACEPTADO');

-- CreateEnum
CREATE TYPE "EstadoEntrevista" AS ENUM ('PROGRAMADA', 'REALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoTest" AS ENUM ('HARD_SKILL', 'SOFT_SKILL', 'PSICOMETRIA', 'LOGISTICA');

-- CreateEnum
CREATE TYPE "NivelEducacion" AS ENUM ('BACHILLER', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO');

-- DropForeignKey
ALTER TABLE "abono" DROP CONSTRAINT "abono_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "abono" DROP CONSTRAINT "abono_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion" DROP CONSTRAINT "cotizacion_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_repertorio" DROP CONSTRAINT "cotizacion_repertorio_cotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_repertorio" DROP CONSTRAINT "cotizacion_repertorio_repertorioId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_servicio" DROP CONSTRAINT "cotizacion_servicio_cotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "cotizacion_servicio" DROP CONSTRAINT "cotizacion_servicio_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "empleado" DROP CONSTRAINT "empleado_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ensayo_repertorio" DROP CONSTRAINT "ensayo_repertorio_ensayoId_fkey";

-- DropForeignKey
ALTER TABLE "ensayo_repertorio" DROP CONSTRAINT "ensayo_repertorio_repertorioId_fkey";

-- DropForeignKey
ALTER TABLE "reserva" DROP CONSTRAINT "reserva_cotizacionId_fkey";

-- DropForeignKey
ALTER TABLE "rol_permiso" DROP CONSTRAINT "rol_permiso_permisoId_fkey";

-- DropForeignKey
ALTER TABLE "rol_permiso" DROP CONSTRAINT "rol_permiso_rolId_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_rolId_fkey";

-- DropForeignKey
ALTER TABLE "venta" DROP CONSTRAINT "venta_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "venta" DROP CONSTRAINT "venta_reservaId_fkey";

-- AlterTable
ALTER TABLE "password_reset_otp" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "nombre",
DROP COLUMN "rolId",
ADD COLUMN     "rol" "RolUsuario" NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO';

-- DropTable
DROP TABLE "abono";

-- DropTable
DROP TABLE "bloqueo_calendario";

-- DropTable
DROP TABLE "cliente";

-- DropTable
DROP TABLE "cotizacion";

-- DropTable
DROP TABLE "cotizacion_repertorio";

-- DropTable
DROP TABLE "cotizacion_servicio";

-- DropTable
DROP TABLE "empleado";

-- DropTable
DROP TABLE "ensayo";

-- DropTable
DROP TABLE "ensayo_repertorio";

-- DropTable
DROP TABLE "permiso";

-- DropTable
DROP TABLE "registro_token";

-- DropTable
DROP TABLE "repertorio";

-- DropTable
DROP TABLE "reserva";

-- DropTable
DROP TABLE "rol";

-- DropTable
DROP TABLE "rol_permiso";

-- DropTable
DROP TABLE "servicio";

-- DropTable
DROP TABLE "venta";

-- DropEnum
DROP TYPE "EstadoCotizacion";

-- DropEnum
DROP TYPE "EstadoEnsayo";

-- DropEnum
DROP TYPE "EstadoReserva";

-- DropEnum
DROP TYPE "EstadoVenta";

-- DropEnum
DROP TYPE "MetodoPago";

-- DropEnum
DROP TYPE "TipoDocumento";

-- DropEnum
DROP TYPE "TipoEvento";

-- DropEnum
DROP TYPE "TipoVenta";

-- DropEnum
DROP TYPE "ZonaServicio";

-- CreateTable
CREATE TABLE "candidato" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "ciudad" TEXT,
    "departamento" TEXT,
    "foto" TEXT,
    "cvUrl" TEXT,
    "nivelEducacion" "NivelEducacion",
    "tituloObtenido" TEXT,
    "anosExperiencia" INTEGER NOT NULL DEFAULT 0,
    "pretensionSalarial" INTEGER,
    "disponibilidad" TEXT,
    "modalidadPreferida" "Modalidad",
    "resumen" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidato_habilidad" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "habilidad" TEXT NOT NULL,
    "nivel" TEXT NOT NULL DEFAULT 'Intermedio',

    CONSTRAINT "candidato_habilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiencia" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "actual" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educacion" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "institucion" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "nivel" "NivelEducacion" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "actual" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "educacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referencia" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "tokenVerif" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "rut" TEXT,
    "sector" TEXT,
    "tamano" TEXT,
    "ciudad" TEXT,
    "descripcion" TEXT,
    "logoUrl" TEXT,
    "sitioWeb" TEXT,
    "cultura" TEXT,
    "verificada" BOOLEAN NOT NULL DEFAULT false,
    "planActivo" TEXT NOT NULL DEFAULT 'BASICO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacante" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "requisitos" TEXT,
    "habilidades" TEXT[],
    "ciudad" TEXT,
    "modalidad" "Modalidad" NOT NULL DEFAULT 'PRESENCIAL',
    "tipoContrato" "TipoContrato" NOT NULL DEFAULT 'INDEFINIDO',
    "salarioMin" INTEGER,
    "salarioMax" INTEGER,
    "nivelEducacion" "NivelEducacion",
    "anosExperiencia" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoVacante" NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postulacion" (
    "id" SERIAL NOT NULL,
    "vacanteId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'PENDIENTE',
    "notasAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrevista_grupal" (
    "id" SERIAL NOT NULL,
    "vacanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "modalidad" "Modalidad" NOT NULL DEFAULT 'PRESENCIAL',
    "enlace" TEXT,
    "direccion" TEXT,
    "estado" "EstadoEntrevista" NOT NULL DEFAULT 'PROGRAMADA',
    "maxCandidatos" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entrevista_grupal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitacion_entrevista" (
    "id" SERIAL NOT NULL,
    "entrevistaId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "tokenConfirm" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondidoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitacion_entrevista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoTest" NOT NULL,
    "descripcion" TEXT,
    "duracion" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregunta" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'OPCION_MULTIPLE',
    "opciones" JSONB,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_resultado" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "puntaje" DOUBLE PRECISION NOT NULL,
    "respuestas" JSONB,
    "completadoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_resultado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidato_usuarioId_key" ON "candidato"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "candidato_habilidad_candidatoId_habilidad_key" ON "candidato_habilidad"("candidatoId", "habilidad");

-- CreateIndex
CREATE UNIQUE INDEX "referencia_tokenVerif_key" ON "referencia"("tokenVerif");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_usuarioId_key" ON "empresa"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_rut_key" ON "empresa"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "postulacion_vacanteId_candidatoId_key" ON "postulacion"("vacanteId", "candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "invitacion_entrevista_tokenConfirm_key" ON "invitacion_entrevista"("tokenConfirm");

-- CreateIndex
CREATE UNIQUE INDEX "invitacion_entrevista_entrevistaId_candidatoId_key" ON "invitacion_entrevista"("entrevistaId", "candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "test_nombre_key" ON "test"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "test_resultado_candidatoId_testId_key" ON "test_resultado"("candidatoId", "testId");

-- AddForeignKey
ALTER TABLE "candidato" ADD CONSTRAINT "candidato_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidato_habilidad" ADD CONSTRAINT "candidato_habilidad_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia" ADD CONSTRAINT "experiencia_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educacion" ADD CONSTRAINT "educacion_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencia" ADD CONSTRAINT "referencia_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacante" ADD CONSTRAINT "vacante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulacion" ADD CONSTRAINT "postulacion_vacanteId_fkey" FOREIGN KEY ("vacanteId") REFERENCES "vacante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulacion" ADD CONSTRAINT "postulacion_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrevista_grupal" ADD CONSTRAINT "entrevista_grupal_vacanteId_fkey" FOREIGN KEY ("vacanteId") REFERENCES "vacante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitacion_entrevista" ADD CONSTRAINT "invitacion_entrevista_entrevistaId_fkey" FOREIGN KEY ("entrevistaId") REFERENCES "entrevista_grupal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregunta" ADD CONSTRAINT "pregunta_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_resultado" ADD CONSTRAINT "test_resultado_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_resultado" ADD CONSTRAINT "test_resultado_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_otp" ADD CONSTRAINT "password_reset_otp_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
