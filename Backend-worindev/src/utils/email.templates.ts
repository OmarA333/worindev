// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface EmailOtpParams       { nombre: string; otp: string }
interface EmailBienvenidaParams { nombre: string; rol: string; loginUrl: string }
interface EmailEntrevistaParams {
  nombre: string; vacante: string; empresa: string
  fecha: string; hora: string; modalidad: string
  enlace?: string; direccion?: string
  confirmUrl: string; expiresHoras: number
}
interface EmailReferenciaParams { nombreCandidato: string; cargo: string; empresa: string; verificarUrl: string }

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       '#0a0f1e',
  card:     '#111827',
  border:   '#1f2937',
  blue:     '#2563a8',
  green:    '#5aaa2a',
  cyan:     '#00d4ff',
  text:     '#f1f5f9',
  muted:    '#94a3b8',
  dim:      '#64748b',
}

const wrapper = (content: string) => `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#000;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000;">
  <tr><td align="center" style="padding:24px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:${C.bg};border:1px solid ${C.border};border-radius:12px;overflow:hidden;">
      <tr><td style="padding:0 32px 32px;">
        <!-- Header -->
        <div style="height:4px;background:linear-gradient(90deg,${C.blue},${C.cyan},${C.green});border-radius:12px 12px 0 0;"></div>
        <div style="text-align:center;padding:28px 0 20px;">
          <span style="font-size:22px;font-weight:800;color:${C.blue};">worindev</span>
          <span style="font-size:11px;color:${C.dim};display:block;letter-spacing:2px;margin-top:2px;">WORK IN DEVELOPMENT</span>
        </div>
        ${content}
        <!-- Footer -->
        <div style="border-top:1px solid ${C.border};padding-top:20px;margin-top:28px;text-align:center;">
          <p style="color:${C.dim};font-size:11px;margin:0;">© 2025 Worindev · Medellín, Colombia 🇨🇴</p>
          <p style="color:${C.dim};font-size:10px;margin:4px 0 0;">Tecnología transformando el mercado laboral</p>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`

// ─── 1. BIENVENIDA ────────────────────────────────────────────────────────────
export const emailBienvenida = (p: EmailBienvenidaParams) => ({
  subject: `¡Bienvenido a Worindev, ${p.nombre}! 🚀`,
  html: wrapper(`
    <div style="text-align:center;margin-bottom:8px;">
      <span style="font-size:40px;">🎉</span>
      <h2 style="color:${C.text};font-size:22px;font-weight:700;margin:8px 0;">¡Hola ${p.nombre}!</h2>
      <p style="color:${C.muted};font-size:14px;line-height:1.7;margin:0;">
        Tu cuenta como <strong style="color:${C.text};">${p.rol}</strong> fue creada exitosamente.
      </p>
    </div>
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:${C.muted};font-size:13px;margin:0 0 16px;">Comienza a explorar la plataforma</p>
      <a href="${p.loginUrl}" style="display:inline-block;background:linear-gradient(135deg,${C.blue},${C.green});color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Ingresar a Worindev →
      </a>
    </div>
  `)
})

// ─── 2. OTP ───────────────────────────────────────────────────────────────────
export const emailOtp = (p: EmailOtpParams) => ({
  subject: 'Código de recuperación — Worindev 🔐',
  html: wrapper(`
    <div style="text-align:center;">
      <span style="font-size:40px;">🔐</span>
      <h2 style="color:${C.text};font-size:20px;font-weight:700;margin:8px 0;">Recuperar Contraseña</h2>
      <p style="color:${C.muted};font-size:14px;margin:0 0 24px;">Hola <strong style="color:${C.text};">${p.nombre}</strong>, usa este código:</p>
    </div>
    <div style="background:${C.card};border:2px solid ${C.blue};border-radius:16px;padding:28px;text-align:center;margin:0 auto 24px;">
      <p style="color:${C.dim};font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Tu código OTP</p>
      <div style="font-size:48px;font-weight:900;letter-spacing:16px;color:${C.text};font-family:'Courier New',monospace;">${p.otp}</div>
    </div>
    <p style="color:${C.dim};font-size:12px;text-align:center;">⏱️ Expira en <strong style="color:#f59e0b;">15 minutos</strong> · Si no lo solicitaste, ignora este correo.</p>
  `)
})

// ─── 3. ENTREVISTA GRUPAL ─────────────────────────────────────────────────────
export const emailEntrevista = (p: EmailEntrevistaParams) => ({
  subject: `🎯 ¡Fuiste seleccionado para entrevista! — ${p.vacante}`,
  html: wrapper(`
    <div style="text-align:center;margin-bottom:8px;">
      <span style="font-size:40px;">🎯</span>
      <h2 style="color:${C.text};font-size:22px;font-weight:700;margin:8px 0;">¡Felicitaciones, ${p.nombre}!</h2>
      <p style="color:${C.muted};font-size:14px;line-height:1.7;margin:0;">
        Alcanzaste el <strong style="color:${C.green};">93% de compatibilidad</strong> con la vacante
        <strong style="color:${C.text};">${p.vacante}</strong> en <strong style="color:${C.text};">${p.empresa}</strong>.
      </p>
    </div>
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:20px;margin:20px 0;">
      <p style="color:${C.dim};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px;font-weight:600;">Detalles de la entrevista</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:${C.muted};font-size:13px;padding:4px 0;">📅 Fecha</td><td style="color:${C.text};font-size:13px;font-weight:600;">${p.fecha}</td></tr>
        <tr><td style="color:${C.muted};font-size:13px;padding:4px 0;">⏰ Hora</td><td style="color:${C.text};font-size:13px;font-weight:600;">${p.hora}</td></tr>
        <tr><td style="color:${C.muted};font-size:13px;padding:4px 0;">📍 Modalidad</td><td style="color:${C.text};font-size:13px;font-weight:600;">${p.modalidad}</td></tr>
        ${p.enlace ? `<tr><td style="color:${C.muted};font-size:13px;padding:4px 0;">🔗 Enlace</td><td><a href="${p.enlace}" style="color:${C.cyan};font-size:13px;">${p.enlace}</a></td></tr>` : ''}
        ${p.direccion ? `<tr><td style="color:${C.muted};font-size:13px;padding:4px 0;">🏢 Dirección</td><td style="color:${C.text};font-size:13px;">${p.direccion}</td></tr>` : ''}
      </table>
    </div>
    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:14px 18px;margin:16px 0;">
      <p style="color:#f59e0b;font-size:13px;margin:0;">⚠️ Tienes <strong>${p.expiresHoras} horas</strong> para confirmar tu asistencia. Si no confirmas, el siguiente candidato será convocado.</p>
    </div>
    <div style="text-align:center;margin-top:20px;">
      <a href="${p.confirmUrl}" style="display:inline-block;background:linear-gradient(135deg,${C.green},${C.blue});color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        ✅ Confirmar asistencia
      </a>
    </div>
  `)
})

// ─── 4. VERIFICACIÓN DE REFERENCIA ───────────────────────────────────────────
export const emailReferencia = (p: EmailReferenciaParams) => ({
  subject: `Verificación de referencia laboral — ${p.nombreCandidato}`,
  html: wrapper(`
    <div style="text-align:center;margin-bottom:8px;">
      <span style="font-size:40px;">📋</span>
      <h2 style="color:${C.text};font-size:20px;font-weight:700;margin:8px 0;">Verificación de Referencia</h2>
      <p style="color:${C.muted};font-size:14px;line-height:1.7;margin:0;">
        <strong style="color:${C.text};">${p.nombreCandidato}</strong> te ha registrado como referencia laboral
        para el cargo de <strong style="color:${C.text};">${p.cargo}</strong> en <strong style="color:${C.text};">${p.empresa}</strong>.
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="${p.verificarUrl}" style="display:inline-block;background:linear-gradient(135deg,${C.blue},${C.green});color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        Verificar referencia →
      </a>
    </div>
    <p style="color:${C.dim};font-size:12px;text-align:center;margin-top:16px;">Si no conoces a esta persona, ignora este correo.</p>
  `)
})
