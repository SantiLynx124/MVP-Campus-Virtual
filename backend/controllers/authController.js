/**
 * Controlador de autenticación
 * Maneja la lógica de registro, login y verificación de usuarios
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const { getUsers, saveUsers, findUserByEmail } = require('../utils/userStorage');

/**
 * Registro de nuevo usuario
 * Valida que el correo sea institucional (termina en .edu.pe)
 */
const registerUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validaciones básicas
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar correo institucional peruano (simulado)
    if (!email.endsWith('.edu.pe') && !email.includes('@university')) {
      return res.status(400).json({ 
        error: 'Debe usar un correo institucional (.edu.pe)' 
      });
    }

    // Validar rol
    if (!['estudiante', 'docente'].includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Rol inválido. Use: estudiante o docente' });
    }

    // Verificar si el usuario ya existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Crear nuevo usuario (en producción, la contraseña debería estar hasheada)
    const users = getUsers();
    const newUser = {
      id: users.length + 1,
      email,
      password, // En producción usar bcrypt
      name,
      role: role.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Autenticación de usuario (login)
 */
const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener información del usuario actual
 */
const getCurrentUser = (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  getCurrentUser
};

