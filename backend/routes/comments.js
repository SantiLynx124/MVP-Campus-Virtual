/**
 * Rutas de comentarios
 * Maneja la creación y obtención de comentarios en materiales
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCommentsByMaterial,
  createComment
} = require('../controllers/commentsController');

// Obtener comentarios de un material
router.get('/material/:materialId', authenticateToken, getCommentsByMaterial);

// Crear un comentario
router.post('/', authenticateToken, createComment);

module.exports = router;

