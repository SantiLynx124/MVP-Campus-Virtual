/**
 * Middleware de autenticación
 * Verifica el token JWT en las peticiones protegidas
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'edtech_mvp_secret_key_2024';

/**
 * Middleware para verificar el token de autenticación
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user; // Agregar información del usuario a la petición
    next();
  });
};

module.exports = { authenticateToken, JWT_SECRET };




