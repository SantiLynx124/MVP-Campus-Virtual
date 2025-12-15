/**
 * Servidor principal del backend
 * Plataforma educativa colaborativa - MVP
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar rutas
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const materialsRoutes = require('./routes/materials');
const commentsRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configurar CORS para permitir requests desde el frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para materiales subidos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Crear PDF de ejemplo si no existe (de forma asíncrona)
try {
  const { createSamplePDF } = require('./utils/createSamplePDF');
  createSamplePDF()
    .then(() => {
      console.log('📄 PDF de ejemplo creado/verificado: sql-ejercicios.pdf');
    })
    .catch((error) => {
      console.log('⚠️  No se pudo crear el PDF de ejemplo:', error.message);
      console.log('💡 Ejecuta: npm install pdfkit');
    });
} catch (error) {
  console.log('⚠️  No se pudo cargar el módulo de PDF (instala pdfkit: npm install)');
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/comments', commentsRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
});

