-- Índices para mejorar el rendimiento de búsquedas frecuentes

-- Índices en Usuario
CREATE INDEX IF NOT EXISTS "idx_usuario_email" ON "usuario"("email");
CREATE INDEX IF NOT EXISTS "idx_usuario_rol_estado" ON "usuario"("rol", "estado");

-- Índices en Candidato
CREATE INDEX IF NOT EXISTS "idx_candidato_matchScore" ON "candidato"("matchScore" DESC);
CREATE INDEX IF NOT EXISTS "idx_candidato_ciudad" ON "candidato"("ciudad");
CREATE INDEX IF NOT EXISTS "idx_candidato_usuarioId" ON "candidato"("usuarioId");

-- Índices en Empresa
CREATE INDEX IF NOT EXISTS "idx_empresa_verificada" ON "empresa"("verificada");
CREATE INDEX IF NOT EXISTS "idx_empresa_usuarioId" ON "empresa"("usuarioId");

-- Índices en Vacante
CREATE INDEX IF NOT EXISTS "idx_vacante_estado" ON "vacante"("estado");
CREATE INDEX IF NOT EXISTS "idx_vacante_empresaId_estado" ON "vacante"("empresaId", "estado");
CREATE INDEX IF NOT EXISTS "idx_vacante_ciudad" ON "vacante"("ciudad");
CREATE INDEX IF NOT EXISTS "idx_vacante_modalidad" ON "vacante"("modalidad");

-- Índices en Postulación
CREATE INDEX IF NOT EXISTS "idx_postulacion_candidatoId" ON "postulacion"("candidatoId");
CREATE INDEX IF NOT EXISTS "idx_postulacion_vacanteId" ON "postulacion"("vacanteId");
CREATE INDEX IF NOT EXISTS "idx_postulacion_estado" ON "postulacion"("estado");
CREATE INDEX IF NOT EXISTS "idx_postulacion_matchScore" ON "postulacion"("matchScore" DESC);

-- Índices en CandidatoHabilidad
CREATE INDEX IF NOT EXISTS "idx_candidato_habilidad_candidatoId" ON "candidato_habilidad"("candidatoId");
CREATE INDEX IF NOT EXISTS "idx_candidato_habilidad_habilidad" ON "candidato_habilidad"("habilidad");

-- Índices en Experiencia
CREATE INDEX IF NOT EXISTS "idx_experiencia_candidatoId" ON "experiencia"("candidatoId");

-- Índices en Educacion
CREATE INDEX IF NOT EXISTS "idx_educacion_candidatoId" ON "educacion"("candidatoId");

-- Índices en TestResultado
CREATE INDEX IF NOT EXISTS "idx_test_resultado_candidatoId" ON "test_resultado"("candidatoId");
CREATE INDEX IF NOT EXISTS "idx_test_resultado_testId" ON "test_resultado"("testId");

-- Índices en Referencia
CREATE INDEX IF NOT EXISTS "idx_referencia_candidatoId" ON "referencia"("candidatoId");
CREATE INDEX IF NOT EXISTS "idx_referencia_verificado" ON "referencia"("verificado");
