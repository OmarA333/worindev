// ─── ROLES ────────────────────────────────────────────────────────────────────
export enum UserRole {
  ADMIN      = 'ADMIN',
  EMPRESA    = 'EMPRESA',
  CANDIDATO  = 'CANDIDATO',
}

// ─── USUARIO ──────────────────────────────────────────────────────────────────
export interface User {
  id:       string
  email:    string
  role:     UserRole
  name:     string
  lastName: string
  avatar?:  string
  isActive: boolean
  // Candidato
  phone?:       string
  city?:        string
  cvUrl?:       string
  skills?:      string[]
  matchScore?:  number
  // Empresa
  companyName?: string
  rut?:         string
  sector?:      string
}

// ─── VACANTE ──────────────────────────────────────────────────────────────────
export interface Vacante {
  id:           string
  titulo:       string
  empresa:      string
  empresaId:    string
  ciudad:       string
  modalidad:    'Presencial' | 'Remoto' | 'Híbrido'
  salario:      string
  descripcion:  string
  requisitos:   string[]
  habilidades:  string[]
  tipoContrato: string
  estado:       'ACTIVA' | 'PAUSADA' | 'CERRADA'
  matchScore?:  number
  postulantes?: number
  createdAt:    string
}

// ─── POSTULACIÓN ──────────────────────────────────────────────────────────────
export interface Postulacion {
  id:          string
  vacanteId:   string
  candidatoId: string
  vacante?:    Vacante
  candidato?:  Partial<User>
  matchScore:  number
  estado:      'PENDIENTE' | 'EN_REVISION' | 'ENTREVISTA' | 'RECHAZADO' | 'ACEPTADO'
  createdAt:   string
}

// ─── ENTREVISTA GRUPAL ────────────────────────────────────────────────────────
export interface EntrevistaGrupal {
  id:          string
  vacanteId:   string
  vacante?:    Vacante
  fecha:       string
  hora:        string
  modalidad:   'Virtual' | 'Presencial'
  enlace?:     string
  direccion?:  string
  candidatos:  Partial<User>[]
  estado:      'PROGRAMADA' | 'REALIZADA' | 'CANCELADA'
}

// ─── TEST DE COMPETENCIAS ─────────────────────────────────────────────────────
export interface TestCompetencia {
  id:        string
  nombre:    string
  tipo:      'HARD_SKILL' | 'SOFT_SKILL' | 'PSICOMETRIA' | 'LOGISTICA'
  preguntas: number
  duracion:  number // minutos
  completado?: boolean
  puntaje?:    number
}

// ─── MÓDULOS ──────────────────────────────────────────────────────────────────
export type ModuleName =
  | 'dashboard'
  | 'vacantes'
  | 'postulaciones'
  | 'entrevistas'
  | 'candidatos'
  | 'empresas'
  | 'tests'
  | 'matching'
  | 'perfil'
  | 'configuracion'

export interface AppRoute {
  path:   string
  label:  string
  module: ModuleName
  roles:  UserRole[]
  icon?:  string
}
