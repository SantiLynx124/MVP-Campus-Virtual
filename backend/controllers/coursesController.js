/**
 * Controlador de cursos
 * Maneja la lógica de obtención y gestión de cursos
 */

const { getCourses, saveCourses, getMaterials, saveMaterials, getComments, saveComments } = require('../utils/dataStorage');
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

/**
 * Eliminar un curso (solo docentes, idealmente el mismo instructor)
 */
function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const courseId = parseInt(id);
    const userId = req.user?.id;

    const user = findUserById(userId);
    if (!user || user.role !== 'docente') {
      return res.status(403).json({ error: 'Solo los docentes pueden eliminar cursos' });
    }

    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const course = courses[courseIndex];

    // Solo el docente que figura como instructor puede borrarlo (regla simple)
    if (course.instructor !== user.name) {
      return res.status(403).json({ error: 'Solo el docente responsable del curso puede eliminarlo' });
    }

    // Eliminar materiales y comentarios asociados al curso
    const materials = getMaterials();
    const courseMaterials = materials.filter(m => m.courseId === courseId);
    const remainingMaterials = materials.filter(m => m.courseId !== courseId);
    saveMaterials(remainingMaterials);

    const comments = getComments();
    const materialIds = new Set(courseMaterials.map(m => m.id));
    const remainingComments = comments.filter(c => !materialIds.has(c.materialId));
    saveComments(remainingComments);

    // Eliminar el curso
    courses.splice(courseIndex, 1);
    saveCourses(courses);

    res.json({ message: 'Curso y materiales asociados eliminados correctamente' });
  } catch (error) {
    console.error('Error eliminando curso:', error);
    res.status(500).json({ error: 'Error al eliminar el curso' });
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse
};