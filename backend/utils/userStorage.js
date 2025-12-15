/**
 * Utilidades para almacenamiento de usuarios
 * Usa archivos JSON para simular una base de datos
 */

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

/**
 * Obtener todos los usuarios
 */
const getUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      // Crear usuarios iniciales si el archivo no existe
      const initialUsers = [
        {
          id: 1,
          email: 'estudiante@uss.edu.pe',
          password: '123456',
          name: 'Santiago Huamán',
          role: 'estudiante',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'docente@uss.edu.pe',
          password: '123456',
          name: 'Prof. Jorge Castañeda',
          role: 'docente',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          email: 'ana@uss.edu.pe',
          password: '123456',
          name: 'Ana López',
          role: 'estudiante',
          createdAt: new Date().toISOString()
        }
      ];
      saveUsers(initialUsers);
      return initialUsers;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
};

/**
 * Guardar usuarios en el archivo
 */
const saveUsers = (users) => {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error guardando usuarios:', error);
  }
};

/**
 * Buscar usuario por email
 */
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

/**
 * Buscar usuario por ID
 */
const findUserById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

module.exports = {
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById
};

