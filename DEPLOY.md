# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar tu aplicación Campus Virtual en Vercel.

## 📋 Opciones de Deployment

### Opción 1: Frontend en Vercel + Backend en Railway/Render (Recomendado)

Esta es la opción más sencilla y recomendada para un MVP.

#### Frontend en Vercel

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   ```

2. **Instalar Vercel CLI (opcional):**
   ```bash
   npm i -g vercel
   ```

3. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la carpeta `frontend`:
   ```env
   VITE_API_URL=https://tu-backend-url.railway.app
   ```
   O si usas Render:
   ```env
   VITE_API_URL=https://tu-backend.onrender.com
   ```

4. **Desplegar:**
   
   **Opción A: Desde la web de Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket
   - Selecciona la carpeta `frontend`
   - Configura:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Agrega la variable de entorno `VITE_API_URL` con la URL de tu backend
   - Click en "Deploy"

   **Opción B: Desde la terminal**
   ```bash
   cd frontend
   vercel
   ```
   Sigue las instrucciones y cuando te pregunte por variables de entorno, agrega `VITE_API_URL`

#### Backend en Railway (Recomendado)

1. **Crear cuenta en [railway.app](https://railway.app)**

2. **Crear nuevo proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo" (o sube el código)

3. **Configurar el servicio:**
   - Selecciona la carpeta `backend`
   - Railway detectará automáticamente que es Node.js

4. **Variables de entorno:**
   - Agrega en Railway:
     - `PORT` (Railway lo asigna automáticamente, pero puedes usar 5000)
     - `JWT_SECRET` (genera uno seguro)

5. **Deploy:**
   - Railway desplegará automáticamente
   - Copia la URL generada (ej: `https://tu-proyecto.railway.app`)

6. **Actualizar frontend:**
   - Ve a Vercel y actualiza `VITE_API_URL` con la URL de Railway

#### Backend en Render (Alternativa)

1. **Crear cuenta en [render.com](https://render.com)**

2. **Crear nuevo Web Service:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio
   - Configura:
     - Name: `campus-virtual-backend`
     - Environment: `Node`
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
     - Root Directory: `backend`

3. **Variables de entorno:**
   - Agrega `JWT_SECRET` y `PORT=5000`

4. **Deploy:**
   - Render desplegará automáticamente
   - Copia la URL generada

---

### Opción 2: Todo en Vercel (Frontend + Backend como Serverless Functions)

Esta opción requiere adaptar el backend a funciones serverless.

#### Ventajas:
- Todo en un solo lugar
- Deploy automático desde un repo

#### Desventajas:
- Requiere refactorizar el backend
- Límites de tiempo de ejecución (10s en plan gratuito)
- Más complejo para archivos grandes

Si quieres esta opción, necesitarías:
1. Convertir las rutas Express a Serverless Functions
2. Usar un servicio externo para almacenar archivos (S3, Cloudinary, etc.)
3. Usar una base de datos externa (MongoDB Atlas, Supabase, etc.)

---

## 🔧 Configuración Necesaria

### 1. Actualizar `frontend/src/services/api.js`

El archivo ya está configurado para usar variables de entorno. Solo asegúrate de que tenga:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ...
});
```

### 2. Variables de Entorno en Vercel

En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega:
   - `VITE_API_URL`: URL completa de tu backend (ej: `https://tu-backend.railway.app`)

### 3. Configurar CORS en el Backend

Asegúrate de que el backend permita requests desde tu dominio de Vercel:

```javascript
// En backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tu-proyecto.vercel.app'
  ]
}));
```

---

## 📝 Pasos Detallados (Opción 1 - Recomendada)

### Paso 1: Preparar Backend para Producción

1. **Actualizar CORS:**
   ```javascript
   // backend/server.js
   const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
   app.use(cors({
     origin: allowedOrigins,
     credentials: true
   }));
   ```

2. **Usar variables de entorno:**
   ```javascript
   // backend/server.js
   const PORT = process.env.PORT || 5000;
   const JWT_SECRET = process.env.JWT_SECRET || 'edtech_mvp_secret_key_2024';
   ```

### Paso 2: Desplegar Backend en Railway

1. Sube tu código a GitHub
2. En Railway, conecta el repositorio
3. Selecciona la carpeta `backend`
4. Railway detectará automáticamente Node.js
5. Agrega variables de entorno:
   - `JWT_SECRET`: Genera uno seguro (ej: `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS`: URL de tu frontend en Vercel (se agregará después)
6. Copia la URL del deploy (ej: `https://campus-virtual-backend.railway.app`)

### Paso 3: Desplegar Frontend en Vercel

1. **Desde la web:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Configura:
     - Framework Preset: **Vite**
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Agrega variable de entorno:
     - `VITE_API_URL`: URL de tu backend en Railway
   - Click en "Deploy"

2. **Actualizar CORS en backend:**
   - Vuelve a Railway
   - Agrega/actualiza `ALLOWED_ORIGINS` con la URL de Vercel:
     ```
     https://tu-proyecto.vercel.app,https://tu-proyecto-git-main.vercel.app
     ```
   - Reinicia el servicio

### Paso 4: Verificar

1. Visita tu URL de Vercel
2. Prueba login/registro
3. Verifica que los materiales se carguen correctamente

---

## 🐛 Solución de Problemas Comunes

### Error: CORS
- Verifica que `ALLOWED_ORIGINS` en el backend incluya tu dominio de Vercel
- Asegúrate de incluir todas las variantes (con y sin www, con y sin https)

### Error: API no responde
- Verifica que `VITE_API_URL` esté configurada correctamente en Vercel
- Revisa los logs en Railway/Render
- Verifica que el backend esté corriendo

### Error: Archivos no se cargan
- Los archivos en `backend/uploads/` se perderán en cada redeploy
- Considera usar un servicio de almacenamiento (S3, Cloudinary) para producción

### Error: Base de datos
- Los archivos JSON se perderán en cada redeploy
- Para producción, usa una base de datos real (MongoDB Atlas, PostgreSQL, etc.)

---

## 📦 Archivos de Configuración Creados

- `frontend/vercel.json` - Configuración de Vercel para el frontend
- `DEPLOY.md` - Esta guía

---

## 🔐 Seguridad en Producción

**IMPORTANTE:** Antes de desplegar a producción:

1. ✅ Cambia `JWT_SECRET` por uno seguro
2. ✅ Usa HTTPS (Vercel y Railway lo proporcionan automáticamente)
3. ✅ Implementa rate limiting
4. ✅ Usa una base de datos real (no JSON files)
5. ✅ Hash de contraseñas con bcrypt
6. ✅ Validación de entrada más estricta
7. ✅ Manejo de errores sin exponer información sensible

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Render](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**¡Listo para desplegar!** 🚀




