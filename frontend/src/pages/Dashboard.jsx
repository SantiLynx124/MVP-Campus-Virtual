/**
 * Dashboard principal - Lista de cursos
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { FiBook, FiUsers, FiCalendar, FiArrowRight, FiPlus, FiTrash2 } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
  });
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error obteniendo cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        description: form.description,
        semester: form.semester || '2024-2',
      };
      await api.post('/courses', payload);
      setForm({ name: '', code: '', description: '', semester: '' });
      fetchCourses();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear el curso';
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleDeleteCourse = async (e, course) => {
    e.stopPropagation();
    setDeleteError('');
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el curso "${course.name}" y todos sus materiales asociados?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/courses/${course.id}`);
      setCourses(courses.filter(c => c.id !== course.id));
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al eliminar el curso';
      setDeleteError(msg);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {user?.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Selecciona un curso para ver sus materiales y contenido
            </p>
          </div>

          {user?.role === 'docente' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-primary-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Crear curso</h2>
                  <p className="text-sm text-gray-500">Solo disponible para docentes</p>
                </div>
                <FiPlus className="h-6 w-6 text-primary-600" />
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {error}
                </div>
              )}

              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreateCourse}>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Programación Web"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="CS301"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre *</label>
                  <input
                    type="text"
                    required
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2024-2"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Descripción breve del curso"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creando...' : 'Crear curso'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deleteError && (
                <div className="md:col-span-3 mb-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {deleteError}
                </div>
              )}
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer card-hover fade-in"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FiBook className="h-6 w-6 text-primary-600" />
                      <span className="text-sm font-semibold text-gray-500">
                        {course.code}
                      </span>
                    </div>
                    {user?.role === 'docente' && user?.name === course.instructor && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCourse(e, course)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar curso"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiUsers className="h-4 w-4" />
                      <span>{course.studentsCount} estudiantes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="h-4 w-4" />
                      <span>{course.semester}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary-600 font-medium">
                    <span>Ver curso</span>
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay cursos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;



