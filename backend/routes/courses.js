/**
 * Rutas de cursos
 * Maneja la obtención de cursos y sus detalles
 */

const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse } = require('../controllers/coursesController');
const { authenticateToken } = require('../middleware/auth');

// Obtener todos los cursos (requiere autenticación)
router.get('/', authenticateToken, getAllCourses);

// Obtener un curso por ID (requiere autenticación)
router.get('/:id', authenticateToken, getCourseById);

// Crear curso (solo docentes)
router.post('/', authenticateToken, createCourse);

module.exports = router;



