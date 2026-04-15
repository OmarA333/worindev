# Setup de Subida de Archivos PDF

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará `multer` que es necesario para manejar subidas de archivos.

### 2. Crear carpeta de uploads

La carpeta `uploads/` se crea automáticamente cuando se inicia el servidor. Si quieres crearla manualmente:

```bash
mkdir uploads
```

### 3. Iniciar el servidor

```bash
npm run dev
```

## Uso

### Subir CV desde el Frontend

1. Ir a "Mi Carrera" → "Mi Currículum"
2. En la sección "Personal", encontrarás el área de subida de CV
3. Haz clic o arrastra un archivo PDF
4. El archivo se subirá automáticamente

### Validaciones

- **Tipo de archivo**: Solo PDF
- **Tamaño máximo**: 5MB
- **Ubicación**: `/uploads/` en el servidor

### Endpoint de Subida

```bash
POST /api/candidatos/:id/cv
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- cv: <archivo PDF>
```

### Respuesta

```json
{
  "message": "CV subido exitosamente",
  "candidato": { ... },
  "cvUrl": "/uploads/cv-1234567890-123456789.pdf"
}
```

### Descargar CV

Los CVs se sirven desde `/uploads/` y pueden descargarse directamente:

```
GET http://localhost:3003/uploads/cv-1234567890-123456789.pdf
```

## Estructura de Archivos

```
Backend-worindev/
├── uploads/                          # Carpeta de archivos subidos
│   ├── cv-1234567890-123456789.pdf
│   └── cv-9876543210-987654321.pdf
├── src/
│   ├── middlewares/
│   │   └── upload.middleware.ts      # Configuración de multer
│   ├── modules/
│   │   └── candidatos/
│   │       ├── candidato.controller.ts
│   │       ├── candidato.services.ts
│   │       └── candidato.routes.ts
│   └── App.ts                        # Configuración de archivos estáticos
└── package.json
```

## Configuración

### Límite de Tamaño

Para cambiar el límite de tamaño de archivos, edita `src/middlewares/upload.middleware.ts`:

```typescript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB en lugar de 5MB
}
```

### Tipos de Archivo Permitidos

Para permitir otros tipos de archivo, edita el filtro en `src/middlewares/upload.middleware.ts`:

```typescript
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf', 'application/msword'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};
```

## Seguridad

### Consideraciones Importantes

1. **Validación de Archivos**: Se valida el tipo MIME y el tamaño
2. **Nombres Únicos**: Los archivos se renombran con timestamp para evitar conflictos
3. **Autenticación**: Solo usuarios autenticados pueden subir archivos
4. **Autorización**: Solo el candidato o admin pueden subir su CV

### Mejoras Futuras

- [ ] Validar contenido del PDF (no solo extensión)
- [ ] Escanear archivos con antivirus
- [ ] Comprimir PDFs antes de almacenar
- [ ] Usar almacenamiento en la nube (AWS S3, Google Cloud Storage)
- [ ] Implementar versionado de archivos
- [ ] Agregar límite de rate limiting para uploads

## Troubleshooting

### Error: "ENOENT: no such file or directory, open 'uploads'"

**Solución**: La carpeta `uploads/` no existe. Se crea automáticamente al iniciar el servidor. Si persiste:

```bash
mkdir -p uploads
```

### Error: "File too large"

**Solución**: El archivo excede 5MB. Comprime el PDF o reduce su tamaño.

### Error: "Only PDF files are allowed"

**Solución**: Asegúrate de que el archivo sea un PDF válido. Algunos archivos pueden tener extensión .pdf pero no ser PDFs reales.

### Los archivos no se sirven correctamente

**Solución**: Verifica que `app.use('/uploads', express.static(...))` esté configurado en `App.ts` antes de las rutas.

## Almacenamiento en la Nube (Opcional)

Para usar AWS S3 en lugar de almacenamiento local:

```bash
npm install aws-sdk
```

Luego modifica `upload.middleware.ts` para usar S3 en lugar de diskStorage.

## Limpieza de Archivos

Para limpiar archivos antiguos:

```bash
# Eliminar archivos más antiguos de 30 días
find uploads -type f -mtime +30 -delete
```

O crea un script de limpieza automática en `scripts/cleanup-uploads.ts`.
