-- Insertar preguntas para Habilidades Técnicas
INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿Cuál es la diferencia entre let y const en JavaScript?', 'OPCION_MULTIPLE', 
  '["let es mutable, const es inmutable", "Son iguales", "const es mutable, let es inmutable", "No hay diferencia en ES6"]'::jsonb, 0
FROM test WHERE nombre = 'Habilidades Técnicas'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿Qué es React?', 'OPCION_MULTIPLE', 
  '["Una librería de JavaScript para UI", "Un framework backend", "Una base de datos", "Un lenguaje de programación"]'::jsonb, 1
FROM test WHERE nombre = 'Habilidades Técnicas'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿Cuántos años de experiencia tienes con React?', 'ESCALA', NULL, 2
FROM test WHERE nombre = 'Habilidades Técnicas'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿Cuál es la diferencia entre async/await y Promises?', 'OPCION_MULTIPLE', 
  '["async/await es más legible y maneja errores mejor", "Son exactamente lo mismo", "Promises es más moderno", "async/await no existe en JavaScript"]'::jsonb, 3
FROM test WHERE nombre = 'Habilidades Técnicas'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿Qué es una API REST?', 'ABIERTA', NULL, 4
FROM test WHERE nombre = 'Habilidades Técnicas'
ON CONFLICT DO NOTHING;

-- Insertar preguntas para Psicometría
INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Prefieres trabajar solo o en equipo', 'ESCALA', NULL, 0
FROM test WHERE nombre = 'Psicometría'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Cómo manejas el estrés en situaciones difíciles', 'ABIERTA', NULL, 1
FROM test WHERE nombre = 'Psicometría'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Qué tan importante es la innovación para ti', 'ESCALA', NULL, 2
FROM test WHERE nombre = 'Psicometría'
ON CONFLICT DO NOTHING;

-- Insertar preguntas para Soft Skills
INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Describe una situación donde lideraste un proyecto', 'ABIERTA', NULL, 0
FROM test WHERE nombre = 'Soft Skills'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Cómo comunicas malas noticias a tu equipo', 'OPCION_MULTIPLE', 
  '["Directamente y con claridad", "Evito el tema", "Dejo que otros lo hagan", "Espero el momento adecuado"]'::jsonb, 1
FROM test WHERE nombre = 'Soft Skills'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Qué tan importante es la colaboración en tu trabajo', 'ESCALA', NULL, 2
FROM test WHERE nombre = 'Soft Skills'
ON CONFLICT DO NOTHING;

-- Insertar preguntas para Logística Personal
INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Confirma tu disponibilidad para empezar', 'OPCION_MULTIPLE', 
  '["Inmediata", "15 días", "1 mes", "Más de 1 mes"]'::jsonb, 0
FROM test WHERE nombre = 'Logística Personal'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, 'Prefieres trabajar en modalidad', 'OPCION_MULTIPLE', 
  '["Presencial", "Remoto", "Híbrido"]'::jsonb, 1
FROM test WHERE nombre = 'Logística Personal'
ON CONFLICT DO NOTHING;

INSERT INTO pregunta (testId, texto, tipo, opciones, orden) 
SELECT id, '¿En qué ciudad prefieres trabajar?', 'ABIERTA', NULL, 2
FROM test WHERE nombre = 'Logística Personal'
ON CONFLICT DO NOTHING;
