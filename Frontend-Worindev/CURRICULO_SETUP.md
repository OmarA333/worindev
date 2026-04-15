# Sistema de Currículum para Candidatos

## Descripción

El sistema de currículum permite que los candidatos completen su perfil profesional con:

- **Información Personal**: Nombre, apellido, teléfono, ciudad, departamento, sueldo esperado, disponibilidad, modalidad de trabajo
- **Educación**: Institución, título, nivel de educación, fechas
- **Experiencia**: Empresa, cargo, descripción, fechas
- **Referencias Laborales**: Nombre, cargo, empresa, email, teléfono (con verificación automática)
- **Habilidades**: Agregar y gestionar habilidades técnicas
- **Currículum PDF**: Subir archivo PDF del currículum

## Acceso

Los candidatos pueden acceder a través de:
1. Sidebar → "Mi Carrera" → "Mi Currículum"
2. O directamente en `/curriculo`

## Funcionalidades

### 1. Información Personal
- Editar información básica
- Establecer sueldo esperado
- Indicar disponibilidad (Inmediata, 15 días, 1 mes, Más de 1 mes)
- Seleccionar modalidad de trabajo (Presencial, Remoto, Híbrido)
- Subir currículum en PDF

### 2. Educación
- Agregar múltiples estudios
- Especificar nivel (Bachiller, Técnico, Tecnólogo, Profesional, Especialización, Maestría, Doctorado)
- Indicar si está en curso
- Eliminar educación

### 3. Experiencia
- Agregar múltiples trabajos
- Incluir descripción de funciones
- Marcar como trabajo actual
- Eliminar experiencia

### 4. Referencias Laborales
- Agregar referencias de empleadores anteriores
- Sistema automático de verificación por email
- Ver estado de verificación (Verificada/Pendiente)
- Eliminar referencias

### 5. Habilidades
- Agregar habilidades técnicas
- Especificar nivel (Básico, Intermedio, Avanzado, Experto)
- Eliminar habilidades

## Endpoints del Backend

### Obtener Perfil Actual
```
GET /api/candidatos/me
Authorization: Bearer <token>
```

### Actualizar Información Personal
```
PUT /api/candidatos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3001234567",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "pretensionSalarial": 5000000,
  "disponibilidad": "Inmediata",
  "modalidadPreferida": "HIBRIDO",
  "cvUrl": "https://..."
}
```

### Agregar Educación
```
POST /api/candidatos/:id/educaciones
Authorization: Bearer <token>
Content-Type: application/json

{
  "institucion": "Universidad Nacional",
  "titulo": "Ingeniería de Sistemas",
  "nivel": "PROFESIONAL",
  "fechaInicio": "2018-01-15",
  "fechaFin": "2022-12-15",
  "actual": false
}
```

### Agregar Experiencia
```
POST /api/candidatos/:id/experiencias
Authorization: Bearer <token>
Content-Type: application/json

{
  "empresa": "TechCorp SAS",
  "cargo": "Desarrollador React",
  "descripcion": "Desarrollo de aplicaciones web con React y Node.js",
  "fechaInicio": "2022-01-01",
  "fechaFin": "2024-12-31",
  "actual": false
}
```

### Agregar Referencia
```
POST /api/candidatos/:id/referencias
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Carlos García",
  "cargo": "Gerente de Proyecto",
  "empresa": "TechCorp SAS",
  "email": "carlos@techcorp.com",
  "telefono": "3109876543"
}
```

Se enviará automáticamente un email de verificación a la referencia.

### Agregar Habilidad
```
POST /api/candidatos/:id/habilidades
Authorization: Bearer <token>
Content-Type: application/json

{
  "habilidad": "React",
  "nivel": "Avanzado"
}
```

### Eliminar Educación
```
DELETE /api/candidatos/:id/educaciones/:eid
Authorization: Bearer <token>
```

### Eliminar Experiencia
```
DELETE /api/candidatos/:id/experiencias/:eid
Authorization: Bearer <token>
```

### Eliminar Referencia
```
DELETE /api/candidatos/:id/referencias/:rid
Authorization: Bearer <token>
```

### Eliminar Habilidad
```
DELETE /api/candidatos/:id/habilidades/:hid
Authorization: Bearer <token>
```

## Impacto en Match Score

Cada vez que se actualiza información del candidato, el sistema recalcula automáticamente el **Match Score**:

- **Educación**: Aumenta según nivel de estudios
- **Experiencia**: Aumenta según años y relevancia
- **Habilidades**: Aumenta según cantidad y nivel
- **Referencias**: Aumenta cuando se verifican
- **Información Personal**: Completa el perfil

El Match Score se usa para:
- Mostrar compatibilidad con vacantes
- Activar entrevistas grupales automáticas (cuando alcanza 93%)
- Ranking de candidatos

## Notas Importantes

1. **Verificación de Referencias**: Las referencias deben verificarse por email antes de contar en el Match Score
2. **Currículum PDF**: Se almacena como URL, máximo 5MB
3. **Campos Requeridos**: Algunos campos son obligatorios para cada sección
4. **Actualización Automática**: El Match Score se recalcula después de cada cambio
5. **Historial**: Se mantiene el historial de cambios en la base de datos

## Próximas Mejoras

- [ ] Subida de archivos PDF directa (sin URL)
- [ ] Validación de email en tiempo real
- [ ] Importar datos desde LinkedIn
- [ ] Plantillas de currículum
- [ ] Previsualización de currículum
- [ ] Historial de cambios
