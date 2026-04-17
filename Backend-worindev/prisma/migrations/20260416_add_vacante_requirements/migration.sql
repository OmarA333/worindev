-- AlterTable
ALTER TABLE "vacante" ADD COLUMN "requiereTestHardSkill" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vacante" ADD COLUMN "puntajeMinHardSkill" INTEGER;
ALTER TABLE "vacante" ADD COLUMN "requiereTestSoftSkill" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vacante" ADD COLUMN "puntajeMinSoftSkill" INTEGER;
ALTER TABLE "vacante" ADD COLUMN "requiereTestPsicometria" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vacante" ADD COLUMN "puntajeMinPsicometria" INTEGER;
ALTER TABLE "vacante" ADD COLUMN "requiereTestLogistica" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vacante" ADD COLUMN "puntajeMinLogistica" INTEGER;
ALTER TABLE "vacante" ADD COLUMN "requiereReferencias" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "vacante" ADD COLUMN "minimoReferencias" INTEGER;
