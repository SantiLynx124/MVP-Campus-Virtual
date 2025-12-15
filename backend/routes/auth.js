/**
 * Rutas de autenticación
 * Maneja login, registro y verificación de usuarios
 */

const express = require('express');
const router = express.Router();
const { authenticateUser, registerUser, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Registro de usuario (simulado con correo institucional)
router.post('/register', registerUser);

// Login de usuario
router.post('/login', authenticateUser);

// Obtener usuario actual (requiere autenticación)
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;


