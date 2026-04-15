# Setup de Preguntas para Tests

Este documento explica cómo insertar las preguntas en los tests de competencias.

## Opción 1: Usar el script TypeScript (Recomendado)

```bash
npm run insert:preguntas
```

Este script insertará automáticamente todas las preguntas en los tests existentes.

## Opción 2: Usar SQL directamente

Si prefieres ejecutar SQL directamente:

```bash
psql -U postgres -d worindevdb -f insert_preguntas.sql
```

## Opción 3: Usar Prisma Studio

```bash
npm run studio
```

Luego puedes crear preguntas manualmente a través de la interfaz gráfica.

## Opción 4: Usar la API

Puedes crear preguntas a través del endpoint:

```bash
POST /api/tests/:testId/preguntas
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "texto": "¿Cuál es tu pregunta?",
  "tipo": "OPCION_MULTIPLE",
  "opciones": ["Opción 1", "Opción 2", "Opción 3"],
  "orden": 0
}
```

## Tipos de preguntas soportadas

- **OPCION_MULTIPLE**: Pregunta con opciones múltiples (requiere `opciones`)
- **ESCALA**: Pregunta de escala 1-5 (no requiere `opciones`)
- **ABIERTA**: Pregunta abierta (no requiere `opciones`)

## Verificar que las preguntas se insertaron

```bash
npm run studio
```

O consulta directamente:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3003/api/tests/1
```

Deberías ver las preguntas en el array `preguntas`.
