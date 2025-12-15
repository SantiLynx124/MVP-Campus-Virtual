/**
 * Tarjeta de material educativo
 * Muestra información del material y permite interacción (likes, comentarios)
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import { FiHeart, FiMessageSquare, FiFileText, FiLink, FiBook, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import CommentSection from './CommentSection';
import MaterialEdit from './MaterialEdit';

const MaterialCard = ({ material, comments, onLike, onCommentAdded, onMaterialUpdated, onMaterialDeleted, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState(comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setIsLiked(material.likes?.includes(currentUserId) || false);
  }, [material.likes, currentUserId]);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleLikeClick = () => {
    onLike(material.id, isLiked);
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = async (content) => {
    try {
      const response = await api.post('/comments', {
        materialId: material.id,
        content
      });
      setLocalComments([...localComments, response.data.comment]);
      onCommentAdded(material.id);
    } catch (error) {
      console.error('Error creando comentario:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    if (onMaterialUpdated) {
      onMaterialUpdated();
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/materials/${material.id}`);
      if (onMaterialDeleted) {
        onMaterialDeleted(material.id);
      }
    } catch (error) {
      console.error('Error eliminando material:', error);
      alert(error.response?.data?.error || 'Error al eliminar el material');
    }
  };

  const isOwner = material.userId === currentUserId;

  const getMaterialIcon = () => {
    switch (material.type) {
      case 'pdf':
        return <FiFileText className="h-5 w-5 text-red-600" />;
      case 'enlace':
        return <FiLink className="h-5 w-5 text-blue-600" />;
      default:
        return <FiBook className="h-5 w-5 text-green-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <MaterialEdit
        material={material}
        onCancel={handleEditCancel}
        onUpdated={handleEditSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="mt-1">
            {getMaterialIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {material.title}
              </h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {material.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <FiUser className="h-3 w-3" />
                <span>{material.userName}</span>
              </div>
              <span>•</span>
              <span>{formatDate(material.createdAt)}</span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="Editar material"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar material"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            ¿Estás seguro de que quieres eliminar este material? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Enlace o archivo */}
      {material.type === 'enlace' && material.url && (
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 text-primary-600 hover:text-primary-700 text-sm break-all"
        >
          {material.url}
        </a>
      )}

      {material.type === 'pdf' && material.url && (
        <a
          href={`http://localhost:5000${material.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 text-primary-600 hover:text-primary-700 text-sm"
        >
          📄 {material.fileName || 'Ver archivo PDF'}
        </a>
      )}

      {/* Acciones */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <FiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{material.likesCount || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <FiMessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">
            {localComments.length} comentarios
          </span>
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <CommentSection
            comments={localComments}
            onSubmit={handleCommentSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default MaterialCard;

