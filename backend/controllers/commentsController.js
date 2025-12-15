/**
 * Controlador de comentarios
 * Maneja la creación y obtención de comentarios en materiales
 */

const { getComments, saveComments, getMaterials, saveMaterials } = require('../utils/dataStorage');
const { getUsers } = require('../utils/userStorage');
const { v4: uuidv4 } = require('uuid');

/**
 * Obtener comentarios de un material
 */
const getCommentsByMaterial = (req, res) => {
  try {
    const { materialId } = req.params;
    const comments = getComments();
    const materialComments = comments
      .filter(c => c.materialId === materialId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json(materialComments);
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
};

/**
 * Crear un nuevo comentario
 */
const createComment = (req, res) => {
  try {
    const { materialId, content } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!materialId || !content) {
      return res.status(400).json({ 
        error: 'materialId y content son requeridos' 
      });
    }

    // Verificar que el material existe
    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Obtener información del usuario
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    // Crear nuevo comentario
    const comments = getComments();
    const newComment = {
      id: uuidv4(),
      materialId,
      userId,
      userName: user.name,
      userRole: user.role,
      content,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    saveComments(comments);

    // Actualizar contador de comentarios en el material
    material.commentsCount = comments.filter(c => c.materialId === materialId).length;
    saveMaterials(materials);

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment: newComment
    });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
};

module.exports = {
  getCommentsByMaterial,
  createComment
};

