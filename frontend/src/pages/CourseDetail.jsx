/**
 * Página de detalle del curso - Muestra materiales y permite interacción
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import MaterialCard from '../components/MaterialCard';
import MaterialUpload from '../components/MaterialUpload';
import api from '../services/api';
import { FiArrowLeft, FiBook, FiVideo, FiFileText, FiLink, FiUpload } from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchMaterials();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error obteniendo curso:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/materials/course/${id}`);
      setMaterials(response.data);
      
      // Cargar comentarios para cada material
      const commentsData = {};
      for (const material of response.data) {
        try {
          const commentsResponse = await api.get(`/comments/material/${material.id}`);
          commentsData[material.id] = commentsResponse.data;
        } catch (error) {
          commentsData[material.id] = [];
        }
      }
      setComments(commentsData);
    } catch (error) {
      console.error('Error obteniendo materiales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialUploaded = () => {
    setShowUpload(false);
    fetchMaterials();
  };

  const handleMaterialUpdated = () => {
    fetchMaterials();
  };

  const handleMaterialDeleted = (materialId) => {
    // Remover el material de la lista local
    setMaterials(materials.filter(m => m.id !== materialId));
    // También remover sus comentarios
    const newComments = { ...comments };
    delete newComments[materialId];
    setComments(newComments);
  };

  const handleLike = async (materialId, isLiked) => {
    try {
      if (isLiked) {
        await api.delete(`/materials/${materialId}/like`);
      } else {
        await api.post(`/materials/${materialId}/like`);
      }
      fetchMaterials();
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleCommentAdded = (materialId) => {
    fetchMaterials();
    // Recargar comentarios del material
    api.get(`/comments/material/${materialId}`)
      .then(response => {
        setComments(prev => ({
          ...prev,
          [materialId]: response.data
        }));
      });
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FiFileText className="h-5 w-5" />;
      case 'enlace':
        return <FiLink className="h-5 w-5" />;
      default:
        return <FiBook className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Volver a cursos
          </button>

          {course && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      {course.code}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Instructor: {course.instructor}</span>
                    <span>•</span>
                    <span>Semestre: {course.semester}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/course/${id}/live`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FiVideo className="h-5 w-5" />
                  <span>Clase en Vivo</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Materiales Compartidos</h2>
            {user?.role === 'estudiante' && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiUpload className="h-5 w-5" />
                <span>{showUpload ? 'Cancelar' : 'Subir Material'}</span>
              </button>
            )}
          </div>

          {showUpload && user?.role === 'estudiante' && (
            <MaterialUpload
              courseId={parseInt(id)}
              onUploaded={handleMaterialUploaded}
            />
          )}

          <div className="space-y-4">
            {materials.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay materiales compartidos aún</p>
                {user?.role === 'estudiante' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Sé el primero en compartir un material
                  </p>
                )}
              </div>
            ) : (
              materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  comments={comments[material.id] || []}
                  onLike={handleLike}
                  onCommentAdded={handleCommentAdded}
                  onMaterialUpdated={handleMaterialUpdated}
                  onMaterialDeleted={handleMaterialDeleted}
                  currentUserId={user?.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CourseDetail;

