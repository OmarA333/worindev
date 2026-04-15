# Troubleshooting - Página de Currículum

## Problema: La página de Currículum no abre

### Síntomas
- La página carga pero muestra "Error al cargar perfil"
- No aparece ningún contenido
- La consola del navegador muestra errores

### Soluciones

#### 1. Verificar Token
Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.getItem('wrd_token')
```

Si devuelve `null`, necesitas iniciar sesión nuevamente.

#### 2. Verificar Rol de Usuario
El endpoint `/api/candidatos/me` requiere que el usuario tenga rol `CANDIDATO`.

Verifica tu rol en la consola:
```javascript
JSON.parse(localStorage.getItem('wrd_user')).role
```

Debe mostrar: `"CANDIDATO"`

#### 3. Verificar API URL
En la consola, verifica que la API URL sea correcta:
```javascript
// Debería mostrar algo como: http://localhost:3003
```

#### 4. Verificar Conexión al Backend
Abre la consola del navegador (F12) → Pestaña "Network" y recarga la página.

Busca la solicitud a `/api/candidatos/me`:
- **Status 200**: OK, el problema está en el frontend
- **Status 401**: No autenticado, verifica el token
- **Status 403**: No tienes permisos, verifica tu rol
- **Status 404**: Endpoint no encontrado, verifica las rutas del backend
- **Status 500**: Error del servidor, revisa los logs del backend

#### 5. Revisar Logs del Backend
En la terminal donde corre el backend, busca errores:

```bash
# Deberías ver algo como:
GET /api/candidatos/me 200 45ms
```

Si ves un error 500, revisa la salida completa.

#### 6. Verificar que el Candidato Existe
En la base de datos, verifica que existe un registro de candidato para tu usuario:

```sql
SELECT * FROM candidato WHERE "usuarioId" = <tu_usuario_id>;
```

Si no existe, crea uno:
```sql
INSERT INTO candidato (
  "usuarioId", nombre, apellido, "createdAt", "updatedAt"
) VALUES (
  <tu_usuario_id>, 'Tu Nombre', 'Tu Apellido', NOW(), NOW()
);
```

### Pasos de Debugging

1. **Abre la consola del navegador** (F12)
2. **Recarga la página** (F5)
3. **Busca mensajes de error** en la consola
4. **Copia el error completo** y búscalo en este documento

### Errores Comunes

#### Error: "Error al cargar perfil: 401"
**Causa**: Token expirado o inválido
**Solución**: Cierra sesión y vuelve a iniciar sesión

#### Error: "Error al cargar perfil: 403"
**Causa**: No tienes rol CANDIDATO
**Solución**: Verifica que tu usuario sea un candidato, no una empresa o admin

#### Error: "Error al cargar perfil: 404"
**Causa**: El endpoint no existe o las rutas no están configuradas correctamente
**Solución**: 
1. Verifica que `candidato.routes.ts` tenga la ruta `/me`
2. Reinicia el servidor backend
3. Verifica que el archivo esté guardado

#### Error: "Error al cargar perfil: 500"
**Causa**: Error en el servidor
**Solución**: 
1. Revisa los logs del backend
2. Verifica que la base de datos esté conectada
3. Verifica que el candidato existe en la BD

### Verificación Rápida

Ejecuta estos comandos en la consola del navegador:

```javascript
// 1. Verificar token
console.log('Token:', localStorage.getItem('wrd_token') ? 'OK' : 'FALTA');

// 2. Verificar usuario
const user = JSON.parse(localStorage.getItem('wrd_user'));
console.log('Usuario:', user.name, 'Rol:', user.role);

// 3. Hacer solicitud manual
fetch('http://localhost:3003/api/candidatos/me', {
  headers: { Authorization: `Bearer ${localStorage.getItem('wrd_token')}` }
})
.then(r => r.json())
.then(d => console.log('Respuesta:', d))
.catch(e => console.error('Error:', e));
```

### Si Nada Funciona

1. **Reinicia el backend**:
```bash
cd Backend-worindev
npm run dev
```

2. **Reinicia el frontend**:
```bash
cd Frontend-Worindev
npm run dev
```

3. **Limpia el navegador**:
   - Abre DevTools (F12)
   - Haz clic derecho en el botón de recargar
   - Selecciona "Vaciar caché y recargar"

4. **Verifica la base de datos**:
```bash
npm run studio
```

Navega a `candidato` y verifica que exista un registro para tu usuario.

### Contacto

Si el problema persiste, proporciona:
1. El error exacto de la consola
2. El status code de la solicitud (401, 403, 404, 500, etc.)
3. Los logs del backend
4. Tu rol de usuario
