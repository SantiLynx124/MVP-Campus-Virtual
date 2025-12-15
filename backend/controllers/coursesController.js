/**
 * Controlador de cursos
 * Maneja la lógica de obtención de cursos
 */

const { getCourses, saveCourses } = require('../utils/dataStorage');
const { findUserById } = require('../utils/userStorage');

/**
 * Obtener todos los cursos disponibles
 */
const getAllCourses = (req, res) => {
  try {
    const courses = getCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};

/**
 * Obtener un curso por ID
 */
const getCourseById = (req, res) => {
  try {
    const { id } = req.params;
    const courses = getCourses();
    const course = courses.find(c => c.id === parseInt(id));

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error obteniendo curso:', error);
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse
};

/**
 * Crear un nuevo curso (solo docentes)
 */
function createCourse(req, res) {
  try {
    const { name, code, description, semester } = req.body;
    const userId = req.user?.id;

    // Validaciones básicas
    if (!name || !code || !semester) {
      return res.status(400).json({ error: 'name, code y semester son requeridos' });
    }

    const user = findUserById(userId);
    if (!user || user.role !== 'docente') {
      return res.status(403).json({ error: 'Solo los docentes pueden crear cursos' });
    }

    const courses = getCourses();
    // Evitar códigos duplicados
    if (courses.some(c => c.code.toLowerCase() === code.toLowerCase())) {
      return res.status(400).json({ error: 'El código del curso ya existe' });
    }

    const nextId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const newCourse = {
      id: nextId,
      name,
      code,
      description: description || '',
      instructor: user.name,
      semester,
      studentsCount: 0,
      createdAt: new Date().toISOString()
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.status(201).json({ message: 'Curso creado exitosamente', course: newCourse });
  } catch (error) {
    console.error('Error creando curso:', error);
    res.status(500).json({ error: 'Error al crear el curso' });
  }
}



