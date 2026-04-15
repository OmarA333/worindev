# Worindev Backend API

**Work in Development** — Plataforma inteligente de búsqueda de empleo

## Stack
- Node.js + Express 5 + TypeScript
- PostgreSQL + Prisma ORM
- JWT Auth · Bcrypt · Nodemailer · Zod

## Puerto
`3003` (frontend en `3002`)

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar DATABASE_URL, JWT_SECRET, MAIL_*

# 3. Crear base de datos PostgreSQL
createdb worindevdb

# 4. Generar cliente Prisma
npm run prisma:generate

# 5. Ejecutar migraciones
npm run prisma:migrate

# 6. Poblar datos iniciales
npm run prisma:seed

# 7. Iniciar servidor
npm run dev
```

## Credenciales seed
| Rol       | Email                      | Password         |
|-----------|----------------------------|------------------|
| Admin     | admin@worindev.com         | Admin-123456     |
| Empresa   | techcorp@worindev.com      | Empresa-123456   |
| Candidato | juan@worindev.com          | Candidato-123456 |
| Candidato | ana@worindev.com           | Candidato-123456 |

## Endpoints principales

### Auth
| Método | Ruta                        | Descripción              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/registro          | Registro candidato/empresa |
| POST   | /api/auth/login             | Login                    |
| POST   | /api/auth/recuperar         | Solicitar OTP            |
| POST   | /api/auth/verificar-otp     | Verificar OTP            |
| POST   | /api/auth/reset-password    | Cambiar contraseña       |

### Candidatos
| Método | Ruta                                    | Roles              |
|--------|-----------------------------------------|--------------------|
| GET    | /api/candidatos                         | ADMIN, EMPRESA     |
| GET    | /api/candidatos/:id                     | ADMIN, EMPRESA, CANDIDATO |
| PUT    | /api/candidatos/:id                     | ADMIN, CANDIDATO   |
| POST   | /api/candidatos/:id/habilidades         | ADMIN, CANDIDATO   |
| POST   | /api/candidatos/:id/experiencias        | ADMIN, CANDIDATO   |
| POST   | /api/candidatos/:id/educaciones         | ADMIN, CANDIDATO   |
| POST   | /api/candidatos/:id/referencias         | ADMIN, CANDIDATO   |
| GET    | /api/candidatos/referencias/verificar/:token | Público       |

### Vacantes
| Método | Ruta                        | Roles              |
|--------|-----------------------------|--------------------|
| GET    | /api/vacantes/public        | Público            |
| GET    | /api/vacantes               | Autenticado        |
| POST   | /api/vacantes               | ADMIN, EMPRESA     |
| PUT    | /api/vacantes/:id           | ADMIN, EMPRESA     |
| PATCH  | /api/vacantes/:id/estado    | ADMIN, EMPRESA     |

### Postulaciones
| Método | Ruta                        | Roles              |
|--------|-----------------------------|--------------------|
| GET    | /api/postulaciones          | Autenticado (filtrado por rol) |
| POST   | /api/postulaciones          | CANDIDATO          |
| PATCH  | /api/postulaciones/:id/estado | ADMIN, EMPRESA   |

### Entrevistas Grupales
| Método | Ruta                        | Roles              |
|--------|-----------------------------|--------------------|
| GET    | /api/entrevistas/confirmar/:token | Público      |
| GET    | /api/entrevistas            | Autenticado        |
| POST   | /api/entrevistas            | ADMIN, EMPRESA     |

### Matching
| Método | Ruta                              | Roles          |
|--------|-----------------------------------|----------------|
| GET    | /api/matching/candidato/:id       | Autenticado    |
| GET    | /api/matching/vacante/:vacanteId  | ADMIN, EMPRESA |
| POST   | /api/matching/recalcular/:id      | ADMIN          |

### Tests
| Método | Ruta                              | Roles          |
|--------|-----------------------------------|----------------|
| GET    | /api/tests                        | Autenticado    |
| POST   | /api/tests/:id/responder          | CANDIDATO      |

## Algoritmo de Matching (93%)

| Dimensión              | Peso |
|------------------------|------|
| Hard Skills            | 40%  |
| Soft Skills + Psico    | 20%  |
| Logística              | 20%  |
| Referencias verificadas| 13%  |
| Perfil completo        |  7%  |

Al alcanzar **93%** de compatibilidad con una vacante, el sistema activa automáticamente una entrevista grupal para hasta **10 candidatos** con **12 horas** para confirmar.
