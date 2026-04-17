// Mapeo de valores de base de datos (mayúsculas) a formato de visualización (título)
export const MODALIDAD_MAP: Record<string, string> = {
  'PRESENCIAL': 'Presencial',
  'REMOTO': 'Remoto',
  'HIBRIDO': 'Híbrido',
  'Presencial': 'PRESENCIAL',
  'Remoto': 'REMOTO',
  'Híbrido': 'HIBRIDO',
};

export const TIPO_CONTRATO_MAP: Record<string, string> = {
  'INDEFINIDO': 'Indefinido',
  'FIJO': 'Fijo',
  'PRESTACION': 'Prestación de servicios',
  'PRACTICAS': 'Prácticas',
  'TEMPORAL': 'Temporal',
  'Indefinido': 'INDEFINIDO',
  'Fijo': 'FIJO',
  'Prestación de servicios': 'PRESTACION',
  'Prácticas': 'PRACTICAS',
  'Temporal': 'TEMPORAL',
};

export const NIVEL_EDUCACION_MAP: Record<string, string> = {
  'BACHILLER': 'Bachiller',
  'TECNICO': 'Técnico',
  'TECNOLOGO': 'Tecnólogo',
  'PROFESIONAL': 'Profesional',
  'ESPECIALIZACION': 'Especialización',
  'MAESTRIA': 'Maestría',
  'DOCTORADO': 'Doctorado',
  'Bachiller': 'BACHILLER',
  'Técnico': 'TECNICO',
  'Tecnólogo': 'TECNOLOGO',
  'Profesional': 'PROFESIONAL',
  'Especialización': 'ESPECIALIZACION',
  'Maestría': 'MAESTRIA',
  'Doctorado': 'DOCTORADO',
};

export const ESTADO_VACANTE_MAP: Record<string, string> = {
  'ACTIVA': 'Activa',
  'PAUSADA': 'Pausada',
  'CERRADA': 'Cerrada',
  'Activa': 'ACTIVA',
  'Pausada': 'PAUSADA',
  'Cerrada': 'CERRADA',
};

// Funciones de conversión
export const toDisplay = (value: string | undefined | null, map: Record<string, string>): string => {
  if (!value) return '';
  return map[value] || value;
};

export const toDatabase = (value: string | undefined | null, map: Record<string, string>): string => {
  if (!value) return '';
  return map[value] || value;
};

// Funciones específicas
export const formatModalidad = (value: string | undefined | null): string => toDisplay(value, MODALIDAD_MAP);
export const formatTipoContrato = (value: string | undefined | null): string => toDisplay(value, TIPO_CONTRATO_MAP);
export const formatNivelEducacion = (value: string | undefined | null): string => toDisplay(value, NIVEL_EDUCACION_MAP);
export const formatEstadoVacante = (value: string | undefined | null): string => toDisplay(value, ESTADO_VACANTE_MAP);

export const parseModalidad = (value: string | undefined | null): string => toDatabase(value, MODALIDAD_MAP);
export const parseTipoContrato = (value: string | undefined | null): string => toDatabase(value, TIPO_CONTRATO_MAP);
export const parseNivelEducacion = (value: string | undefined | null): string => toDatabase(value, NIVEL_EDUCACION_MAP);
export const parseEstadoVacante = (value: string | undefined | null): string => toDatabase(value, ESTADO_VACANTE_MAP);
