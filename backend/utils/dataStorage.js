/**
 * Utilidades para almacenamiento de datos (cursos, materiales, comentarios)
 * Usa archivos JSON para simular una base de datos
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const MATERIALS_FILE = path.join(DATA_DIR, 'materials.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

// Asegurar que el directorio de datos existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * CURSOS
 */
const getCourses = () => {
  try {
    if (!fs.existsSync(COURSES_FILE)) {
      // Crear cursos iniciales
      const initialCourses = [
        {
          id: 1,
          name: 'Programación Web',
          code: 'CS301',
          description: 'Curso de desarrollo web con tecnologías modernas',
          instructor: 'Prof. Jorge Castañeda',
          semester: '2024-1',
          studentsCount: 45
        },
        {
          id: 2,
          name: 'Base de Datos',
          code: 'CS302',
          description: 'Diseño e implementación de bases de datos relacionales',
          instructor: 'Prof. Carlos Ramírez',
          semester: '2024-1',
          studentsCount: 38
        },
        {
          id: 3,
          name: 'Inteligencia Artificial',
          code: 'CS401',
          description: 'Fundamentos de IA y machine learning',
          instructor: 'Prof. Jorge Castañeda',
          semester: '2024-1',
          studentsCount: 52
        }
      ];
      saveCourses(initialCourses);
      return initialCourses;
    }
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo cursos:', error);
    return [];
  }
};

const saveCourses = (courses) => {
  try {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Error guardando cursos:', error);
  }
};

/**
 * MATERIALES
 */
const getMaterials = () => {
  try {
    if (!fs.existsSync(MATERIALS_FILE)) {
      // Crear materiales iniciales
      const initialMaterials = [
        {
          id: 'mat-001',
          courseId: 1,
          userId: 1,
          userName: 'Santiago Huamán',
          title: 'Apuntes de React Hooks',
          description: 'Resumen completo de hooks en React',
          type: 'apunte',
          url: '',
          fileName: null,
          likes: [2, 3],
          likesCount: 2,
          commentsCount: 3,
          createdAt: new Date(Date.now() - 86400000).toISOString() // Hace 1 día
        },
        {
          id: 'mat-002',
          courseId: 1,
          userId: 3,
          userName: 'Ana López',
          title: 'Guía de Tailwind CSS',
          description: 'Referencia rápida de clases de Tailwind',
          type: 'enlace',
          url: 'https://tailwindcss.com/docs',
          fileName: null,
          likes: [1],
          likesCount: 1,
          commentsCount: 1,
          createdAt: new Date(Date.now() - 43200000).toISOString() // Hace 12 horas
        },
        {
          id: 'mat-003',
          courseId: 2,
          userId: 1,
          userName: 'Santiago Huamán',
          title: 'Ejercicios de SQL',
          description: 'Colección de ejercicios prácticos de SQL con soluciones',
          type: 'pdf',
          url: '/uploads/sql-ejercicios.pdf',
          fileName: 'sql-ejercicios.pdf',
          likes: [2, 3],
          likesCount: 2,
          commentsCount: 2,
          createdAt: new Date(Date.now() - 3600000).toISOString() // Hace 1 hora
        }
      ];
      saveMaterials(initialMaterials);
      return initialMaterials;
    }
    const data = fs.readFileSync(MATERIALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo materiales:', error);
    return [];
  }
};

const saveMaterials = (materials) => {
  try {
    fs.writeFileSync(MATERIALS_FILE, JSON.stringify(materials, null, 2));
  } catch (error) {
    console.error('Error guardando materiales:', error);
  }
};

/**
 * COMENTARIOS
 */
const getComments = () => {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) {
      // Crear comentarios iniciales
      const initialComments = [
        {
          id: 'com-001',
          materialId: 'mat-001',
          userId: 2,
          userName: 'Prof. Jorge Castañeda',
          userRole: 'docente',
          content: 'Excelente resumen. Muy útil para los estudiantes.',
          createdAt: new Date(Date.now() - 82800000).toISOString()
        },
        {
          id: 'com-002',
          materialId: 'mat-001',
          userId: 3,
          userName: 'Ana López',
          userRole: 'estudiante',
          content: 'Gracias por compartir! Me ayudó mucho.',
          createdAt: new Date(Date.now() - 82800000).toISOString()
        },
        {
          id: 'com-003',
          materialId: 'mat-001',
          userId: 1,
          userName: 'Santiago Huamán',
          userRole: 'estudiante',
          content: 'De nada! Siéntete libre de preguntar si algo no está claro.',
          createdAt: new Date(Date.now() - 82800000).toISOString()
        }
      ];
      saveComments(initialComments);
      return initialComments;
    }
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo comentarios:', error);
    return [];
  }
};

const saveComments = (comments) => {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error guardando comentarios:', error);
  }
};

module.exports = {
  getCourses,
  saveCourses,
  getMaterials,
  saveMaterials,
  getComments,
  saveComments
};

