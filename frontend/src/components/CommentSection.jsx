/**
 * Sección de comentarios
 * Muestra comentarios y permite agregar nuevos
 */

import { useState } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';

const CommentSection = ({ comments, onSubmit }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment('');
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

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-4">Comentarios</h4>
      
      {/* Lista de comentarios */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay comentarios aún. Sé el primero en comentar.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.userName}
                    </span>
                    {comment.userRole === 'docente' && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">
                        Docente
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario de nuevo comentario */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FiSend className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;



