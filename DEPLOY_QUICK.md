# 🚀 Deployment Rápido en Vercel

## Resumen Rápido

### 1. Backend en Railway (5 minutos)

1. Ve a [railway.app](https://railway.app) y crea cuenta
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repo y carpeta `backend`
4. Variables de entorno:
   - `JWT_SECRET`: Genera uno (ej: `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS`: Lo agregarás después con la URL de Vercel
5. Copia la URL del deploy (ej: `https://tu-backend.railway.app`)

### 2. Frontend en Vercel (5 minutos)

1. Ve a [vercel.com](https://vercel.com) y crea cuenta
2. "Add New Project" → Importa tu repo de GitHub
3. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Variables de entorno:
   - `VITE_API_URL`: Pega la URL de Railway (ej: `https://tu-backend.railway.app`)
5. Click "Deploy"

### 3. Actualizar CORS

1. Vuelve a Railway
2. Agrega/actualiza `ALLOWED_ORIGINS`:
   ```
   https://tu-proyecto.vercel.app
   ```
3. Reinicia el servicio

### 4. ¡Listo! 🎉

Tu app estará en: `https://tu-proyecto.vercel.app`

---

## Variables de Entorno Necesarias

### Backend (Railway)
```
JWT_SECRET=tu_secret_key_segura_aqui
ALLOWED_ORIGINS=https://tu-proyecto.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://tu-backend.railway.app
```

---

## Notas Importantes

⚠️ **En producción:**
- Los archivos en `backend/uploads/` se perderán en cada redeploy
- Los datos JSON se perderán en cada redeploy
- Considera usar servicios externos para almacenamiento y base de datos

✅ **Para producción real:**
- Usa MongoDB Atlas o PostgreSQL para base de datos
- Usa S3 o Cloudinary para archivos
- Implementa hash de contraseñas con bcrypt
- Agrega rate limiting



