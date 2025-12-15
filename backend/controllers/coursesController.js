/**
 * Controlador de cursos
 * Maneja la lógica de obtención de cursos
 */

const { getCourses } = require('../utils/dataStorage');

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
  getCourseById
};

