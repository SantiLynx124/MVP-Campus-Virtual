/**
 * Controlador de materiales educativos
 * Maneja la subida, obtención y gestión de materiales
 */

const { getMaterials, saveMaterials, getCourses, getComments, saveComments } = require('../utils/dataStorage');
const { getUsers } = require('../utils/userStorage');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * Obtener materiales de un curso específico
 */
const getMaterialsByCourse = (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = getMaterials();
    const courseMaterials = materials.filter(m => m.courseId === parseInt(courseId));
    
    res.json(courseMaterials);
  } catch (error) {
    console.error('Error obteniendo materiales:', error);
    res.status(500).json({ error: 'Error al obtener los materiales' });
  }
};

/**
 * Subir un nuevo material (solo estudiantes)
 */
const uploadMaterial = (req, res) => {
  try {
    const { courseId, title, description, type, url } = req.body;
    const userId = req.user.id;

    // Verificar que el usuario sea estudiante
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user.role !== 'estudiante') {
      return res.status(403).json({ 
        error: 'Solo los estudiantes pueden subir materiales' 
      });
    }

    // Validaciones
    if (!courseId || !title || !type) {
      return res.status(400).json({ 
        error: 'courseId, title y type son requeridos' 
      });
    }

    // Verificar que el curso existe
    const courses = getCourses();
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Crear nuevo material
    const materials = getMaterials();
    const newMaterial = {
      id: uuidv4(),
      courseId: parseInt(courseId),
      userId,
      userName: user.name,
      title,
      description: description || '',
      type, // 'apunte', 'pdf', 'enlace'
      url: url || (req.file ? `/uploads/${req.file.filename}` : ''),
      fileName: req.file ? req.file.originalname : null,
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    materials.push(newMaterial);
    saveMaterials(materials);

    res.status(201).json({
      message: 'Material subido exitosamente',
      material: newMaterial
    });
  } catch (error) {
    console.error('Error subiendo material:', error);
    res.status(500).json({ error: 'Error al subir el material' });
  }
};

/**
 * Dar like a un material
 */
const likeMaterial = (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.id;

    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Verificar si ya dio like
    if (material.likes.includes(userId)) {
      return res.status(400).json({ error: 'Ya has dado like a este material' });
    }

    // Agregar like
    material.likes.push(userId);
    material.likesCount = material.likes.length;
    saveMaterials(materials);

    res.json({
      message: 'Like agregado',
      likesCount: material.likesCount
    });
  } catch (error) {
    console.error('Error dando like:', error);
    res.status(500).json({ error: 'Error al dar like' });
  }
};

/**
 * Quitar like de un material
 */
const unlikeMaterial = (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.id;

    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Quitar like
    material.likes = material.likes.filter(id => id !== userId);
    material.likesCount = material.likes.length;
    saveMaterials(materials);

    res.json({
      message: 'Like removido',
      likesCount: material.likesCount
    });
  } catch (error) {
    console.error('Error quitando like:', error);
    res.status(500).json({ error: 'Error al quitar like' });
  }
};

/**
 * Editar un material existente (solo el autor)
 */
const updateMaterial = (req, res) => {
  try {
    const { materialId } = req.params;
    const { title, description, type, url } = req.body;
    const userId = req.user.id;

    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Verificar que el usuario es el autor
    if (material.userId !== userId) {
      return res.status(403).json({ 
        error: 'Solo el autor puede editar este material' 
      });
    }

    // Validaciones
    if (!title || !type) {
      return res.status(400).json({ 
        error: 'title y type son requeridos' 
      });
    }

    // Actualizar material
    material.title = title;
    material.description = description || '';
    material.type = type;
    
    // Si es un enlace, actualizar URL
    if (type === 'enlace' && url) {
      material.url = url;
      material.fileName = null;
    }
    // Si es PDF y se sube un nuevo archivo
    if (type === 'pdf' && req.file) {
      // Eliminar archivo anterior si existe
      if (material.url && material.url.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', material.url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      material.url = `/uploads/${req.file.filename}`;
      material.fileName = req.file.originalname;
    }

    saveMaterials(materials);

    res.json({
      message: 'Material actualizado exitosamente',
      material
    });
  } catch (error) {
    console.error('Error actualizando material:', error);
    res.status(500).json({ error: 'Error al actualizar el material' });
  }
};

/**
 * Eliminar un material (solo el autor)
 */
const deleteMaterial = (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.id;

    const materials = getMaterials();
    const materialIndex = materials.findIndex(m => m.id === materialId);

    if (materialIndex === -1) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    const material = materials[materialIndex];

    // Verificar que el usuario es el autor
    if (material.userId !== userId) {
      return res.status(403).json({ 
        error: 'Solo el autor puede eliminar este material' 
      });
    }

    // Eliminar archivo físico si es PDF
    if (material.type === 'pdf' && material.url && material.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', material.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Eliminar comentarios asociados
    const comments = getComments();
    const filteredComments = comments.filter(c => c.materialId !== materialId);
    saveComments(filteredComments);

    // Eliminar material
    materials.splice(materialIndex, 1);
    saveMaterials(materials);

    res.json({
      message: 'Material eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando material:', error);
    res.status(500).json({ error: 'Error al eliminar el material' });
  }
};

module.exports = {
  getMaterialsByCourse,
  uploadMaterial,
  likeMaterial,
  unlikeMaterial,
  updateMaterial,
  deleteMaterial
};

