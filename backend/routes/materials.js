/**
 * Rutas de materiales educativos
 * Maneja la subida, obtención y gestión de materiales (apuntes, PDFs, enlaces)
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const {
  getMaterialsByCourse,
  uploadMaterial,
  likeMaterial,
  unlikeMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/materialsController');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB máximo
});

// Obtener materiales de un curso
router.get('/course/:courseId', authenticateToken, getMaterialsByCourse);

// Subir material (solo estudiantes)
router.post('/upload', authenticateToken, upload.single('file'), uploadMaterial);

// Dar like a un material
router.post('/:materialId/like', authenticateToken, likeMaterial);

// Quitar like de un material
router.delete('/:materialId/like', authenticateToken, unlikeMaterial);

// Editar un material (solo el autor)
router.put('/:materialId', authenticateToken, upload.single('file'), updateMaterial);

// Eliminar un material (solo el autor)
router.delete('/:materialId', authenticateToken, deleteMaterial);

module.exports = router;

